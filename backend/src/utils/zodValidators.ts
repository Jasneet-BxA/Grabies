import { z } from 'zod';

export const signupSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  password: z.string().min(6),
  contact: z.string().min(10).max(15).optional(),
  dob: z.string().optional(),
  address: z.object({
    address_line: z.string(),
    city: z.string(),
    state: z.string(),
    pincode: z.string(),
  }),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});


export const placeOrderSchema = z.object({
  address_id: z.uuid(),
  payment_method: z.enum(['COD']), 
});

export const productSchema = z.object({
  name: z.string().min(1),
  image_url: z.string().url().optional(),
  description: z.string().optional(),
  price: z.number().positive(),
  cuisine: z.string().optional(),
  availability: z.boolean().optional(),
  stock: z.number().int().nonnegative().optional(),
  rating: z.number().min(0).max(5).optional(),
  tag: z.string().optional(),
});

export const productUpdateSchema = productSchema.partial();