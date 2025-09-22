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
  if (category === "all") {
    return api.get("/menu").then((res) => res.data);
  } else {
    return api.get(`/menu/${category}`).then((res) => res.data);
  }
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

// export async function placeOrder(orderData: {
//   addressId: string
//   paymentMethod: string
// }) {
//   return api.post('/orders', orderData).then(res => res.data)
// }