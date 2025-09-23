import { useEffect, useState } from "react";
import ProductCard from "@/components/product/ProductCard";
import ExploreMoreFood from "@/components/product/ExploreMoreFood";
import ProductDetailDialog from "@/pages/ProductDetails";
import {
  getAllProducts,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  getCurrentUser,
} from "@/lib/api";
import type { Product, User } from "@/types";

export default function OurFood() {
  const [products, setProducts] = useState<Product[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [user, setUser] = useState<User | null>(null);

  const WISHLIST_KEY = "local_wishlist";

  const getWishlistFromLocalStorage = (): string[] => {
    try {
      const stored = localStorage.getItem(WISHLIST_KEY);
      if (!stored) return [];
      return JSON.parse(stored);
    } catch {
      return [];
    }
  };

  const saveWishlistToLocalStorage = (wishlist: string[]) => {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllProducts(21, 0);
      setProducts(data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);

        if (currentUser) {
          const wishlistItems: Product[] = await getWishlist();
          const ids = wishlistItems.map((item) => item.id.trim());
          setWishlist(ids);
          saveWishlistToLocalStorage(ids); // Sync server -> local
        } else {
          const localWishlist = getWishlistFromLocalStorage();
          setWishlist(localWishlist);
        }
      } catch (err) {
        console.error("Failed to fetch wishlist:", err);
        const fallbackWishlist = getWishlistFromLocalStorage();
        setWishlist(fallbackWishlist);
      }
    };

    fetchWishlist();
  }, []);

  const handleAddToCart = (product: Product) => {
    console.log("Add to cart:", product);
  };

  const handleToggleWishlist = async (product: Product) => {
    const productId = product.id.trim();
    const isAlreadyWishlisted = wishlist.includes(productId);

    if (isAlreadyWishlisted) {
      if (user) {
        try {
          await removeFromWishlist(productId);
        } catch (err) {
          console.error("Failed to remove from server wishlist", err);
        }
      }

      const updated = wishlist.filter((id) => id !== productId);
      setWishlist(updated);
      saveWishlistToLocalStorage(updated);
    } else {
      if (user) {
        try {
          await addToWishlist(productId);
        } catch (err) {
          console.error("Failed to add to server wishlist", err);
        }
      }

      const updated = [...wishlist, productId];
      setWishlist(updated);
      saveWishlistToLocalStorage(updated);
    }
  };

  const isWishlisted = (product: Product) => wishlist.includes(product.id.trim());

  return (
    <>
      <ExploreMoreFood />
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold text-orange-700 mb-8 text-center">
          Flavors That Flirt with Your Senses!
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {products.map((product) => (
            <ProductDetailDialog
              key={product.id}
              category={product.cuisine}
              productName={product.name}
              triggerElement={
                <ProductCard
                  product={product}
                  onAddToCart={handleAddToCart}
                  onToggleWishlist={handleToggleWishlist}
                  isWishlisted={isWishlisted(product)}
                />
              }
            />
          ))}
        </div>
      </div>
    </>
  );
}
