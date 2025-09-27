import React from 'react'
 import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { BrowserRouter } from 'react-router'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import ScrollToTop from './components/ScrollToTop'


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    
      <AuthProvider>
         <CartProvider>
          <BrowserRouter>
          <ScrollToTop/>
          <App />
           </BrowserRouter>
           </CartProvider>
      </AuthProvider>
      
   
  </React.StrictMode>,
)
