import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import { TutorService } from './tutor.service';
import sendResponse from '../../utils/sendResponse';

const getAllTutor = catchAsync(async (req, res) => {
  const query = req.query;
  const result = await TutorService.getAllTutorFromDB(query);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Tutors are retrived successfully!!!',
    data: result?.result,
  });
});

const getSingleTutor = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await TutorService.getSingleTutorFromDB(id as string);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Tutor is retrived successfully!!!',
    data: result?.result,
  });
});

const deleteTutor = catchAsync(async (req, res) => {
  const { userEmail } = req.user;

  const result = await TutorService.deleteTutorFromDB(userEmail);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Tutor is deleted successfully!!!',
    data: result?.result,
  });
});

const updateTutor = catchAsync(async (req, res) => {
  const { userEmail } = req.user;

  const result = await TutorService.updateTutorInToDB(userEmail, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Tutor data is updated successfully!!!',
    data: result?.result,
  });
});

export const TutorController = {
  getAllTutor,
  getSingleTutor,
  updateTutor,
  deleteTutor,
};
