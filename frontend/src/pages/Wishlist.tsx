import { useEffect, useState } from "react";
import { getWishlist, removeFromWishlist, getCurrentUser, addToCart } from "@/lib/api";
import ProductCard from "@/components/product/ProductCard";
import type { Product, User } from "@/types";
import { FaHeartBroken } from "react-icons/fa";
import toast from "react-hot-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/context/CartContext";

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
export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setLoading(true);
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        if (currentUser) {
          const wishlistItems = await getWishlist();
          setWishlist(wishlistItems);
        }
      } catch (err) {
        console.error("Error loading wishlist", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  const { cartitem, refreshCart } = useCart();

  const handleAddToCart = async (product: Product) => {
    if (!product) return;

    const isAlreadyInCart = cartitem.some(
      (item) => item.product.id === product.id
    );

    if (isAlreadyInCart) {
      toast("Already added to cart", {
        icon: "ℹ️",
        style: { background: "#333", color: "#fff" },
      });
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
    try {
      await removeFromWishlist(product.id);
      setWishlist((prev) => prev.filter((item) => item.id !== product.id));

      toast.success(`💔 Removed "${product.name}" from your CraveBox`);
    } catch (err) {
      console.error("Error removing from wishlist", err);
      toast.error("Failed to update wishlist. Try again.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-orange-700 tracking-tight">
          ❤️ My CraveBox
        </h2>
        <p className="text-gray-600 mt-2 text-sm">
          All the products you’ve loved are here. Add them to cart anytime.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : wishlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <FaHeartBroken className="text-6xl mb-4 text-red-400 animate-pulse" />
          <p className="text-lg font-medium">No items in your wishlist yet.</p>
          <p className="text-sm mt-1 text-gray-400">
            Start exploring and add some favorites!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 animate-fade-in">
          {wishlist.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              onToggleWishlist={handleToggleWishlist}
              isWishlisted={true}
              showWishlistIcon={!!user}
            />
          ))}
        </div>
      )}
    </div>
  );
}
