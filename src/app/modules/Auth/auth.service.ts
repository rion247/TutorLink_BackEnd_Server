import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';
import { User } from '../User/user.model';
import { TChangeUserPassword, TLoginUser } from './auth.interface';
import { TUserInformationForJWT } from '../User/user.interface';
import { tokenGenerator, verifyToken } from './auth.utils';
import config from '../../config';
import { SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import sendEmail from '../../utils/sendEmail';

const loginUserInToDB = async (payload: TLoginUser) => {
  const userData = await User.isUserExist(payload?.email);

  const userStatus = userData?.status;

  const needsPasswordChange = userData?.needsPasswordChange;

  if (!userData) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      'Sorry! This user is not found!!!',
    );
  }

  if (userData?.isDeleted) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'Sorry! This user is already deleted!!!',
    );
  }

  if (userStatus === 'blocked') {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'Sorry! This user is already blocked!!!',
    );
  }

  if (
    !(await User.isUserPasswordMatched(payload?.password, userData?.password))
  ) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Sorry! Wrong Password!!!');
  }

  const userInformationForJWT: TUserInformationForJWT = {
    userEmail: userData?.email,
    role: userData?.role,
  };

  const accessToken = tokenGenerator(
    userInformationForJWT,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as SignOptions['expiresIn'],
  );

  const refreshToken = tokenGenerator(
    userInformationForJWT,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as SignOptions['expiresIn'],
  );

  return { accessToken, refreshToken, needsPasswordChange };
};

const changeUserPasswordInToDB = async (
  email: string,
  payload: TChangeUserPassword,
) => {
  const userData = await User.isUserExist(email);

  if (!userData) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      'Sorry! This user is not found!!!',
    );
  }

  if (
    !(await User.isUserPasswordMatched(
      payload?.oldPassword,
      userData?.password,
    ))
  ) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Sorry! Wrong Password!!!');
  }

  const hashedPassword = await bcrypt.hash(
    payload?.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  await User.findByIdAndUpdate(
    userData?._id,
    {
      password: hashedPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    },
    { new: true, runValidators: true },
  );

  return null;
};

const refreshTokenFromDB = async (token: string) => {
  const decoded = verifyToken(token, config.jwt_refresh_secret as string);

  const { userEmail, iat } = decoded;

  const userData = await User.findOne({ email: userEmail });

  if (!userData) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      'Sorry! This user is not found!!!',
    );
  }

  if (userData?.isDeleted) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'Sorry! This user is already deleted!!!',
    );
  }

  if (userData?.status === 'blocked') {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'Sorry! This user is already blocked!!!',
    );
  }

  if (
    userData?.passwordChangedAt &&
    User.isUserPasswordIssuedBeforeJWTToken(
      userData?.passwordChangedAt,
      iat as number,
    )
  ) {
    throw new AppError(
      StatusCodes.UNAUTHORIZED,
      'Sorry!!! You are not authorized!!!',
    );
  }

  const userInformationForJWT: TUserInformationForJWT = {
    userEmail: userData?.email,
    role: userData?.role,
  };

  const accessToken = tokenGenerator(
    userInformationForJWT,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as SignOptions['expiresIn'],
  );

  return { accessToken };
};

const generateForgetPasswordLink = async (email: string) => {
  const userData = await User.isUserExist(email);

  if (!userData) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      'Sorry! This user is not found!!!',
    );
  }

  if (userData?.isDeleted) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'Sorry! This user is already deleted!!!',
    );
  }

  if (userData?.status === 'blocked') {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'Sorry! This user is already blocked!!!',
    );
  }

  const userInformationForJWT: TUserInformationForJWT = {
    userEmail: userData?.email,
    role: userData?.role,
  };

  const resetToken = tokenGenerator(
    userInformationForJWT,
    config.jwt_access_secret as string,
    '10m',
  );

  const forgetPasswordLink = `${config.reset_password_ui_link}?email=${userData?.email}&token=${resetToken}`;

  sendEmail(userData?.email, forgetPasswordLink);
};

const resetPasswordInToDB = async (
  payload: {
    email: string;
    newPassword: string;
  },
  token: string,
) => {
  const userData = await User.isUserExist(payload?.email);

  if (!userData) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      'Sorry! This user is not found!!!',
    );
  }

  if (userData?.isDeleted) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'Sorry! This user is already deleted!!!',
    );
  }

  if (userData?.status === 'blocked') {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'Sorry! This user is already blocked!!!',
    );
  }

  const { userEmail } = verifyToken(token, config.jwt_access_secret as string);

  if (userEmail !== payload?.email) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      'Sorry! You are not authorized!!!',
    );
  }

  const newHashedPassword = await bcrypt.hash(
    payload?.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  await User.findOneAndUpdate(
    { email: userEmail },
    {
      password: newHashedPassword,
      passwordChangedAt: new Date(),
      needsPasswordChange: false,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  return null;
};

export const AuthService = {
  loginUserInToDB,
  changeUserPasswordInToDB,
  generateForgetPasswordLink,
  refreshTokenFromDB,
  resetPasswordInToDB,
};
