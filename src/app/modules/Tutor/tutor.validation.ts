import z from 'zod';

const nameValidationSchema = z.object({
  firstName: z
    .string('First Name must be a string')
    .nonempty('First Name is required'),
  lastName: z
    .string('Last Name must be a string')
    .nonempty('Last Name is required'),
});

const nameValidationSchemaforUpdate = z.object({
  firstName: z
    .string('First Name must be a string')
    .nonempty('First Name is required')
    .optional(),
  lastName: z
    .string('Last Name must be a string')
    .nonempty('Last Name is required')
    .optional(),
});

const tutorValidationSchemaforCreate = z.object({
  body: z.object({
    email: z.email('Invalid email address').nonempty('Email is required'),
    password: z
      .string('Password must be a string')
      .max(20, 'Password should not exceed 20 caracter')
      .nonempty('Password is required'),
    tutor: z.object({
      name: nameValidationSchema,
      contactNo: z
        .string('Contact Number must be a string')
        .nonempty('Contact Number is required'),
      profileImage: z.string('Profile Image must be a string').optional(),
      bio: z
        .string('Tutor Bio must be a string')
        .min(10, 'Tutor Bio must be at least 10 characters long')
        .max(100, 'Tutor bio must not exceed 100 characters!!!')
        .nonempty('Tutor Bio is required'),
      address: z
        .string('Tutor home address must be a string')
        .nonempty('Tutor home address is required'),
    }),
  }),
});

const tutorValidationSchemaforUpdate = z.object({
  body: z
    .object({
      name: nameValidationSchemaforUpdate,
      contactNo: z
        .string('Contact Number must be a string')
        .nonempty('Contact Number is required')
        .optional(),
      profileImage: z.string('Profile Image must be a string').optional(),
      bio: z
        .string('Tutor Bio must be a string')
        .min(10, 'Tutor Bio must be at least 10 characters long')
        .max(100, 'Tutor bio must not exceed 50 characters!!!')
        .nonempty('Tutor Bio is required')
        .optional(),
      address: z
        .string('Tutor home address must be a string')
        .nonempty('Tutor home address is required')
        .optional(),
    })
    .strict(),
});

export const tutorValidationSchemas = {
  tutorValidationSchemaforCreate,
  tutorValidationSchemaforUpdate,
};
