/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';
import { TStudent } from '../Student/student.interface';
import { TUser, TUserInformationForJWT } from './user.interface';
import { User } from './user.model';
import mongoose from 'mongoose';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';
import { Student } from '../Student/student.model';
import { tokenGenerator } from '../Auth/auth.utils';
import config from '../../config';
import { SignOptions } from 'jsonwebtoken';
import { TAdmin } from '../Admin/admin.interface';
import { Admin } from '../Admin/admin.model';
import { TTutor } from '../Tutor/tutor.interface';
import { Tutor } from '../Tutor/tutor.model';
import { USER_ROLE } from '../Auth/auth.constant';

const createStudentInToDB = async (
  file: any,
  email: string,
  password: string,
  studentData: TStudent,
) => {
  if (await User.isUserExist(email)) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'Sorry!!! This user already exist !!!',
    );
  }

  const userDataForBackEnd: TUser = {
    email,
    password,
    needsPasswordChange: true,
    role: 'student',
    status: 'in-progress',
    isDeleted: false,
  };

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    if (file) {
      const path = file?.path;

      const imageName = `${studentData?.name?.firstName}`;

      const { secure_url } = await sendImageToCloudinary(imageName, path);

      studentData.profileImage = secure_url as string;
    }

    const createNewUser = await User.create([userDataForBackEnd], {
      session,
    });

    if (!createNewUser.length) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        'Sorry!!! Unable to create user!!!',
      );
    }

    studentData.user = createNewUser[0]._id;
    studentData.isDeleted = false;

    const createNewStudent = await Student.create([studentData], { session });

    if (!createNewStudent.length) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        'Sorry!!! Unable to create student!!!',
      );
    }

    const userInformationForJWT: TUserInformationForJWT = {
      userEmail: createNewUser[0]?.email,
      role: createNewUser[0]?.role,
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

    await session.commitTransaction();
    await session.endSession();
    return { accessToken, refreshToken, createNewStudent };
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const createAdminInToDB = async (
  file: any,
  email: string,
  password: string,
  adminData: TAdmin,
) => {
  if (await User.isUserExist(email)) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'Sorry!!! This admin already exist !!!',
    );
  }

  const userDataForBackEnd: TUser = {
    email,
    password,
    needsPasswordChange: true,
    role: 'admin',
    status: 'in-progress',
    isDeleted: false,
  };

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    if (file) {
      const path = file?.path;

      const imageName = `${adminData?.name?.firstName}`;

      const { secure_url } = await sendImageToCloudinary(imageName, path);

      adminData.profileImage = secure_url as string;
    }

    const createNewUser = await User.create([userDataForBackEnd], {
      session,
    });

    if (!createNewUser.length) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        'Sorry!!! Unable to create user!!!',
      );
    }

    adminData.user = createNewUser[0]._id;
    adminData.isDeleted = false;

    const createNewAdmin = await Admin.create([adminData], { session });

    if (!createNewAdmin.length) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        'Sorry!!! Unable to create admin!!!',
      );
    }

    const userInformationForJWT: TUserInformationForJWT = {
      userEmail: createNewUser[0]?.email,
      role: createNewUser[0]?.role,
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

    await session.commitTransaction();
    await session.endSession();
    return { accessToken, refreshToken, createNewAdmin };
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const createTutorInToDB = async (
  file: any,
  email: string,
  password: string,
  tutorData: TTutor,
) => {
  if (await User.isUserExist(email)) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'Sorry!!! This user already exist !!!',
    );
  }

  const userDataForBackEnd: TUser = {
    email,
    password,
    needsPasswordChange: true,
    role: 'tutor',
    status: 'in-progress',
    isDeleted: false,
  };

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    if (file) {
      const path = file?.path;

      const imageName = `${tutorData?.name?.firstName}`;

      const { secure_url } = await sendImageToCloudinary(imageName, path);

      tutorData.profileImage = secure_url as string;
    }

    const createNewUser = await User.create([userDataForBackEnd], {
      session,
    });

    if (!createNewUser.length) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        'Sorry!!! Unable to create user!!!',
      );
    }

    tutorData.averageRating = 0;
    tutorData.totalReviews = 0;

    tutorData.user = createNewUser[0]._id;
    tutorData.isApproved = false;
    tutorData.isDeleted = false;

    const createNewTutor = await Tutor.create([tutorData], { session });

    if (!createNewTutor.length) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        'Sorry!!! Unable to create tutor!!!',
      );
    }

    const userInformationForJWT: TUserInformationForJWT = {
      userEmail: createNewUser[0]?.email,
      role: createNewUser[0]?.role,
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

    await session.commitTransaction();
    await session.endSession();
    return { accessToken, refreshToken, createNewTutor };
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

export const getMeFromDB = async (email: string, role: string) => {
  let result = null;

  const userData = await User.findOne({ email });

  const userId = userData?._id;

  if (role === USER_ROLE.admin) {
    result = await Admin.findOne({ user: userId }).populate('user');
  }

  if (role === USER_ROLE.student) {
    result = await Student.findOne({ user: userId }).populate('user');
  }

  if (role === USER_ROLE.tutor) {
    result = await Tutor.findOne({ user: userId });
  }

  return { result };
};

export const UserService = {
  createStudentInToDB,
  createAdminInToDB,
  createTutorInToDB,
  getMeFromDB,
};
