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
export interface RawCartItem {
  id: string;
  quantity: number;
  products: {
    id: string;
    name: string;
    image_url: string;
    price: number;
  };
}
export interface Address {
  id: string;
  address_line: string;
  city?: string;
  state?: string;
  pincode?: string;
}

export interface SignupInput {
  name: string;
  email: string;
  password: string;
  contact?: string;
  dob?: string;
  address: Address;
}

export interface AddressData {
  address_line: string;
  city: string;
  state: string;
  pincode: string;
}

export interface SignupData {
  email: string;
  password: string;
  name?: string;
}

export interface FilterOptions {
  tag?: string;
  rating?: number;
  priceRange?: "lt300" | "300to600";
  sort?: "price_asc" | "price_desc";
}
export interface OrderItem {
  quantity: number;
  total_price: number;
  products: {
    id: string;
    name: string;
    price: number;
    image_url?: string;
  };
}

export interface Order {
  id: string;
  total_price: number;
  status: string;
  created_at: string;
  address_id?: string;
  order_items: OrderItem[];
}

export interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
}
