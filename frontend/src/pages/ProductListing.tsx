import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  getProductsByCategory,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  getCurrentUser,
} from "@/lib/api";
import ProductCard from "@/components/product/ProductCard";
import ProductDetailDialog from "@/pages/ProductDetails";
import type { Product } from "@/types";

export default function ProductListing() {
  const [products, setProducts] = useState<Product[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");

  const WISHLIST_KEY = "local_wishlist";

  function getWishlistFromLocalStorage(): string[] {
    try {
      const stored = localStorage.getItem(WISHLIST_KEY);
      if (!stored) return [];
      const parsed: string[] = JSON.parse(stored);
      return parsed.map((id) => id.trim());
    } catch {
      return [];
    }
  }

  function saveWishlistToLocalStorage(wishlist: string[]) {
    const trimmedWishlist = wishlist.map((id) => id.trim());
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(trimmedWishlist));
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getProductsByCategory(category || "all");
        setProducts(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [category]);

  useEffect(() => {
    const fetchUserAndWishlist = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);

        if (currentUser) {
          const wishlistItems = await getWishlist();
          const ids = wishlistItems.map((item: Product) => item.id.trim());
          setWishlist(ids);
          saveWishlistToLocalStorage(ids); // Sync server -> localStorage
        } else {
          const localWishlist = getWishlistFromLocalStorage();
          setWishlist(localWishlist);
        }
      } catch (err) {
        console.error("Could not fetch wishlist", err);
        const localWishlist = getWishlistFromLocalStorage();
        setWishlist(localWishlist);
      }
    };

    fetchUserAndWishlist();
  }, []);

  const handleAddToCart = (product: Product) => {
    console.log("Added to cart:", product);
  };

  const handleToggleWishlist = async (product: Product) => {
  const productId = product.id.trim();
  const isAlreadyWishlisted = wishlist.includes(productId);

  if (isAlreadyWishlisted) {
    // Try removing from backend first
    if (user) {
      try {
        await removeFromWishlist(productId);
        const updatedWishlist = wishlist.filter((id) => id !== productId);
        setWishlist(updatedWishlist);
        saveWishlistToLocalStorage(updatedWishlist);
      } catch (err) {
        console.error("Failed to remove from server wishlist", err);
      }
    } else {
      // Anonymous/local user
      const updatedWishlist = wishlist.filter((id) => id !== productId);
      setWishlist(updatedWishlist);
      saveWishlistToLocalStorage(updatedWishlist);
    }
  } else {
    if (user) {
      try {
        await addToWishlist(productId);
        const updatedWishlist = [...wishlist, productId];
        setWishlist(updatedWishlist);
        saveWishlistToLocalStorage(updatedWishlist);
      } catch (err) {
        console.error("Failed to add to server wishlist", err);
      }
    } else {
      // Anonymous/local user
      const updatedWishlist = [...wishlist, productId];
      setWishlist(updatedWishlist);
      saveWishlistToLocalStorage(updatedWishlist);
    }
  }
};


  const isWishlisted = (product: Product) => wishlist.includes(product.id.trim());

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-orange-700 mb-8 capitalize">
        {category ? `${category} Items` : "All Food Items"}
      </h2>

      {loading && <p className="text-center text-gray-500">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

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
                showWishlistIcon={!!user}
              />
            }
          />
        ))}
      </div>
    </div>
  );
}
