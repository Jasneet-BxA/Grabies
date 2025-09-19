import axios from 'axios'

// Set base URL for API
const api = axios.create({
  baseURL: 'http://localhost:4000/api', // Change this to your backend URL
  withCredentials: true,
})

export async function login(email: string, password: string) {
  return axios.post('/api/auth/login', { email, password })
}

export async function signup(data: any) {
  return axios.post('/api/auth/signup', data)
}

export async function logout() {
  return axios.post('/api/auth/logout') 
  api.post('/auth/logout')
}

export async function getCurrentUser() {
  return api.get('/auth/me').then(res => res.data)
}

export async function fetchProducts() {
  return api.get('/products').then(res => res.data)
}

export async function fetchProductById(id: string) {
  return api.get(`/products/${id}`).then(res => res.data)
}

// Add more APIs as needed
