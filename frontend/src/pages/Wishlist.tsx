// pages/Wishlist.tsx
import { useEffect, useState } from "react";
import { getWishlist, removeFromWishlist, getCurrentUser } from "@/lib/api";
import ProductCard from "@/components/product/ProductCard";
import type { Product, User } from "@/types";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [user, setUser] = useState<User| null>(null);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        if (currentUser) {
          const wishlistItems = await getWishlist();
          setWishlist(wishlistItems);
        }
      } catch (err) {
        console.error("Error loading wishlist", err);
      }
    };

    fetchWishlist();
  }, []);

  const handleAddToCart = (product: Product) => {
    console.log("Added to cart:", product);
  };

  const handleToggleWishlist = async (product: Product) => {
    try {
      await removeFromWishlist(product.id);
      setWishlist((prev) => prev.filter((item) => item.id !== product.id));
    } catch (err) {
      console.error("Error removing from wishlist", err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-orange-700 mb-8">Your Wishlist</h2>
      {wishlist.length === 0 ? (
        <p className="text-gray-600 text-center">No items in wishlist yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {wishlist.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              onToggleWishlist={handleToggleWishlist}
              isWishlisted={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}
