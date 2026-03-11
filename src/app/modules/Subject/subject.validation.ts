import z from 'zod';
import { gradeLevelArray } from './subject.constant';

const subjectValidationSchemaforCreate = z.object({
  body: z.object({
    name: z
      .string('Subject name must be a string')
      .nonempty('Subject name is required'),
    category: z
      .string('Subject category must be a string')
      .nonempty('Subject category is required'),
    gradeLevel: z.enum(
      [...gradeLevelArray] as [string, ...string[]],
      'Grade Level is required',
    ),
  }),
});

const subjectValidationSchemaforUpdate = z.object({
  body: z
    .object({
      name: z
        .string('Subject name must be a string')
        .nonempty('Subject name is required')
        .optional(),
      category: z
        .string('Subject category must be a string')
        .nonempty('Subject category is required')
        .optional(),
      gradeLevel: z
        .enum(
          [...gradeLevelArray] as [string, ...string[]],
          'Grade Level is required',
        )
        .optional(),
    })
    .strict(),
});

const subjectValidationSchemaforUpdateStatus = z.object({
  body: z
    .object({
      isActive: z.boolean('Subject Status is required'),
    })
    .strict(),
});

export const subjectValidationSchemas = {
  subjectValidationSchemaforCreate,
  subjectValidationSchemaforUpdate,
  subjectValidationSchemaforUpdateStatus,
};
