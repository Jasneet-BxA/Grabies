import { useEffect, useState } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import {
  getProductsByCategory,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  getCurrentUser,
  getFilteredProducts,
  addToCart,
} from "@/lib/api";
import ProductCard from "@/components/product/ProductCard";
import ProductDetailDialog from "@/pages/ProductDetails";
import type { Product } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";
// components/ui/SkeletonCard.tsx
import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonCard() {
  return (
    <div className="flex flex-col space-y-3 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
      <Skeleton className="h-[180px] w-full rounded-lg bg-gray-200" />
      <div className="space-y-2">
        <Skeleton className="h-5 w-3/4 bg-gray-200" />
        <Skeleton className="h-4 w-1/2 bg-gray-200" />
      </div>
    </div>
  );
}


export default function ProductListing() {
  const [products, setProducts] = useState<Product[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  const [tag, setTag] = useState<"veg" | "non-veg" | "">("");
  const [rating, setRating] = useState<number | "">("");
  const [priceRange, setPriceRange] = useState<"lt300" | "300to600" | "">("");
  const location = useLocation();
  const cameFromOurFood = location.state?.fromOurFood === true;

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
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!tag && !rating && !priceRange) {
          const data = await getProductsByCategory(category || "all");
          console.log("Fetched by category:", data);
          setProducts(data);
        } else {
          const products = await getFilteredProducts(category || "all", {
            tag: tag || undefined,
            rating: rating || undefined,
            priceRange: priceRange || undefined,
          });
          console.log("Fetched by filters:", products);
          setProducts(products.data);
          console.log("Products after filtering:", products.data);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, tag, rating, priceRange]);

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
          saveWishlistToLocalStorage(ids);
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
  const { cartitem, refreshCart } = useCart();
  // ... other states and useEffect remain same

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
           toast.success(`💔 Removed "${product.name}" from your CraveBox`);
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
          await addToWishlist(product.id);
    toast.success(`😋 Ohhh! "${product.name}" added to your CraveBox!`);
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

  const isWishlisted = (product: Product) =>
    wishlist.includes(product.id.trim());

  return (
    <>
      <Breadcrumb className="mb-6 text-sm text-gray-600 flex items-center space-x-1">
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>

        {cameFromOurFood ? (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/food">OurFood</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <span className="capitalize text-gray-900 font-medium">
                {category}
              </span>
            </BreadcrumbItem>
          </>
        ) : (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <span className="capitalize text-gray-900 font-medium">
                {category}
              </span>
            </BreadcrumbItem>
          </>
        )}
      </Breadcrumb>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-end items-start gap-4 mb-10 bg-white p-4 rounded-lg shadow-md border border-gray-200">
        {/* Type Toggle */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold text-gray-700">Type</label>
          <div className="flex border border-gray-300 rounded-full overflow-hidden text-sm font-medium shadow-sm">
            {["", "veg", "non-veg"].map((type) => (
              <button
                key={type}
                onClick={() => setTag(type as any)}
                className={`px-4 py-1 transition-all duration-200 ${
                  tag === type
                    ? "bg-orange-500 text-white"
                    : "bg-white text-gray-700 hover:bg-orange-100"
                }`}
              >
                {type === ""
                  ? "All"
                  : type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Rating Select */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold text-gray-700">Rating</label>
          <Select
            onValueChange={(value) => setRating(Number(value))}
            value={rating?.toString() || ""}
          >
            <SelectTrigger className="w-[150px] border-gray-300 shadow-sm hover:border-orange-400 focus:ring-orange-500">
              <SelectValue placeholder="Choose rating" />
            </SelectTrigger>
            <SelectContent>
              {[5, 4, 3, 2, 1].map((r) => (
                <SelectItem key={r} value={r.toString()}>
                  {r} ⭐ & up
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price Range Select */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold text-gray-700">Price</label>
          <Select
            onValueChange={(value) => setPriceRange(value as any)}
            value={priceRange}
          >
            <SelectTrigger className="w-[180px] border-gray-300 shadow-sm hover:border-orange-400 focus:ring-orange-500">
              <SelectValue placeholder="Choose price range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lt300">Less than ₹300</SelectItem>
              <SelectItem value="300to600">₹300 – ₹600</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Reset Button */}
        <div className="sm:ml-auto">
          <button
            onClick={() => {
              setTag("");
              setRating("");
              setPriceRange("");
            }}
            className="text-sm text-red-600 hover:text-red-800 hover:underline mt-2 sm:mt-0"
          >
            Reset Filters
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold text-orange-700 mb-8 capitalize">
          {category ? `${category} Items` : "All Food Items"}
        </h2>

{loading && (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
    {Array.from({ length: 6 }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
)}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && (
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
)}

      </div>
    </>
  );
}
