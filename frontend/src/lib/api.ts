import axios from 'axios'
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
})
// Authentication
export async function login(email: string, password: string) {
  console.log(import.meta.env.VITE_BACKEND_URL);
  return api.post('/auth/login', { email, password })
}
export async function signup(data: any) {
  return api.post('/auth/signup', data)
}
export async function logout() {
  return api.post('/auth/logout')
}
// User
export async function getCurrentUser() {
  return api.get('/user/me').then(res => res.data)
}
export async function getUserProfile() {
  return api.get('/user/me').then(res => res.data)
}
export async function getUserAddress(){
  return api.get('/address').then(res=>res.data)
}
// Products
export async function getProductsByCategory(category: string) {
  return api.get(`/menu/${category}`).then((res) => res.data);
}
export const getFilteredProducts = async (
  category: string,
  filters: { tag?: string; rating?: number;  priceRange?: "lt300" | "300to600"; }
) => {
  const res = await api.get(`/menu/${category}/filters`, { params: filters });
  return res.data; 
};
export async function getAllProducts(limit: number = 6, offset: number = 0) {
  return api.get(`/menu?limit=${limit}&offset=${offset}`).then((res) => res.data);
}
export async function addUserNewAddress(addressData: {
  address_line: string
  city: string
  state: string
  pincode: string
}) {
  return api.post('/address', addressData).then(res => res.data)
}

export async function getProductByName(category:string, productName: string){
  const encodedName = encodeURIComponent(productName);
  const res = await api.get(`/menu/${category}/${encodedName}`);
  return res.data;
}

//  Wishlist
export async function getWishlist() {
  return await api.get('wishlist/').then((res)=>res.data)
}
export async function addToWishlist(productId: string) {
  await api.post(`/wishlist/${productId}`);
}
export async function removeFromWishlist(productId: string) {
  await api.delete(`/wishlist/${productId}`);
}
// Cart
export async function getCart(){
  return api.get('/cart').then((res) => res.data);
}
export async function addToCart(productId: string, quantity: number = 1) {
  return api.post('/cart', {
    product_id: productId,
    quantity,
  }).then(res => res.data);
}

export async function removeFromCart(cartId: string) {
  return api.delete(`/cart/${cartId}`).then((res) => res.data);
}
// Orders
 export const getOrderById = async (orderId: string) => {
  const res = await api.get(`/order/${orderId}`);
  return res.data;
};
export async function getOrders() {
  const res = await api.get('/order'); 
  return res.data;
}
export async function createOrder(addressId: string) {
  const res = await api.post('/order/create-order', { addressId });
  return res.data; 
}

// Checkout
 export async function createStripeCheckoutSession(address_id: string){
  return api.get(`/payment/${address_id}`)
}
export const placeCODOrder = (addressId: string) => {
  return api.post(`/payment/cod-order/${addressId}`);
};

export async function confirmPayment(orderId: string){
  return api.post('/order/confirm-payment', {orderId});
}


