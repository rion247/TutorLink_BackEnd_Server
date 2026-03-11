import { Types } from 'mongoose';

export interface TName {
  firstName: string;
  lastName: string;
}

export interface TTutor {
  user: Types.ObjectId;
  name: TName;
  contactNo: string;
  profileImage?: string;
  bio: string;
  address: string;
  averageRating: number;
  totalReviews: number;
  isApproved: boolean;
  isDeleted: boolean;
}
