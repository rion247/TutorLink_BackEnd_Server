/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Schema } from 'mongoose';
import { ReviewModel, TReview } from './review.interface';
import { ratingArray } from './review.constant';
import { Tutor } from '../Tutor/tutor.model';

const reviewSchema = new Schema<TReview, ReviewModel>(
  {
    tutor: {
      type: Schema.Types.ObjectId,
      required: [true, 'Tutor ID is required!!!'],
      ref: 'Tutor',
    },
    student: {
      type: Schema.Types.ObjectId,
      required: [true, 'Student ID is required!!!'],
      ref: 'Student',
    },
    rating: {
      type: Number,
      enum: {
        values: ratingArray,
        message: '{VALUE} is not supported!!!',
      },
      required: [true, 'Rating is required!!!'],
    },
    comment: {
      type: String,
      required: [true, 'Comment is required!!!'],
    },
  },
  { timestamps: true },
);

reviewSchema.post('save', async function (doc, next) {
  try {
    const tutorId = doc?.tutor;

    const allReviewsData = await Review.find({ tutor: tutorId });

    const totalReviewsCount = allReviewsData.length;

    const totalRatingCount = allReviewsData.reduce((sum, acc) => {
      return sum + acc?.rating;
    }, 0);

    const averageRating =
      totalReviewsCount > 0 ? totalRatingCount / totalReviewsCount : 0;

    await Tutor.findByIdAndUpdate(tutorId, {
      averageRating,
      totalReviews: totalReviewsCount,
    });

    next();
  } catch (err: any) {
    next(err);
  }
});

reviewSchema.statics.isReviewExist = async function (id: string) {
  const reviewData = await Review.findById(id);

  return reviewData;
};

export const Review = mongoose.model<TReview>('Review', reviewSchema);
