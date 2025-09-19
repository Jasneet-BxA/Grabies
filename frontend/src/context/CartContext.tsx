import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { CartItem, Product } from '../types'

interface CartContextType {
  cart: CartItem[]
  addToCart: (product: Product, quantity?: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])

  useEffect(() => {
    const stored = localStorage.getItem('cart')
    if (stored) setCart(JSON.parse(stored))
  }, [])

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find(item => item.product.id === product.id)
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      )
    }
    return [...prev, { product, quantity }]
  })
}

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter(item => item.product.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    setCart((prev) =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    )
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}
