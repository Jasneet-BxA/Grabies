import { useEffect, useState } from "react";
import { getCurrentUser, addToCart } from "@/lib/api";
import ProductCard from "@/components/product/ProductCard";
import type { Product, User } from "@/types";
import { FaHeartBroken } from "react-icons/fa";
import toast from "react-hot-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const { wishlist, removeFromWishlistContext } = useWishlist();
  const { cartitem, refreshCart, addItem } = useCart();

  // Fetch user only
  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        console.error("Failed to fetch user", err);
        toast.error("Failed to load user info.");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const handleAddToCart = async (product: Product) => {
    if (!user) {
      toast("🔐 Please login first to add items to your cart.");
      return;
    }

    const alreadyInCart = cartitem.some((item) => item.product.id === product.id);
    if (alreadyInCart) {
      toast("ℹ️ Already in cart", {
        icon: "🛒",
        style: { background: "#333", color: "#fff" },
      });
      return;
    }

    try {
      addItem(product.id, 1); // from CartContext
      toast.success(`🛒 ${product.name} added to cart!`);
    } catch (err) {
      console.error("Error adding to cart", err);
      toast.error("❌ Failed to add to cart");
    }
  };

  const handleToggleWishlist = async (product: Product) => {
    await removeFromWishlistContext(product.id);
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
          {[...Array(6)].map((_, i) => (
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
