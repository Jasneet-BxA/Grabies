import type { addToCartSchema, productSchema, productUpdateSchema } from "validators/productValidator.js";
import type { loginSchema, signupSchema } from "../validators/authValidator.js";
import type z from "zod";
import type {updateProfileSchema } from "validators/userValidator.js";
import type {addressSchema} from "validators/addressValidator.js"

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
      };
    }
  }
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  contact?: string;
  dob?: string;
  address_id?: string;
}

export interface Address {
  id: string;
  user_id?: string;
  address_line: string;
  city?: string;
  state?: string;
  pincode?: string;
}

export interface Product {
  id: string;
  name: string;
  image_url?: string;
  description?: string;
  price: number;
  cuisine?: string;
  availability?: boolean;
  stock?: number;
  rating?: number;
  tag?: string;
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  products?: Product;
}

export interface Order {
  id: string;
  user_id?: string;
  address_id?: string;
  total_price: number;
  status: 'pending' | 'placed' | 'cancelled' | 'shipped' | 'delivered';
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  address_id?: string;
  total_price: number;
  product?: Product;
}

export type FilterOptions = {
  category: string;
  tag?: string;
  rating?: number;
  search?: string;
  sort?: string;
  priceRange?: "lt300" | "300to600" | "";
};

export interface CreateOrderInput{
  addressId: string;
}
export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type AddressInput = z.infer<typeof addressSchema>;
export type ProductCreateInput = z.infer<typeof productSchema>;
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;