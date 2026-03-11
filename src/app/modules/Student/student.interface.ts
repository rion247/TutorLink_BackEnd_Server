import { Types } from 'mongoose';

export interface TName {
  firstName: string;
  lastName: string;
}

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

export interface TStudent {
  user: Types.ObjectId;
  name: TName;
  contactNo: string;
  profileImage?: string;
  gradeLevel: TGradeLevel;
  address: string;
  isDeleted: boolean;
}
