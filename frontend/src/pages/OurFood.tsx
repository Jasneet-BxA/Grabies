import { useEffect, useState } from "react";
import ProductCard from "@/components/product/ProductCard";
import ExploreMoreFood from "@/components/product/ExploreMoreFood";
import ProductDetailDialog from "@/pages/ProductDetails";
import { getAllProducts, getCurrentUser } from "@/lib/api";
import type { Product, User } from "@/types";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useWishlist } from "@/context/WishlistContext";

// Skeleton card for loading state
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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const {
    wishlist,
    addToWishlistContext,
    removeFromWishlistContext,
    refreshWishlist,
  } = useWishlist();

  const { cartitem, addItem } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const productData = await getAllProducts(21, 0);
        setProducts(productData);
      } catch {
        toast.error("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch {
        setUser(null);
      }
    };
    fetchUser();
    refreshWishlist();
  }, [refreshWishlist]);

  const handleAddToCart = async (product: Product) => {
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
      addItem(product.id, 1);
      toast.success(`🛒 ${product.name} added to cart!`);
    } catch {
      toast("❌ Something went wrong. Please try again later.");
    }
  };

  const handleToggleWishlist = async (product: Product) => {
    const isAlreadyWishlisted = wishlist.some((item) => item.id === product.id);
    if (isAlreadyWishlisted) {
      await removeFromWishlistContext(product.id);
      toast(`💔 Removed "${product.name}" from your CraveBox`);
    } else {
      await addToWishlistContext(product.id);
      toast.success(`😋 "${product.name}" added to your CraveBox!`);
    }
    await refreshWishlist();
  };

  const isWishlisted = (product: Product) =>
    wishlist.some((item) => item.id === product.id);

  return (
    <>
      <ExploreMoreFood />
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold text-orange-700 mb-8 text-center">
          Flavors That Flirt with Your Senses!
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))
            : products.map((product) => (
                <ProductDetailDialog
                  key={product.id}
                  category={product.cuisine}
                  productName={product.name}
                  triggerElement={
                    <ProductCard
                      product={product}
                      onAddToCart={handleAddToCart}
                      onToggleWishlist={() => handleToggleWishlist(product)}
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
