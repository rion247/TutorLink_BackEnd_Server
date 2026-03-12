import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserService } from './user.service';
import config from '../../config';

const createStudent = catchAsync(async (req, res) => {
  const { email, password, student } = req.body;

  const result = await UserService.createStudentInToDB(
    req.file,
    email,
    password,
    student,
  );

  res.cookie('refreshToken', result?.refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Student registered successfully!!!',
    data: {
      accessToken: result?.accessToken,
      refreshToken: result?.refreshToken,
      data: result?.createNewStudent,
    },
  });
});

const createAdmin = catchAsync(async (req, res) => {
  const { email, password, admin } = req.body;

  const result = await UserService.createAdminInToDB(
    req.file,
    email,
    password,
    admin,
  );

  res.cookie('refreshToken', result?.refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Admin registered successfully!!!',
    data: {
      accessToken: result?.accessToken,
      refreshToken: result?.refreshToken,
      data: result?.createNewAdmin,
    },
  });
});

const createTutor = catchAsync(async (req, res) => {
  const { email, password, tutor } = req.body;

  const result = await UserService.createTutorInToDB(
    req.file,
    email,
    password,
    tutor,
  );

  res.cookie('refreshToken', result?.refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Tutor registered successfully!!!',
    data: {
      accessToken: result?.accessToken,
      refreshToken: result?.refreshToken,
      data: result?.createNewTutor,
    },
  });
});

const getMe = catchAsync(async (req, res) => {
  const { userEmail, role } = req.user;

  const result = await UserService.getMeFromDB(userEmail, role);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User is retrived successfully!!!',
    data: result?.result,
  });
});

export const UserController = {
  createStudent,
  createAdmin,
  createTutor,
  getMe,
};
