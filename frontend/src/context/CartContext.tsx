import React, { createContext, useContext, useEffect, useState } from "react";
import { getCart, addToCart, removeFromCart } from "@/lib/api";

interface CartItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    image_url: string;
    price: number;
  };
}

interface CartContextType {
  cartitem: CartItem[];
  totalItems: number;
  refreshCart: () => Promise<void>;
  addItem: (productId: string, quantity: number) => Promise<void>;
  removeItem: (cartId: string) => Promise<void>;
  quantity: (
    cartId: string,
    productId: string,
    quantity: number
  ) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cartitem, setCartItems] = useState<CartItem[]>([]);

  const fetchCart = async () => {
    const rawData = await getCart();
    const transformed = rawData.map((item: any) => ({
      id: item.id,
      quantity: item.quantity,
      product: {
        id: item.products.id,
        name: item.products.name,
        image_url: item.products.image_url,
        price: item.products.price,
      },
    }));
    setCartItems(transformed);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const totalItems = cartitem.reduce((sum, item) => sum + item.quantity, 0);

  const refreshCart = async () => {
    await fetchCart();
  };

  const addItem = async (productId: string, quantity: number) => {
    await addToCart(productId, quantity);
    await refreshCart();
  };

  const removeItem = async (cartId: string) => {
    await removeFromCart(cartId);
    await refreshCart();
  };

  const quantity = async (
    cartId: string,
    productId: string,
    quantity: number
  ) => {
    if (quantity < 1) return;
    await addToCart(productId, quantity);
    await refreshCart();
  };

  return (
    <CartContext.Provider
      value={{
        cartitem,
        totalItems,
        refreshCart,
        addItem,
        removeItem,
        quantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
