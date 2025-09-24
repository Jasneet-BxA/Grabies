import {z} from 'zod';
import { productSchema, productUpdateSchema } from "../utils/zodValidators.js";
 
export const addToCartSchema = z.object({
  product_id: z.uuid(),
  quantity: z.number().int().min(1),
});
export { productSchema, productUpdateSchema };
 