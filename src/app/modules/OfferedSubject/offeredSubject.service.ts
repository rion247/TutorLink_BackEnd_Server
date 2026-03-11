import { StatusCodes } from 'http-status-codes';
import { TAvailability, TOfferedSubject } from './offeredSubject.interface';
import { OfferedSubject } from './offeredSubject.model';
import AppError from '../../errors/AppError';
import { Subject } from '../Subject/subject.model';
import {
  comparisonWithNewDataAndExistingData,
  selfComparisonWithNewData,
} from './offeredCourse.utils';
import { Tutor } from '../Tutor/tutor.model';
import { User } from '../User/user.model';
import QueryBuilder from './../../builder/QueryBuilder';

const createOfferedSubjectInToDB = async (
  tutorInfo: string,
  payload: TOfferedSubject,
) => {
  const subjectID = payload?.subject;

  const userData = await User.findOne({ email: tutorInfo });

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

  const offeredSubjectData = await OfferedSubject.findOne({
    tutor: tutorData?._id,
    subject: payload?.subject,
  });

  const existingTimeScheduled = offeredSubjectData?.availableSlots;

  const slots = payload?.availableSlots;

  if (selfComparisonWithNewData(slots)) {
    throw new AppError(StatusCodes.BAD_REQUEST, `Time conflict detected!!!`);
  }

  if (existingTimeScheduled && existingTimeScheduled.length > 0) {
    if (comparisonWithNewDataAndExistingData(existingTimeScheduled, slots)) {
      throw new AppError(StatusCodes.BAD_REQUEST, `Time conflict detected!!!`);
    }
  }

  const offeredSubjectInfoForBackEnd = {
    ...payload,
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

  const deleteOfferedSubject = await OfferedSubject.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true, runValidators: true },
  );

  return { deleteOfferedSubject };
};

const updateOfferedSubjectSlotDataInToDB = async (
  email: string,
  id: string,
  payload: Partial<TAvailability>,
  slotId: string,
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

  const offeredSubjectData = await OfferedSubject.findById(id);

  if (!offeredSubjectData) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      'Sorry!!! This offered subject is not exist !!!',
    );
  }

  if (!offeredSubjectData?.isActive) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'Sorry!!! This offered subject is not active !!!',
    );
  }

  if (offeredSubjectData?.tutor?.toString() !== tutorData?._id?.toString()) {
    throw new AppError(
      StatusCodes.UNAUTHORIZED,
      'Sorry!!! You are not authorized !!!',
    );
  }

  const isSlotExisting = offeredSubjectData?.availableSlots?.find(
    (slot) => slot?._id?.toString() === slotId?.toString(),
  );

  if (!isSlotExisting) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      'Sorry!!! This slot is not exist !!!',
    );
  }

  const updatedSlot = {
    ...isSlotExisting,
    ...payload,
  };

  const otherSlots = offeredSubjectData.availableSlots.filter(
    (s) => s._id.toString() !== slotId,
  );

  const newSlotArray = [updatedSlot];

  if (
    comparisonWithNewDataAndExistingData(
      otherSlots as TAvailability[],
      newSlotArray as TAvailability[],
    )
  ) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Time conflict detected');
  }

  Object.assign(isSlotExisting, payload);

  const result = await offeredSubjectData.save();

  return { result };
};

export const OfferedSubjectService = {
  createOfferedSubjectInToDB,
  getAllOfferedSubjectInToDB,
  getSingleOfferedSubjectInToDB,
  deleteOfferedSubjectInToDB,
  updateOfferedSubjectSlotDataInToDB,
};
