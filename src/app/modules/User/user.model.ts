import { model, Schema } from 'mongoose';
import { TUser, UserModel } from './user.interface';
import { roleArray, statusArray } from './user.constant';
import bcrypt from 'bcrypt';
import config from '../../config';

const userSchema = new Schema<TUser, UserModel>(
  {
    email: {
      type: String,
      unique: true,
      required: [true, 'User Email is required!!!'],
    },
    password: {
      type: String,
      required: [true, 'User Password is required!!!'],
      select: 0,
    },
    needsPasswordChange: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      enum: { values: roleArray, message: '{VALUE} is not supported!!!' },
      required: true,
    },
    status: {
      type: String,
      enum: { values: statusArray, message: '{VALUE} is not supported!!!' },
      default: 'in-progress',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

userSchema.pre('save', async function () {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;

  if (!user.isModified('password')) return;

  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  );
});

userSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});

userSchema.statics.isUserExist = async function (email: string) {
  const userInformation = await User.findOne({ email }).select('+password');

  return userInformation;
};

userSchema.statics.isUserPasswordMatched = async function (
  plainTextPassword: string,
  hashedTextPassword: string,
) {
  return await bcrypt.compare(plainTextPassword, hashedTextPassword);
};

userSchema.statics.isUserPasswordIssuedBeforeJWTToken = function (
  passwordTimeStamp: Date,
  jwtIssuedTimeStamp: number,
) {
  const passwordTime = new Date(passwordTimeStamp).getTime() / 1000;

  return passwordTime > jwtIssuedTimeStamp;
};

export const User = model<TUser, UserModel>('User', userSchema);
