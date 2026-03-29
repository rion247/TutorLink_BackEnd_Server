import mongoose, { Schema } from 'mongoose';
import { dayArray } from './offeredSubject.constant';
import { TOfferedSubject } from './offeredSubject.interface';

const offeredSubjectSchema = new Schema<TOfferedSubject>(
  {
    tutor: {
      type: Schema.Types.ObjectId,
      required: [true, 'Tutor ID is required!!!'],
      ref: 'Tutor',
    },
    offeredSubjectImage: {
      type: String,
      default: '',
    },
    subject: {
      type: Schema.Types.ObjectId,
      required: [true, 'Subject ID is required!!!'],
      ref: 'Subject',
    },
    day: {
      type: String,
      enum: {
        values: dayArray,
        message: '{VALUE} is not supported!!!',
      },
      required: [true, 'Day is required!!!'],
    },
    startTime: {
      type: String,
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format'],
      required: [true, 'Start Time is required!!!'],
    },
    endTime: {
      type: String,
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format'],
      required: [true, 'End Time is required!!!'],
    },
    duration: {
      type: Number,
      required: [true, 'Session duration is required!!!'],
      default: 0,
    },
    pricePerHour: {
      type: Number,
      required: [true, 'Price Per Hour section is required!!!'],
    },
    maxCapacity: {
      type: Number,
      max: [50, 'Max Capacity is 50!!!'],
      required: [true, 'Max Capacity is required!!!'],
    },
    currentlyBooked: {
      type: Number,
      required: [true, 'Current Booked number is required!!!'],
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

offeredSubjectSchema.pre('find', function () {
  this.find({ isActive: { $ne: false } });
});

offeredSubjectSchema.pre('findOne', function () {
  this.findOne({ isActive: { $ne: false } });
});

export const OfferedSubject = mongoose.model<TOfferedSubject>(
  'OfferedSubject',
  offeredSubjectSchema,
);
