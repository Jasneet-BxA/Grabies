import React, { createContext, useContext, useEffect, useState } from "react";
import { getWishlist, addToWishlist, removeFromWishlist } from "@/lib/api";
import type { Product } from "@/types";
import toast from "react-hot-toast";

interface WishlistContextType {
  wishlist: Product[];
  refreshWishlist: () => Promise<void>;
  addToWishlistContext: (productId: string) => Promise<void>;
  removeFromWishlistContext: (productId: string) => Promise<void>;
  setWishlist: React.Dispatch<React.SetStateAction<Product[]>>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<Product[]>([]);

  const fetchWishlist = async () => {
    try {
      const data = await getWishlist();
      setWishlist(data);
    } catch (err) {
      console.error("Error fetching wishlist:", err);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const refreshWishlist = async () => {
    await fetchWishlist();
  };

  const addToWishlistContext = async (productId: string) => {
    try {
      await addToWishlist(productId);
      await fetchWishlist();
    } catch (err) {
      console.error("Error adding to wishlist:", err);
      toast.error("Failed to add item to wishlist.");
    }
  };

  const removeFromWishlistContext = async (productId: string) => {
    try {
      await removeFromWishlist(productId);
      setWishlist((prev) => prev.filter((item) => item.id !== productId));
    } catch (err) {
      console.error("Error removing from wishlist:", err);
      toast.error("Failed to remove item from wishlist.");
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        refreshWishlist,
        addToWishlistContext,
        removeFromWishlistContext,
        setWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
