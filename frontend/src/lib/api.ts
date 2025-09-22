import axios from 'axios'
 
// Set base URL for API
const api = axios.create({
  baseURL: 'http://localhost:3000/', // Change this to your backend URL
  withCredentials: true,
})
 
// Authentication
export async function login(email: string, password: string) {
  return api.post('/auth/login', { email, password })
}
 
export async function signup(data: any) {
  return api.post('/auth/signup', data)
}
 
export async function logout() {
  return api.post('/auth/logout')
}
 
// GET request
export async function getCurrentUser() {
  return api.get('/user/me').then(res => res.data)
}
 
export async function getUserProfile() {
  return api.get('/user/me').then(res => res.data)
}
 
export async function getUserAddress(){
  return api.get('/address').then(res=>res.data)
}

export async function getProductsByCategory(category: string) {
  return api.get(`/menu/${category}`).then((res) => res.data);
}
export async function getAllProducts(limit: number = 6, offset: number = 0) {
  return api.get(`/menu?limit=${limit}&offset=${offset}`).then((res) => res.data);
}
export async function getWishlist(){
  return api.get('/wishlist').then((res) => res.data);
}

// POST request
export async function addUserNewAddress(addressData: {
  address_line: string
  city: string
  state: string
  pincode: string
}) {
  return api.post('/address', addressData).then(res => res.data)
}

export async function addToWishlist(productId: string) {
  await api.post(`/wishlist/`, {product_id: productId});
}

export async function getProductByName(category:string, productName: string){
  const encodedName = encodeURIComponent(productName);
  const res = await api.get(`/menu/${category}/${encodedName}`);
  return res.data;
}


// DELETE request
export async function removeFromWishlist(productId: string) {
  await api.delete(`/wishlist/${productId}`);
}