import mongoose, { Schema } from 'mongoose';
import { TAvailability, TOfferedSubject } from './offeredSubject.interface';
import { dayArray } from './offeredSubject.constant';

const availabilitySchema = new Schema<TAvailability>(
  {
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
  },
  { timestamps: true },
);

const offeredSubjectSchema = new Schema<TOfferedSubject>({
  tutor: {
    type: Schema.Types.ObjectId,
    required: [true, 'Tutor ID is required!!!'],
    ref: 'Tutor',
  },
  subject: {
    type: Schema.Types.ObjectId,
    required: [true, 'Subject ID is required!!!'],
    ref: 'Subject',
  },
  availableSlots: {
    type: [availabilitySchema],
    required: [true, 'Available Slots section is required!!!'],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

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
