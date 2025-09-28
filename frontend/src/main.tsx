import React from 'react'
 import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { BrowserRouter } from 'react-router'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import ScrollToTop from './components/ScrollToTop'
import { WishlistProvider } from './context/WishlistContext'


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    
      <AuthProvider>
        <WishlistProvider>
         <CartProvider>
          <BrowserRouter>
          <ScrollToTop/>
          <App />
          </BrowserRouter>
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
      
   
  </React.StrictMode>,
)
