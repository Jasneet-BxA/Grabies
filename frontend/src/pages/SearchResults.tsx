import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "@/components/product/ProductCard";
import {
  getWishlist,
  getCurrentUser,
  addToWishlist,
  removeFromWishlist,
  addToCart,
  search,
} from "@/lib/api";
import type { Product, User } from "@/types";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";
import { Skeleton } from "@/components/ui/skeleton";

const WISHLIST_KEY = "local_wishlist";

export function SkeletonCard() {
  return (
    <div className="flex flex-col space-y-3 bg-white p-5 rounded-xl border border-gray-200 shadow-md animate-pulse hover:shadow-lg transition-shadow duration-300">
      <Skeleton className="h-[180px] w-full rounded-lg bg-gray-200" />
      <div className="space-y-2">
        <Skeleton className="h-6 w-3/4 bg-gray-200 rounded" />
        <Skeleton className="h-5 w-1/2 bg-gray-200 rounded" />
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
  const [loading, setLoading] = useState(false);
  const { cartitem, refreshCart } = useCart();

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
    const fetchUserAndWishlist = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);

        if (currentUser) {
          const wishlistItems = await getWishlist();
          const ids = wishlistItems.map((item: { id: string }) => item.id.trim());
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

  useEffect(() => {
    if (!query) return;

    const fetchResults = async () => {
      setLoading(true);
      try {
        const data = await search(query);
        setResults(data);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  if (!query) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-xl text-gray-500">Please enter a search query to get started.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-24 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <p className="text-lg text-gray-600 mb-4">No results found for:</p>
        <p className="text-2xl font-semibold text-orange-600 break-words max-w-md text-center">"{query}"</p>
      </div>
    );
  }

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

  const isWishlisted = (product: Product) => wishlist.includes(product.id.trim());

  return (
    <section className="bg-gray-50 min-h-screen py-24">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-center text-orange-700 tracking-wide">
          Your Craving Match is <span className="text-orange-900">"{query}"</span>
        </h2>
        <div className="w-24 h-1 mx-auto mb-10 rounded-full bg-gradient-to-r from-orange-400 via-orange-600 to-orange-500 shadow-lg"></div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 animate-fadeIn">
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
      </div>
    </section>
  );
}
