import { StatusCodes } from 'http-status-codes';
import config from '../../config';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthService } from './auth.service';

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthService.loginUserInToDB(req.body);

  res.cookie('refreshToken', result?.refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User Login successfully!!!',
    data: {
      accessToken: result?.accessToken,
      needsPasswordChange: result?.needsPasswordChange,
    },
  });
});

const changeUserPassword = catchAsync(async (req, res) => {
  const { userEmail } = req.user;

  const result = await AuthService.changeUserPasswordInToDB(
    userEmail,
    req.body,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Password changed successfully!!!',
    data: result,
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken: token } = req.cookies;

  const result = await AuthService.refreshTokenFromDB(token);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Access Token is retrived successfully!!!',
    data: result,
  });
});

const forgetPassword = catchAsync(async (req, res) => {
  const { email } = req.body;

  const result = await AuthService.generateForgetPasswordLink(email);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Forget Password Link is retrived successfully!!!',
    data: result,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const token = req?.headers?.authorization;

  const result = await AuthService.resetPasswordInToDB(
    req.body,
    token as string,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Password changed successfully!!!',
    data: result,
  });
});

export const AuthController = {
  loginUser,
  changeUserPassword,
  refreshToken,
  forgetPassword,
  resetPassword,
};
