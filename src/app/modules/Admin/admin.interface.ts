import { Types } from 'mongoose';

export interface TName {
  firstName: string;
  lastName: string;
}

export interface TAdmin {
  user: Types.ObjectId;
  name: TName;
  contactNo: string;
  profileImage?: string;
  address: string;
  isDeleted: boolean;
}
