import mongoose, { Schema } from 'mongoose';
import { TAdmin, TName } from './admin.interface';

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

const adminSchema = new Schema<TAdmin>(
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

adminSchema.virtual('fullName').get(function () {
  return `${this?.name?.firstName} ${this?.name?.lastName}`;
});

adminSchema.pre('find', function () {
  this.find({ isDeleted: { $ne: true } });
});

adminSchema.pre('findOne', function () {
  this.findOne({ isDeleted: { $ne: true } });
});

export const Admin = mongoose.model<TAdmin>('Admin', adminSchema);
