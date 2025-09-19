export interface Product {
  id: string
  name: string
  image_url: string
  description: string
  price: number
  cuisine?: string
  availability?: boolean
  stock?: number
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

export interface CartItem {
  product: Product
  quantity: number
}
