import { z } from 'zod';
import { addressSchema } from './addressValidator.js';

export const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  contact: z.string().min(10).max(15).optional(),
  dob: z.string().optional(), 
  address: addressSchema.optional(),
});
