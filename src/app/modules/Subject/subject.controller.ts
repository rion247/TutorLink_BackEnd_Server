import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { SubjectService } from './subject.service';

const createSubject = catchAsync(async (req, res) => {
  const result = await SubjectService.createSubjectInToDB(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Subject created successfully!!!',
    data: result?.createSubject,
  });
});

const getAllSubject = catchAsync(async (req, res) => {
  const query = req.query;

  const result = await SubjectService.getAllSubjectFromDB(query);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Subjects are retrived successfully!!!',
    data: result?.result,
    meta: result?.meta,
  });
});

const getSingleSubject = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await SubjectService.getSingleSubjectFromDB(id as string);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Subject is retrived successfully!!!',
    data: result?.result,
  });
});

const updateSubject = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await SubjectService.updateSubjectInToDB(
    id as string,
    req.body,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Subject is updated successfully!!!',
    data: result?.result,
  });
});

const deleteSubject = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await SubjectService.deleteSubjectFromDB(id as string);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Subject is deleted successfully!!!',
    data: result?.result,
  });
});

const updateStatusForSubject = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await SubjectService.updateStatusForSubjectFromDB(
    id as string,
    req.body,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Subject Stauts is updated successfully!!!',
    data: result?.result,
  });
});

export const SubjectController = {
  createSubject,
  getAllSubject,
  getSingleSubject,
  updateSubject,
  deleteSubject,
  updateStatusForSubject,
};
