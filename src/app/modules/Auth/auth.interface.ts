import { USER_ROLE } from './auth.constant';

export interface TLoginUser {
  email: string;
  password: string;
}

export interface TChangeUserPassword {
  newPassword: string;
  oldPassword: string;
}

export type TUser_role = keyof typeof USER_ROLE;
