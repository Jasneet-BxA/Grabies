import axios from 'axios'
import {AddressData} from '../types/index'
import {SignupData} from '../types/index'
import {FilterOptions} from '../types/index'
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
})
// Authentication
export async function login(email: string, password: string) {
  return api.post('/auth/login', { email, password })
}

export async function signup(data: SignupData) {
  return api.post('/auth/signup', data);
}

export async function logout() {
  return api.post('/auth/logout');
}

// User
export async function getCurrentUser() {
  return api.get('/user/me').then(res => res.data);
}
export async function getUserProfile() {
  return api.get('/user/me').then(res => res.data);
}

export async function getUserAddress() {
  return api.get('/address').then(res => res.data);
}
export async function addUserNewAddress(addressData: AddressData) {
  return api.post('/address', addressData).then(res => res.data);
}

// Products
export async function getProductsByCategory(category: string) {
  return api.get(`/food/${category}`).then(res => res.data);
}

export async function getFilteredProducts(category: string, options: FilterOptions) {
  const res = await api.get(`/food/${category}/filters`, {
    params: options,
  });
  return res.data;
}

export async function getAllProducts(limit: number = 6, offset: number = 0) {
  return api.get(`/food?limit=${limit}&offset=${offset}`).then(res => res.data);
}

export async function getProductByName(category: string, productName: string) {
  const encodedName = encodeURIComponent(productName);
  const res = await api.get(`/food/${category}/${encodedName}`);
  return res.data;
}

// Wishlist
export async function getWishlist() {
  return api.get('wishlist/').then(res => res.data);
}

export async function addToWishlist(productId: string) {
  await api.post(`/wishlist/${productId}`);
}

export async function removeFromWishlist(productId: string) {
  await api.delete(`/wishlist/${productId}`);
}

// Cart
export async function getCart() {
  return api.get('/cart').then(res => res.data);
}

export async function addToCart(productId: string, quantity: number = 1) {
  return api.post('/cart', {
    product_id: productId,
    quantity,
  }).then(res => res.data);
}

export async function removeFromCart(cartId: string) {
  return api.delete(`/cart/${cartId}`).then(res => res.data);
}

// Orders
export async function getOrderById(orderId: string) {
  const res = await api.get(`/order/${orderId}`);
  return res.data;
}

export async function getOrders() {
  const res = await api.get('/order');
  return res.data;
}

export async function createOrder(addressId: string) {
  const res = await api.post('/order/create-order', { addressId });
  return res.data;
}

// Checkout
export async function createStripeCheckoutSession(address_id: string) {
  return api.get(`/payment/${address_id}`);
}

export async function placeCODOrder(addressId: string) {
  return api.post(`/payment/cod-order/${addressId}`);
}

export async function confirmPayment(orderId: string) {
  return api.post('/order/confirm-payment', { orderId });
}

// Search
export async function search(
  q: string
) {
  const params = { q };
  const res = await api.get('/search', { params });
  return res.data;
}
