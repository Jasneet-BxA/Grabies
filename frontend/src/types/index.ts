export interface Product {
  id: string
  name: string
  image_url: string
  description: string
  price: number
  cuisine: string
  availability?: boolean
  stock: number
  rating?: number
  tag?: string
}

export interface User {
  id: string
  name: string
  email: string
  contact?: string
  dob?: string
  address_id?: string
}

export interface Address {
  id: string;
  user_id?: string;
  address_line: string;
  city?: string;
  state?: string;
  pincode?: string;
}

export interface CartItem {
  product: Product
  quantity: number
  product_id: string
  id: string 
  user_id: string
}

export interface Profile {
  id: string;
  name: string;
  email: string;
  contact?: string;
  dob?: string;
  role?: string;
  address?: Address;
}
