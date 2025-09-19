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

export const addToCartSchema = z.object({
  product_id: z.string().uuid(),
  quantity: z.number().int().min(1),
});

export const placeOrderSchema = z.object({
  address_id: z.uuid(),
  payment_method: z.enum(['COD']), 
});