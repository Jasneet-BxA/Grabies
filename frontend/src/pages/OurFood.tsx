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
  addToCart,
} from "@/lib/api";
import type { Product, User } from "@/types";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";
import { Skeleton } from "@/components/ui/skeleton";

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

export default function OurFood() {
  const [products, setProducts] = useState<Product[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

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
      try {
        setLoading(true);
        const data = await getAllProducts(21, 0);
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        setLoading(false);
      }
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
          saveWishlistToLocalStorage(ids);
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

  const { cartitem, refreshCart } = useCart();

const handleAddToCart = async (product: Product) => {
  if (!product) return;

  if (!user) {
    toast("🔐 Please login first to add items to your cart.");
    return;
  }

  const isAlreadyInCart = cartitem.some(
    (item) => item.product.id === product.id
  );

  if (isAlreadyInCart) {
    toast("ℹ️ Already added to cart", {
      icon: "🛒",
      style: { background: "#333", color: "#fff" },
    });
    return;
  }
  try {
    await addToCart(product.id, 1);
    await refreshCart();
    toast.success(`🛒 ${product.name} added to cart!`);
  } catch (error) {
    console.error("Failed to add to cart:", error);
    toast("❌ Something went wrong. Please try again later.");
  }
};

  const handleToggleWishlist = async (product: Product) => {
  const productId = product.id.trim();
  const isAlreadyWishlisted = wishlist.includes(productId);

  if (isAlreadyWishlisted) {
    if (user) {
      try {
        await removeFromWishlist(productId);
        const updatedWishlist = wishlist.filter((id) => id !== productId);
        setWishlist(updatedWishlist);
        saveWishlistToLocalStorage(updatedWishlist);
        toast(`💔 Removed "${product.name}" from your CraveBox`);
      } catch (err) {
        console.error("Failed to remove from server wishlist", err);
        toast.error("❌ Could not remove from wishlist. Try again.");
      }
    } else {
      const updatedWishlist = wishlist.filter((id) => id !== productId);
      setWishlist(updatedWishlist);
      saveWishlistToLocalStorage(updatedWishlist);
      toast("💔 Removed from local wishlist.");
    }
  } else {
    if (user) {
      try {
        await addToWishlist(productId);
        const updatedWishlist = [...wishlist, productId];
        setWishlist(updatedWishlist);
        saveWishlistToLocalStorage(updatedWishlist);
        toast.success(`😋 "${product.name}" added to your CraveBox!`);
      } catch (err) {
        console.error("Failed to add to server wishlist", err);
        toast.error("❌ Could not add to wishlist. Try again.");
      }
    } else {
      const updatedWishlist = [...wishlist, productId];
      setWishlist(updatedWishlist);
      saveWishlistToLocalStorage(updatedWishlist);
    }
  }
};

  const isWishlisted = (product: Product) =>
    wishlist.includes(product.id.trim());

  return (
    <>
      <ExploreMoreFood />
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold text-orange-700 mb-8 text-center">
          Flavors That Flirt with Your Senses!
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : products.map((product) => (
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
    </>
  );
}
