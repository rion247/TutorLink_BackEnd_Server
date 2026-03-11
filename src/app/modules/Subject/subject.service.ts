import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';
import { TSubject } from './subject.interface';
import { Subject } from './subject.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { searchAbleFieldsArray } from './subject.constant';

const createSubjectInToDB = async (payload: TSubject) => {
  const isSubjectAlreadyExist = await Subject.findOne({
    name: payload?.name,
    category: payload?.category,
    gradeLevel: payload?.gradeLevel,
  });

  if (isSubjectAlreadyExist) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'Sorry!!! This subject is already exist !!!',
    );
  }

  const subjectDataForBackEnd: TSubject = {
    ...payload,
    isActive: true,
  };

  const createSubject = await Subject.create(subjectDataForBackEnd);

  return { createSubject };
};

const getAllSubjectFromDB = async (query: Record<string, unknown>) => {
  const subjectQuery = new QueryBuilder(Subject.find(), query)
    .search(searchAbleFieldsArray)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await subjectQuery.modelQuery;
  const meta = await subjectQuery.countTotal();

  return { result, meta };
};

const getSingleSubjectFromDB = async (id: string) => {
  const result = await Subject.findById(id);

  return { result };
};

const updateSubjectInToDB = async (id: string, payload: Partial<TSubject>) => {
  const result = await Subject.findByIdAndUpdate(
    id,
    { ...payload },
    { new: true, runValidators: true },
  );

  return { result };
};

const deleteSubjectFromDB = async (id: string) => {
  const result = await Subject.findByIdAndDelete(
    id,

    { new: true, runValidators: true },
  );

  return { result };
};

const updateStatusForSubjectFromDB = async (
  id: string,
  payload: { isActive: boolean },
) => {
  const result = await Subject.findByIdAndUpdate(
    id,
    { isActive: payload?.isActive },
    { new: true, runValidators: true },
  );

  return { result };
};

export const SubjectService = {
  createSubjectInToDB,
  getAllSubjectFromDB,
  getSingleSubjectFromDB,
  updateSubjectInToDB,
  deleteSubjectFromDB,
  updateStatusForSubjectFromDB,
};
