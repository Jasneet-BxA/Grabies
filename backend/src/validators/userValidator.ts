import { z } from 'zod';

export const addressSchema = z.object({
  address_line: z.string().min(1),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  contact: z.string().min(10).max(15).optional(),
  dob: z.string().optional(), 
  address: addressSchema.optional(),
});
