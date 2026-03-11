/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';

type TRating = 1 | 2 | 3 | 4 | 5;

export interface TReview {
  tutor: Types.ObjectId;
  student: Types.ObjectId;
  rating: TRating;
  comment: string;
}

export interface ReviewModel extends Model<TReview> {
  isReviewExist(id: string): Promise<TReview | null>;
}
