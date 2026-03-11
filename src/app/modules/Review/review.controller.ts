import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ReviewService } from './review.service';

const createReview = catchAsync(async (req, res) => {
  const { userEmail } = req.user;

  const result = await ReviewService.createReviewInToDB(userEmail, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Review created successfully!!!',
    data: result?.createReview,
  });
});

const getAllReview = catchAsync(async (req, res) => {
  const query = req.query;

  const result = await ReviewService.getAllReviewFromDB(query);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Reviews are retrived successfully!!!',
    data: result?.result,
    meta: result?.meta,
  });
});

const getSingleReview = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await ReviewService.getSingleReviewFromDB(id as string);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Review is retrived successfully!!!',
    data: result?.result,
  });
});

const updateReview = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { userEmail } = req.user;

  const result = await ReviewService.updateReviewInToDB(
    userEmail,
    id as string,
    req.body,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Review is updated successfully!!!',
    data: result?.result,
  });
});

const deleteReview = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { userEmail } = req.user;

  const result = await ReviewService.deleteReviewFromDB(
    userEmail,
    id as string,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Review is deleted successfully!!!',
    data: result?.result,
  });
});

export const ReviewController = {
  createReview,
  getAllReview,
  getSingleReview,
  updateReview,
  deleteReview,
};
