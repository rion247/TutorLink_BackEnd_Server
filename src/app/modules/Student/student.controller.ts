import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { StudentService } from './student.service';

const getAllStudent = catchAsync(async (req, res) => {
  const query = req.query;
  const result = await StudentService.getAllStudentFromDB(query);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Students are retrived successfully!!!',
    data: result?.result,
  });
});

const getSingleStudent = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await StudentService.getSingleStudentFromDB(id as string);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Student is retrived successfully!!!',
    data: result?.result,
  });
});

const deleteStudent = catchAsync(async (req, res) => {
  const { userEmail } = req.user;

  const result = await StudentService.deleteStudentFromDB(userEmail);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Student is deleted successfully!!!',
    data: result?.result,
  });
});

const updateStudent = catchAsync(async (req, res) => {
  const { userEmail } = req.user;

  const result = await StudentService.updateStudentInToDB(userEmail, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Student data is updated successfully!!!',
    data: result?.result,
  });
});

export const StudentController = {
  getAllStudent,
  getSingleStudent,
  deleteStudent,
  updateStudent,
};
