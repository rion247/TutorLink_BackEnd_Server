import { StatusCodes } from 'http-status-codes';
import { TReview } from './review.interface';
import { Review } from './review.model';
import AppError from '../../errors/AppError';
import { User } from '../User/user.model';
import { Student } from '../Student/student.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { searchAbleFieldsArray } from './review.constant';

const createReviewInToDB = async (email: string, payload: TReview) => {
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

  const studentId = studentData?._id;

  const isReviewAlreadyExist = await Review.findOne({
    tutor: payload?.tutor,
    student: studentId,
  });

  if (isReviewAlreadyExist) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'Sorry!!! This review already exist !!!',
    );
  }

  const reviewDataForBackEnd: TReview = {
    ...payload,
    student: studentId,
  };

  const createReview = await Review.create(reviewDataForBackEnd);

  return { createReview };
};

const getAllReviewFromDB = async (query: Record<string, unknown>) => {
  const reviewQuery = new QueryBuilder(
    Review.find().populate('student tutor'),
    query,
  )
    .search(searchAbleFieldsArray)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await reviewQuery.modelQuery;
  const meta = await reviewQuery.countTotal();

  return { result, meta };
};

const getSingleReviewFromDB = async (id: string) => {
  const result = await Review.findById(id);

  return { result };
};

const updateReviewInToDB = async (
  email: string,
  id: string,
  payload: Partial<TReview>,
) => {
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

  const reviewData = await Review.findById(id);

  if (!reviewData) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      'Sorry!!! This review is not exist !!!',
    );
  }

  if (reviewData?.student?.toString() !== studentData?._id?.toString()) {
    throw new AppError(
      StatusCodes.UNAUTHORIZED,
      'Sorry!!! You are not authorized !!!',
    );
  }

  const result = await Review.findByIdAndUpdate(
    id,
    { ...payload },
    { new: true, runValidators: true },
  );

  return { result };
};

const deleteReviewFromDB = async (email: string, id: string) => {
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

  const reviewData = await Review.findById(id);

  if (!reviewData) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      'Sorry!!! This review is not exist !!!',
    );
  }

  if (reviewData?.student?.toString() !== studentData?._id?.toString()) {
    throw new AppError(
      StatusCodes.UNAUTHORIZED,
      'Sorry!!! You are not authorized !!!',
    );
  }

  const result = await Review.findByIdAndDelete(id, {
    new: true,
    runValidators: true,
  });

  return { result };
};

export const ReviewService = {
  createReviewInToDB,
  getAllReviewFromDB,
  getSingleReviewFromDB,
  updateReviewInToDB,
  deleteReviewFromDB,
};
