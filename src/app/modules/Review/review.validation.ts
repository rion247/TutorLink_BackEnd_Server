import z from 'zod';

const reviewValidationSchemaforCreate = z.object({
  body: z.object({
    tutor: z
      .string({ message: 'Tutor ID must be a string' })
      .min(1, { message: 'Tutor ID is required' }),
    rating: z
      .number({ message: 'Rating must be a number' })
      .int({ message: 'Rating must be an integer' })
      .min(1, { message: 'Minimum rating is 1' })
      .max(5, { message: 'Maximum rating is 5' }),

    comment: z
      .string({ message: 'Comment must be a string' })
      .min(1, { message: 'Comment is required' })
      .max(100, { message: 'Comment should not exceed 100 characters' }),
  }),
});

const reviewValidationSchemaforUpdate = z.object({
  body: z
    .object({
      rating: z
        .number({ message: 'Rating must be a number' })
        .int({ message: 'Rating must be an integer' })
        .min(1, { message: 'Minimum rating is 1' })
        .max(5, { message: 'Maximum rating is 5' })
        .optional(),

      comment: z
        .string({ message: 'Comment must be a string' })
        .min(1, { message: 'Comment is required' })
        .max(100, { message: 'Comment should not exceed 100 characters' })
        .optional(),
    })
    .strict(),
});

export const reviewValidationSchemas = {
  reviewValidationSchemaforCreate,
  reviewValidationSchemaforUpdate,
};
