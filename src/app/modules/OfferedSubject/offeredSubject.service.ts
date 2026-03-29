/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCodes } from 'http-status-codes';
import {
  TOfferedSubject,
  TOfferedSubjectForUpdate,
} from './offeredSubject.interface';
import { OfferedSubject } from './offeredSubject.model';
import AppError from '../../errors/AppError';
import { Subject } from '../Subject/subject.model';
import { Tutor } from '../Tutor/tutor.model';
import { User } from '../User/user.model';
import QueryBuilder from './../../builder/QueryBuilder';
import { calculateHour, hasTimeConflict } from './offeredSubject.utils';
import { ObjectId } from 'mongodb';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';

const createOfferedSubjectInToDB = async (
  file: any,
  tutorInfo: string,
  payload: TOfferedSubject,
) => {
  const subjectID = payload?.subject;

  const userData = await User.findOne({ email: tutorInfo }).select('_id');

  const tutorData = await Tutor.findOne({
    user: userData?._id,
  });

  if (!tutorData) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      'Sorry!!! This tutor is not exist !!!',
    );
  }

  if (!tutorData?.isApproved) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'Sorry!!! Tutor Approval Pending !!!',
    );
  }

  if (tutorData?.isDeleted) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'Sorry!!! This Tutor is already deleted!!!',
    );
  }

  const subjectData = await Subject.findById(subjectID);

  if (!subjectData) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      'Sorry!!! This subject is not exist !!!',
    );
  }

  if (!subjectData?.isActive) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      'Sorry!!! This subject is not active !!!',
    );
  }

  if (payload?.startTime > payload?.endTime) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Time conflict detected!!!');
  }

  const offeredSubjectData = await OfferedSubject.find({
    tutor: tutorData?._id,
    day: payload?.day,
  }).select('day startTime endTime');

  const newTimeScheduled = {
    day: payload?.day,
    startTime: payload?.startTime,
    endTime: payload?.endTime,
  };

  if (
    offeredSubjectData &&
    hasTimeConflict(offeredSubjectData, newTimeScheduled)
  ) {
    throw new AppError(StatusCodes.BAD_REQUEST, `Time conflict detected!!!`);
  }

  const duration = calculateHour(payload?.startTime, payload?.endTime);

  if (file) {
    const path = file?.path;

    const imageName = new ObjectId().toString();

    const { secure_url } = await sendImageToCloudinary(imageName, path);
    payload.offeredSubjectImage = secure_url as string;
  }

  const offeredSubjectInfoForBackEnd = {
    ...payload,
    duration,
    tutor: tutorData?._id,
  };

  const createOfferedSubject = await OfferedSubject.create(
    offeredSubjectInfoForBackEnd,
  );

  return { createOfferedSubject };
};

const getAllOfferedSubjectInToDB = async (query: Record<string, unknown>) => {
  const offeredSubjectQuery = new QueryBuilder(
    OfferedSubject.find().populate('tutor subject'),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await offeredSubjectQuery.modelQuery;
  const meta = await offeredSubjectQuery.countTotal();

  return { result, meta };
};

const getSingleOfferedSubjectInToDB = async (id: string) => {
  const getSingleOfferedSubject =
    await OfferedSubject.findById(id).populate('tutor subject');

  return { getSingleOfferedSubject };
};

const deleteOfferedSubjectInToDB = async (email: string, id: string) => {
  const userData = await User.findOne({ email });

  const tutorData = await Tutor.findOne({ user: userData?._id });

  if (!tutorData) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      'Sorry!!! This tutor is not exist !!!',
    );
  }

  if (!tutorData?.isApproved) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'Sorry!!! Tutor Approval Pending !!!',
    );
  }

  if (tutorData?.isDeleted) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'Sorry!!! This Tutor is already deleted!!!',
    );
  }

  const offeredSubjectData = await OfferedSubject.findById(id);

  if (!offeredSubjectData) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      'Sorry!!! This offered subject is not exist !!!',
    );
  }

  if (tutorData?._id?.toString() !== offeredSubjectData?.tutor?.toString()) {
    throw new AppError(
      StatusCodes.UNAUTHORIZED,
      'Sorry!!! You are not authorized !!!',
    );
  }

  const deleteOfferedSubject = await OfferedSubject.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true, runValidators: true },
  );

  return { deleteOfferedSubject };
};

const updateOfferedSubjectSlotDataInToDB = async (
  id: string,
  email: string,
  file: any,
  payload: TOfferedSubjectForUpdate,
) => {
  const userData = await User.isUserExist(email);

  const tutorData = await Tutor.findOne({ user: userData?._id });

  if (!tutorData) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      'Sorry!!! This tutor is not exist !!!',
    );
  }

  if (!tutorData?.isApproved) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'Sorry!!! Tutor Approval Pending !!!',
    );
  }

  if (tutorData?.isDeleted) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'Sorry!!! This Tutor is already deleted!!!',
    );
  }

  const offeredSubjectDataWithTutorInformation = await OfferedSubject.find({
    tutor: tutorData?._id,
  }).select('day startTime endTime tutor duration');

  const getUpdateRequestOfferedSubjectData =
    offeredSubjectDataWithTutorInformation?.find(
      (item) => item?._id?.toString() === id,
    );

  if (!getUpdateRequestOfferedSubjectData) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      'Sorry!!! This offered subject is not exist !!!',
    );
  }

  if (getUpdateRequestOfferedSubjectData?.isActive === false) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'Sorry!!! This offered subject is not active !!!',
    );
  }

  if (
    getUpdateRequestOfferedSubjectData?.tutor?.toString() !==
    tutorData?._id?.toString()
  ) {
    throw new AppError(
      StatusCodes.UNAUTHORIZED,
      'Sorry!!! You are not authorized !!!',
    );
  }

  if (
    payload?.startTime &&
    payload?.endTime &&
    payload?.startTime > payload?.endTime
  ) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Time conflict detected!!!');
  }

  const newTimeScheduled = {
    day: payload?.day,
    startTime: payload?.startTime,
    endTime: payload?.endTime,
  };

  const forTimeConflictChecking = offeredSubjectDataWithTutorInformation.filter(
    (item) => item._id !== getUpdateRequestOfferedSubjectData?._id,
  );

  if (
    forTimeConflictChecking &&
    hasTimeConflict(forTimeConflictChecking, newTimeScheduled)
  ) {
    throw new AppError(StatusCodes.BAD_REQUEST, `Time conflict detected!!!`);
  }

  let duration = getUpdateRequestOfferedSubjectData?.duration;

  if (payload?.startTime && payload?.endTime) {
    duration = calculateHour(payload?.startTime, payload?.endTime);
  }

  if (file) {
    const path = file?.path;

    const imageName = new ObjectId().toString();

    const { secure_url } = await sendImageToCloudinary(imageName, path);
    payload.offeredSubjectImage = secure_url as string;
  }

  const result = await OfferedSubject.findByIdAndUpdate(
    getUpdateRequestOfferedSubjectData?._id,
    { ...payload, duration },
    { new: true, runValidators: true },
  );

  return { result };
};

export const OfferedSubjectService = {
  createOfferedSubjectInToDB,
  getAllOfferedSubjectInToDB,
  getSingleOfferedSubjectInToDB,
  deleteOfferedSubjectInToDB,
  updateOfferedSubjectSlotDataInToDB,
};
