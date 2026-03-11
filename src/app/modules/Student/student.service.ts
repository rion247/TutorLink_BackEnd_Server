/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCodes } from 'http-status-codes';
import QueryBuilder from '../../builder/QueryBuilder';
import { User } from '../User/user.model';
import { searchAbleFieldsArray } from './student.constant';
import { Student } from './student.model';
import AppError from '../../errors/AppError';
import mongoose from 'mongoose';
import { TStudent } from './student.interface';

const getAllStudentFromDB = async (query: Record<string, unknown>) => {
  const studentQuery = new QueryBuilder(Student.find().populate('user'), query)
    .search(searchAbleFieldsArray)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await studentQuery.modelQuery;
  const meta = await studentQuery.countTotal();

  return { result, meta };
};

const getSingleStudentFromDB = async (id: string) => {
  const result = await Student.findById(id).populate('user');

  return { result };
};

const deleteStudentFromDB = async (email: string) => {
  const userData = await User.findOne({ email });

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
      'Sorry!!! This student already deleted !!!',
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

    const result = await Student.findByIdAndUpdate(
      studentData?._id,
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

const updateStudentInToDB = async (
  email: string,
  payload: Partial<TStudent>,
) => {
  const { name, ...remainingData } = payload;

  const userData = await User.findOne({ email });

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
      'Sorry!!! This student already deleted !!!',
    );
  }

  const modifiedData: Record<string, unknown> = { ...remainingData };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedData[`name.${key}`] = value;
    }
  }

  const result = await Student.findByIdAndUpdate(
    studentData?._id,
    { ...modifiedData },
    { new: true, runValidators: true },
  );

  return { result };
};

export const StudentService = {
  getAllStudentFromDB,
  getSingleStudentFromDB,
  deleteStudentFromDB,
  updateStudentInToDB,
};
