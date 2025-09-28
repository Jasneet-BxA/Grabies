import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Product } from "@/types/index";
import { addToCart, getProductByName } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { getCurrentUser } from "@/lib/api";
import type { User } from "@/types";
import { useAuth } from "@/context/AuthContext";

type Props = {
  category: string;
  productName: string;
  triggerElement: React.ReactNode;
};

export default function ProductDetailDialog({
  category,
  productName,
  triggerElement,
}: Props) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const {user} = useAuth()

  const { cartitem, addItem } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getProductByName(category, productName);
        setProduct(data);
      } catch (err) {
        console.error("Failed to fetch product details:", err);
        setError("Failed to load product details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchProduct();
    }
  }, [open, category, productName]);

const handleAddToCart = async (product: Product) => {
  if (!product) return;
  if (!navigator.onLine) {
    toast.error("📡 Network issue. Please try again later.");
    return;
  }

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
    await addItem(product.id, 1);
    toast.success(`🛒 ${product.name} added to cart!`);
  } catch (error) {
    console.error("Failed to add to cart:", error);
    toast("❌ Something went wrong. Please try again later.");
  }
};

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div>{triggerElement}</div>
      </DialogTrigger>

      <DialogContent className="max-w-md sm:max-w-2xl bg-white rounded-lg p-6">
        <DialogTitle className="sr-only">{productName}</DialogTitle>

        {loading || !product ? (
          <div className="flex flex-col sm:flex-row gap-6">
            <Skeleton className="w-full sm:w-1/2 h-64 bg-gray-200" />
            <div className="flex-1 space-y-4">
              <Skeleton className="h-8 w-3/4 bg-gray-200" />
              <Skeleton className="h-4 w-full bg-gray-200" />
              <Skeleton className="h-4 w-full bg-gray-200" />
              <Skeleton className="h-6 w-1/4 bg-gray-200" />
              <Skeleton className="h-10 w-full rounded bg-gray-200" />
            </div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-6">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full sm:w-1/2 h-64 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{product.name}</h2>
              <p className="text-gray-600 mt-2">{product.description}</p>
              <div className="mt-4 flex justify-between">
                <span className="text-orange-600 font-semibold text-lg">
                  ₹{product.price}
                </span>
                <span className="text-yellow-500 text-sm">
                  ⭐ {product.rating}
                </span>
              </div>
              <button
                className={`mt-6 w-full ${
                  product.availability && product.stock > 0
                    ? "bg-orange-600 hover:bg-orange-700"
                    : "bg-gray-300 cursor-not-allowed"
                } text-white py-2 rounded transition`}
                disabled={!product.availability || product.stock === 0}
                onClick={() => handleAddToCart(product)}
              >
                {product.availability && product.stock > 0
                  ? "Add to Cart"
                  : "Out of Stock"}
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
