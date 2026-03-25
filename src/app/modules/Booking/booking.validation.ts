import z from 'zod';

const bookingValidationSchemasforCreate = z.object({
  body: z.object({
    offeredSubject: z
      .string('Offered Subject must be a string')
      .nonempty('Offered Subject is required'),
  }),
});

export const BookingValidationSchemas = {
  bookingValidationSchemasforCreate,
};
