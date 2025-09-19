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
