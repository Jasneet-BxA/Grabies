import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "@/components/product/ProductCard";
import {
  getWishlist,
  getCurrentUser,
  addToWishlist,
  removeFromWishlist,
  addToCart,
} from "@/lib/api";
import type { Product, User } from "@/types";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";

const WISHLIST_KEY = "local_wishlist";

export function SkeletonCard() {
  return (
    <div className="flex flex-col space-y-3 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
      <Skeleton className="h-[180px] w-full rounded-lg bg-gray-200" />
      <div className="space-y-2">
        <Skeleton className="h-5 w-3/4 bg-gray-200" />
        <Skeleton className="h-4 w-1/2 bg-gray-200" />
      </div>
    </div>
  );
}

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<Product[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { cartitem, refreshCart } = useCart();
  console.log("Search query:", query); // <-- Add this to debug
useEffect(() => {
    if (!query) return;

    setLoading(true);

    fetch(`/api/foods/search?q=${encodeURIComponent(query)}`)
      .then((res) => res.json())
      .then((data) => {
        setResults(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [query]);

  if (!query) {
    return <p>Please enter a search query.</p>;
  }

  if (loading) {
    return <p>Loading results...</p>;
  }

  if (results.length === 0) {
    return <p>No results found for "{query}".</p>;
  }
  const getWishlistFromLocalStorage = (): string[] => {
    try {
      const stored = localStorage.getItem(WISHLIST_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  const saveWishlistToLocalStorage = (wishlist: string[]) => {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  };

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/foods/search?q=${encodeURIComponent(query)}`);
        setResults(res.data);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  useEffect(() => {
    const fetchUserAndWishlist = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);

        if (currentUser) {
          const wishlistItems = await getWishlist();
          const ids = wishlistItems.map((item: { id: string; }) => item.id.trim());
          setWishlist(ids);
          saveWishlistToLocalStorage(ids);
        } else {
          const localWishlist = getWishlistFromLocalStorage();
          setWishlist(localWishlist);
        }
      } catch (err) {
        console.error("Wishlist fetch failed", err);
        setWishlist(getWishlistFromLocalStorage());
      }
    };

    fetchUserAndWishlist();
  }, []);

  const handleAddToCart = async (product: Product) => {
    const isAlreadyInCart = cartitem.some((item) => item.product.id === product.id);
    if (isAlreadyInCart) {
      toast("Already in cart", { icon: "ℹ️" });
      return;
    }

    try {
      await addToCart(product.id, 1);
      await refreshCart();
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      console.error("Failed to add to cart", error);
      toast.error("Failed to add item to cart.");
    }
  };

  const handleToggleWishlist = async (product: Product) => {
    const productId = product.id.trim();
    const isWishlisted = wishlist.includes(productId);

    if (isWishlisted) {
      if (user) {
        try {
          await removeFromWishlist(productId);
          toast.success(`💔 Removed "${product.name}" from your CraveBox`);
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
          await addToWishlist(product.id);
          toast.success(`😋 "${product.name}" added to your CraveBox!`);
        } catch (err) {
          console.error("Failed to add to server wishlist", err);
        }
      }

      const updated = [...wishlist, productId];
      setWishlist(updated);
      saveWishlistToLocalStorage(updated);
    }
  };

  const isWishlisted = (product: Product) =>
    wishlist.includes(product.id.trim());

  return (
    <div className="max-w-6xl mx-auto px-4 py-20">
      <h2 className="text-2xl font-bold mb-6 text-center text-orange-700">
        Search Results for "{query}"
      </h2>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {results.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              onToggleWishlist={handleToggleWishlist}
              isWishlisted={isWishlisted(product)}
              showWishlistIcon={!!user}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 mt-10">
          No food items found matching your search.
        </p>
      )}
    </div>
  );
}
