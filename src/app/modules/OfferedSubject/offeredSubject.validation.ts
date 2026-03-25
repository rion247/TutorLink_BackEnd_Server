import z from 'zod';
import { dayArray } from './offeredSubject.constant';

const offeredSubjectValidationSchemaforCreate = z.object({
  body: z.object({
    subject: z
      .string('Subject must be a string')
      .nonempty('Subject is required'),
    day: z.enum([...dayArray] as [string, ...string[]], 'Day is required'),
    startTime: z
      .string('Start Time must be a string')
      .nonempty('Start Time is required'),
    endTime: z
      .string('End Time must be a string')
      .nonempty('End Time is required'),
    pricePerHour: z.number('Price Per Hour section is required'),
    maxCapacity: z.number('Max Capacity is required'),
  }),
});

const availabilityValidationSchemaforUpdate = z.object({
  body: z
    .object({
      day: z
        .enum([...dayArray] as [string, ...string[]], 'Day is required')
        .optional(),
      startTime: z
        .string('Start Time must be a string')
        .nonempty('Start Time is required')
        .optional(),
      endTime: z
        .string('End Time must be a string')
        .nonempty('End Time is required')
        .optional(),
      pricePerHour: z.number('Price Per Hour section is required').optional(),
      maxCapacity: z.number('Max Capacity is required').optional(),
    })
    .strict(),
});

export const offeredSubjectValidationSchemas = {
  offeredSubjectValidationSchemaforCreate,
  availabilityValidationSchemaforUpdate,
};
