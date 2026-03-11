import z from 'zod';

const nameValidationSchema = z.object({
  firstName: z
    .string('First Name must be a string')
    .nonempty('First Name is required'),
  lastName: z
    .string('Last Name must be a string')
    .nonempty('Last Name is required'),
});

const adminValidationSchemaforCreate = z.object({
  body: z.object({
    email: z.email('Invalid email address').nonempty('Email is required'),
    password: z
      .string('Password must be a string')
      .max(20, 'Password should not exceed 20 caracter')
      .nonempty('Password is required'),
    admin: z.object({
      name: nameValidationSchema,
      contactNo: z
        .string('Contact Number must be a string')
        .nonempty('Contact Number is required'),
      profileImage: z.string('Profile Image must be a string').optional(),
      address: z
        .string('Admin home address must be a string')
        .nonempty('Admin home address is required'),
    }),
  }),
});

export const adminValidationSchemas = {
  adminValidationSchemaforCreate,
};
