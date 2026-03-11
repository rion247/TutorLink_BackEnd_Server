import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { BookingService } from './booking.service';

const createBooking = catchAsync(async (req, res) => {
  const { userEmail } = req.user;

  const result = await BookingService.createBookingInToDB(userEmail, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Booking is Processing!!!',
    data: result?.url,
  });
});

const confirmPayment = catchAsync(async (req, res) => {
  const { tran_id } = req.params;

  const result = await BookingService.confirmPaymentInToDB(tran_id as string);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Booking successfully!!!',
    data: result?.updateBookingDataForConfirmPayment,
  });
});

const paymentFailed = catchAsync(async (req, res) => {
  const { tran_id } = req.params;

  const result = await BookingService.paymentFailedInToDB(tran_id as string);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Booking failed!!!',
    data: result?.deleteBookingDataForFailedPayment,
  });
});

const getAllBooking = catchAsync(async (req, res) => {
  const query = req.query;

  const result = await BookingService.getAllBookingFromDB(query);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Bookings are retrieved successfully!!!',
    data: result?.result,
    meta: result?.meta,
  });
});

const getSingleBooking = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await BookingService.getSingleBookingFromDB(id as string);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Booking is retrieved successfully!!!',
    data: result?.result,
  });
});

const getMyBooking = catchAsync(async (req, res) => {
  const { userEmail } = req.user;

  const result = await BookingService.getMyBookingFromDB(userEmail);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Bookings are retrieved successfully!!!',
    data: result?.result,
  });
});

const updateMyBookingDeliveredStatus = catchAsync(async (req, res) => {
  const { userEmail } = req.user;
  const { id } = req.params;

  const result = await BookingService.updateMyBookingDeliveredStatusFromDB(
    userEmail,
    id as string,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Delivery done!!!',
    data: result?.result,
  });
});

export const BookingController = {
  createBooking,
  confirmPayment,
  paymentFailed,
  getAllBooking,
  getSingleBooking,
  getMyBooking,
  updateMyBookingDeliveredStatus,
};
