/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';
import { User } from '../User/user.model';
import { TBooking, TPaymentInformation } from './booking.interface';
import { Student } from '../Student/student.model';
import { OfferedSubject } from '../OfferedSubject/offeredSubject.model';
import { ObjectId } from 'mongodb';
import { Booking } from './booking.model';
import { Subject } from '../Subject/subject.model';
import { sslPayment } from './booking.utils';
import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import { searchAbleField } from './booking.constant';
import { Tutor } from '../Tutor/tutor.model';
import { USER_ROLE } from '../Auth/auth.constant';

const createBookingInToDB = async (email: string, payload: TBooking) => {
  const userData = await User.findOne({ email }).select('_id');

  const studentData = await Student.findOne({ user: userData?._id });

  if (!studentData) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      'Sorry!!! This student is not exist !!!',
    );
  }

  if (studentData?.isDeleted) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'Sorry!!! This student is already deleted !!!',
    );
  }

  const studentID = studentData?._id;

  const offeredSubjectData = await OfferedSubject.findById(
    payload?.offeredSubject,
  );

  if (!offeredSubjectData) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      'Sorry!!! This offered subject is not exist !!!',
    );
  }

  if (offeredSubjectData?.isActive === false) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'Sorry!!! This offered subject is inactive !!!',
    );
  }

  if (offeredSubjectData?.maxCapacity <= 0) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Sorry!!! Capacity is Full!!!');
  }

  const subjectData = await Subject.findOne({
    _id: offeredSubjectData?.subject,
  });

  if (!subjectData) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      'Sorry!!! This subject is not exist !!!',
    );
  }

  if (subjectData?.isActive === false) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'Sorry!!! This subject is inactive !!!',
    );
  }

  const alreadyBooked = await Booking.findOne({
    student: studentID,
    offeredSubject: payload?.offeredSubject,
    slotId: payload?.slotId,
  });

  if (alreadyBooked) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'Sorry!!! You already booked this session!!!',
    );
  }

  const tran_id = new ObjectId().toString();

  const total_amount =
    availableSlotsData?.pricePerHour * availableSlotsData?.duration;

  const paymentInfo: TPaymentInformation = {
    tran_id,
    total_amount,
    product_name: subjectData?.name,
    cus_name: `${studentData?.name?.firstName} ${studentData?.name?.lastName}`,
    cus_email: userData?.email as string,
    cus_add1: studentData?.address,
  };

  const bookingInfoForBackEnd = {
    ...payload,
    student: studentID,
    tutor: offeredSubjectData?.tutor,
    transactionID: tran_id,
    bookingStatus: 'pending',
    paymentStatus: 'unpaid',
    isDelivered: false,
  };

  const createBooking = await Booking.create(bookingInfoForBackEnd);

  const makePayment = await sslPayment(paymentInfo);

  return { createBooking, url: makePayment?.GatewayPageURL };
};

const confirmPaymentInToDB = async (tran_id: string) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const updateBookingDataForConfirmPayment = await Booking.findOneAndUpdate(
      {
        transactionID: tran_id,
      },
      {
        bookingStatus: 'confirmed',
        paymentStatus: 'paid',
      },
      { new: true, runValidators: true, session },
    );

    if (!updateBookingDataForConfirmPayment) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        'Sorry!!! Payment Confirmation Failed!!!',
      );
    }

    await OfferedSubject.findOneAndUpdate(
      {
        _id: updateBookingDataForConfirmPayment?.offeredSubject,
        'availableSlots._id': updateBookingDataForConfirmPayment?.slotId,
      },
      { $inc: { 'availableSlots.$.currentlyBooked': 1 } },
      { new: true, runValidators: true, session },
    );

    await session.commitTransaction();
    await session.endSession();

    return { updateBookingDataForConfirmPayment };
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const paymentFailedInToDB = async (tran_id: string) => {
  const deleteBookingDataForFailedPayment = await Booking.findOneAndDelete(
    {
      transactionID: tran_id,
    },
    { new: true },
  );

  return { deleteBookingDataForFailedPayment };
};

const getAllBookingFromDB = async (query: Record<string, unknown>) => {
  const bookingQuery = new QueryBuilder(
    Booking.find().populate('student offeredSubject tutor'),
    query,
  )
    .search(searchAbleField)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await bookingQuery.modelQuery;
  const meta = await bookingQuery.countTotal();

  return { result, meta };
};

const getSingleBookingFromDB = async (id: string) => {
  const result = await Booking.findById(id).populate(
    'student offeredSubject tutor',
  );

  return { result };
};

const getMyBookingFromDB = async (email: string) => {
  const userData = await User.findOne({ email });

  let result = {};

  if (userData?.role === USER_ROLE?.student) {
    const studentData = await Student.findOne({ user: userData?._id });

    if (!studentData) {
      throw new AppError(
        StatusCodes.NOT_FOUND,
        'Sorry!!! This student is not exist !!!',
      );
    }

    if (studentData?.isDeleted) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        'Sorry!!! This student is already deleted !!!',
      );
    }

    const studentID = studentData?._id;

    result = await Booking.find({ student: studentID }).populate(
      'student offeredSubject tutor',
    );
  }

  if (userData?.role === USER_ROLE.tutor) {
    const tutorData = await Tutor.findOne({ user: userData?._id });

    if (!tutorData) {
      throw new AppError(
        StatusCodes.NOT_FOUND,
        'Sorry!!! This tutor is not exist !!!',
      );
    }

    if (tutorData?.isDeleted) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        'Sorry!!! This tutor is already deleted !!!',
      );
    }

    const tutorID = tutorData?._id;
    result = await Booking.find({ tutor: tutorID }).populate(
      'student offeredSubject tutor',
    );
  }

  return { result };
};

const updateMyBookingDeliveredStatusFromDB = async (
  email: string,
  id: string,
) => {
  const userData = await User.findOne({ email });

  const tutorData = await Tutor.findOne({ user: userData?._id });

  const bookingData = await Booking.findById(id);

  if (!tutorData) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      'Sorry!!! This tutor is not exist !!!',
    );
  }

  if (tutorData?.isDeleted) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'Sorry!!! This tutor is already deleted !!!',
    );
  }

  const tutorID = tutorData?._id;

  if (!bookingData) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      'Sorry!!! This booking is not exist !!!',
    );
  }

  if (tutorID.toString() !== bookingData?.tutor?.toString()) {
    throw new AppError(
      StatusCodes.UNAUTHORIZED,
      'Sorry!!! You are not authorized !!!',
    );
  }

  const result = await Booking.findByIdAndUpdate(
    id,
    { isDelivered: true },
    { new: true, runValidators: true },
  );

  return { result };
};

export const BookingService = {
  createBookingInToDB,
  confirmPaymentInToDB,
  paymentFailedInToDB,
  getAllBookingFromDB,
  getSingleBookingFromDB,
  getMyBookingFromDB,
  updateMyBookingDeliveredStatusFromDB,
};
