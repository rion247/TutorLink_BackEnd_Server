/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCodes } from 'http-status-codes';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { User } from '../User/user.model';
import { searchAbleFieldsArray } from './tutor.constant';
import { Tutor } from './tutor.model';
import mongoose from 'mongoose';
import { TTutor } from './tutor.interface';

const getAllTutorFromDB = async (query: Record<string, unknown>) => {
  const tutorQuery = new QueryBuilder(Tutor.find().populate('user'), query)
    .search(searchAbleFieldsArray)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await tutorQuery.modelQuery;
  const meta = await tutorQuery.countTotal();

  return { result, meta };
};

const getSingleTutorFromDB = async (id: string) => {
  const result = await Tutor.findById(id).populate('user');

  return { result };
};

const deleteTutorFromDB = async (email: string) => {
  const userData = await User.findOne({ email });

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
      'Sorry!!! This tutor already deleted !!!',
    );
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const deleteUser = await User.findByIdAndUpdate(
      userData?._id,
      { isDeleted: true },
      { session, new: true, runValidators: true },
    );

    if (!deleteUser) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        'Unable to delete this user from Database!!!',
      );
    }

    const result = await Tutor.findByIdAndUpdate(
      tutorData?._id,
      { isDeleted: true },
      { new: true, runValidators: true },
    );

    if (!result) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        'Unable to delete this student!!!',
      );
    }

    await session.commitTransaction();
    await session.endSession();
    return { result };
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const updateTutorInToDB = async (email: string, payload: Partial<TTutor>) => {
  const { name, ...remainingData } = payload;

  const userData = await User.findOne({ email });

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
      'Sorry!!! This tutor already deleted !!!',
    );
  }

  const modifiedData: Record<string, unknown> = { ...remainingData };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedData[`name.${key}`] = value;
    }
  }

  const result = await Tutor.findByIdAndUpdate(
    tutorData?._id,
    { ...modifiedData },
    { new: true, runValidators: true },
  );

  return { result };
};

export const TutorService = {
  getAllTutorFromDB,
  getSingleTutorFromDB,
  deleteTutorFromDB,
  updateTutorInToDB,
};
