/* eslint-disable no-unused-vars */
import { HydratedDocument, Model } from 'mongoose';

export interface TUser {
  email: string;
  password: string;
  needsPasswordChange: boolean;
  passwordChangedAt?: Date;
  role: 'admin' | 'student' | 'tutor';
  status: 'in-progress' | 'blocked';
  isDeleted: boolean;
}

export type TUserInformationForJWT = {
  userEmail: string;
  role: string;
};

export interface UserModel extends Model<TUser> {
  isUserExist(email: string): Promise<HydratedDocument<TUser> | null>;
  isUserPasswordMatched(
    plainTextPassword: string,
    hashedTextPassword: string,
  ): Promise<boolean>;
  isUserPasswordIssuedBeforeJWTToken(
    passwordTimeStamp: Date,
    jwtIssuedTimeStamp: number,
  ): boolean;
}
