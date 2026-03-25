import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { OfferedSubjectService } from './offeredSubject.service';

const createOfferedSubject = catchAsync(async (req, res) => {
  const { userEmail } = req.user;

  const result = await OfferedSubjectService.createOfferedSubjectInToDB(
    userEmail,
    req.body,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Offered Subject created successfully!!!',
    data: result?.createOfferedSubject,
  });
});

const getAllOfferedSubject = catchAsync(async (req, res) => {
  const query = req.query;

  const result = await OfferedSubjectService.getAllOfferedSubjectInToDB(query);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Offered Subject are retrived successfully!!!',
    data: result?.result,
    meta: result?.meta,
  });
});

const getSingleOfferedSubject = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await OfferedSubjectService.getSingleOfferedSubjectInToDB(
    id as string,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Offered Subject is retrived successfully!!!',
    data: result?.getSingleOfferedSubject,
  });
});

const deleteOfferedSubject = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { userEmail } = req.user;

  const result = await OfferedSubjectService.deleteOfferedSubjectInToDB(
    userEmail,
    id as string,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Offered Subject is deleted successfully!!!',
    data: result?.deleteOfferedSubject,
  });
});

const updateOfferedSubject = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { userEmail } = req.user;

  const result = await OfferedSubjectService.updateOfferedSubjectSlotDataInToDB(
    id as string,
    userEmail,
    req.body,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Offered Subject updated successfully!!!',
    data: result,
  });
});

export const OfferedSubjectController = {
  createOfferedSubject,
  getAllOfferedSubject,
  getSingleOfferedSubject,
  deleteOfferedSubject,
  updateOfferedSubject,
};
