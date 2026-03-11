import mongoose, { Schema } from 'mongoose';
import { TName, TStudent } from './student.interface';
import { gradeLevelArray } from './student.constant';

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

const studentSchema = new Schema<TStudent>(
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
    gradeLevel: {
      type: String,
      enum: {
        values: gradeLevelArray,
        message: '{VALUE} is not supported!!!',
      },
      required: [true, 'Grade Level is required!!!'],
    },
    address: {
      type: String,
      required: [true, 'Home address is required!!!'],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

studentSchema.virtual('fullName').get(function () {
  return `${this?.name?.firstName} ${this?.name?.lastName}`;
});

studentSchema.pre('find', function () {
  this.find({ isDeleted: { $ne: true } });
});

studentSchema.pre('findOne', function () {
  this.findOne({ isDeleted: { $ne: true } });
});

export const Student = mongoose.model<TStudent>('Student', studentSchema);
