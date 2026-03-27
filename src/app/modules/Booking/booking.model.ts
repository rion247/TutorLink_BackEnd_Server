import mongoose, { Schema } from 'mongoose';
import { TBooking } from './booking.interface';
import { bookingStatusArray, paymentStatusArray } from './booking.constant';

const bookingSchema = new Schema<TBooking>(
  {
    student: {
      type: Schema.Types.ObjectId,
      required: [true, 'Student ID is required!!!'],
      ref: 'Student',
    },
    subject: {
      type: Schema.Types.ObjectId,
      required: [true, 'Subject ID is required!!!'],
      ref: 'Subject',
    },
    tutor: {
      type: Schema.Types.ObjectId,
      required: [true, 'Tutor ID is required!!!'],
      ref: 'Tutor',
    },
    offeredSubject: {
      type: Schema.Types.ObjectId,
      required: [true, 'Offered Subject is required!!!'],
      ref: 'OfferedSubject',
    },
    bookingStatus: {
      type: String,
      enum: {
        values: bookingStatusArray,
        message: '{VALUE} is not supported!!!',
      },
      default: 'pending',
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: {
        values: paymentStatusArray,
        message: '{VALUE} is not supported!!!',
      },
      default: 'unpaid',
      required: true,
    },
    transactionID: {
      type: String,
      required: [true, 'Transaction ID is required!!!'],
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true },
);

export const Booking = mongoose.model<TBooking>('Booking', bookingSchema);
