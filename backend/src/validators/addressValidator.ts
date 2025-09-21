import { z } from 'zod';

export const addressSchema = z.object({
  address_line: z.string().min(1),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
});

export const updateAddressSchema = addressSchema.partial();