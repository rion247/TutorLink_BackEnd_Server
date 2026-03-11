import z from 'zod';

const loginUserValidationSchema = z.object({
  body: z.object({
    email: z
      .string('User Email must be a string')
      .nonempty('User Email is required'),
    password: z
      .string('User Password must be a string')
      .nonempty('User Password is required'),
  }),
});

const changeUserPasswordValidationSchema = z.object({
  body: z.object({
    newPassword: z
      .string('New Password must be a string')
      .nonempty('New Password is required'),
    oldPassword: z
      .string('Old Password must be a string')
      .nonempty('Old Password is required'),
  }),
});

const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z
      .string('Refresh Token must be a string')
      .nonempty('Refresh Token is required'),
  }),
});

const forgetPasswordValidationSchema = z.object({
  body: z.object({
    email: z
      .string('User Email must be a string')
      .nonempty('User Email is required'),
  }),
});

const resetPasswordValidationSchema = z.object({
  body: z.object({
    email: z
      .string('User Email must be a string')
      .nonempty('User Email is required'),
    newPassword: z
      .string('Password must be a string')
      .nonempty('Password is required'),
  }),
});

export const authValidationSchemas = {
  loginUserValidationSchema,
  changeUserPasswordValidationSchema,
  refreshTokenValidationSchema,
  resetPasswordValidationSchema,
  forgetPasswordValidationSchema,
};
