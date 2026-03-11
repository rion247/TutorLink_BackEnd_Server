/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';

type TGradeLevel =
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | '11'
  | '12';

export interface TSubject {
  name: string;
  category: string;
  gradeLevel: TGradeLevel;
  isActive: boolean;
}

export interface SubjectModel extends Model<TSubject> {
  isSubjectExist(id: string): Promise<TSubject | null>;
}
