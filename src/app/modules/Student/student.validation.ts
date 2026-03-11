import z from 'zod';
import { gradeLevelArray } from './student.constant';

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

const studentValidationSchemaforCreate = z.object({
  body: z.object({
    email: z.email('Invalid email address').nonempty('Email is required'),
    password: z
      .string('Password must be a string')
      .max(20, 'Password should not exceed 20 caracter')
      .nonempty('Password is required'),
    student: z.object({
      name: nameValidationSchema,
      contactNo: z
        .string('Contact Number must be a string')
        .nonempty('Contact Number is required'),
      profileImage: z.string('Profile Image must be a string').optional(),
      gradeLevel: z.enum(
        [...gradeLevelArray] as [string, ...string[]],
        'Grade Level is required',
      ),
      address: z
        .string('Student home address must be a string')
        .nonempty('Student home address is required'),
    }),
  }),
});

const studentValidationSchemaforUpdate = z.object({
  body: z
    .object({
      name: nameValidationSchemaforUpdate,
      contactNo: z
        .string('Contact Number must be a string')
        .nonempty('Contact Number is required')
        .optional(),
      profileImage: z.string('Profile Image must be a string').optional(),
      gradeLevel: z
        .enum(
          [...gradeLevelArray] as [string, ...string[]],
          'Grade Level is required',
        )
        .optional(),
      address: z
        .string('Student home address must be a string')
        .nonempty('Student home address is required')
        .optional(),
    })
    .strict(),
});

export const studentValidationSchemas = {
  studentValidationSchemaforCreate,
  studentValidationSchemaforUpdate,
};
