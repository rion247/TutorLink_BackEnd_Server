import mongoose, { Schema } from 'mongoose';
import { TName, TTutor } from './tutor.interface';

const nameSchema = new Schema<TName>({
  firstName: {
    type: String,
    required: [true, 'First Name is required!!!'],
  },
  lastName: {
    type: String,
    required: [true, 'Last Name is required!!!'],
  },
});

// const availabilitySchema = new Schema<TAvailability>({
//   day: {
//     type: String,
//     required: [true, 'Day is required!!!'],
//   },
//   startTime: {
//     type: String,
//     required: [true, 'Start Time is required!!!'],
//   },
//   endTime: {
//     type: String,
//     required: [true, 'End Time is required!!!'],
//   },
// });

const tutorSchema = new Schema<TTutor>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: [true, 'User ID is required!!!'],
      ref: 'User',
    },
    name: {
      type: nameSchema,
      required: [true, 'Name section is required!!!'],
    },
    contactNo: {
      type: String,
      required: [true, 'Contact Number is required!!!'],
    },
    profileImage: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      minlength: [10, 'Tutor bio must be at least 10 characters long!!!'],
      maxlength: [100, 'Tutor bio must not exceed 50 characters!!!'],
      required: [true, 'Tutor Bio is required!!!'],
    },
    address: {
      type: String,
      required: [true, 'Home address is required!!!'],
    },
    averageRating: {
      type: Number,
      required: [true, 'Average Rating is required!!!'],
      default: 0,
    },
    totalReviews: {
      type: Number,
      required: [true, 'Total Reviews is required!!!'],
      default: 0,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  },
);

tutorSchema.pre('findOne', function () {
  this.findOne({ isApproved: { $ne: false } }, { isDeleted: { $ne: true } });
});

tutorSchema.virtual('fullName').get(function () {
  return `${this?.name?.firstName} ${this?.name?.lastName}`;
});

export const Tutor = mongoose.model<TTutor>('Tutor', tutorSchema);
