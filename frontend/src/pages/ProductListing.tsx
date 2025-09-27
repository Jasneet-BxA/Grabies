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
import { FaBoxOpen } from 'react-icons/fa';
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "@/types/index";
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

type TagType = "" | "veg" | "non-veg";
type PriceRangeType = "" | "lt300" | "300to600";
type SortType = "" | "price_asc" | "price_desc";

export default function ProductListing() {
  const [sort, setSort] = useState<SortType>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  const [tag, setTag] = useState<TagType>("");
  const [rating, setRating] = useState<number | "">("");
  const [priceRange, setPriceRange] = useState<PriceRangeType>("");
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

        if (!tag && !rating && !priceRange && !sort) {
          const data = await getProductsByCategory(category || "all");
          setProducts(data);
        } else {
          const filtered = await getFilteredProducts(category || "all", {
            tag: tag || undefined,
            rating: rating || undefined,
            priceRange: priceRange || undefined,
            sort: sort || undefined,
          });
          setProducts(filtered.data || filtered); // adjust based on API response structure
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, tag, rating, priceRange, sort]);

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
      toast.error("Your cart’s waiting—just login! 🔑");
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
        }
      } else {
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
          toast.success(`😋 Ohhh! "${product.name}" added to your CraveBox!`);
        } catch (err) {
          console.error("Failed to add to server wishlist", err);
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
      <Breadcrumb className="mb-6 text-sm text-gray-600 flex items-center space-x-1">
        {cameFromOurFood ? (
          <>
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

      <div className="flex flex-col sm:flex-row sm:items-end items-start gap-4 mb-10 bg-white p-4 rounded-lg shadow-md border border-gray-200">
        <div className="flex flex-col gap-1">
          <label className="font-semibold text-gray-700">Type</label>
          <div className="flex border border-gray-300 rounded-full overflow-hidden text-sm font-medium shadow-sm">
            {["", "veg", "non-veg"].map((type) => (
              <button
                key={type}
                onClick={() => setTag(type as TagType)}
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

        <div className="flex flex-col gap-1">
          <label className="font-semibold text-orange-600">Rating</label>
          <Select
            onValueChange={(value) => setRating(value ? Number(value) : "")}
            value={rating?.toString() || ""}
          >
            <SelectTrigger className="w-[150px] border border-orange-400 bg-white rounded-md shadow-md hover:border-orange-500 focus:ring-2 focus:ring-orange-400 focus:outline-none transition">
              <SelectValue
                placeholder="Choose rating"
                className="text-gray-700"
              />
            </SelectTrigger>
            <SelectContent className="bg-white rounded-md shadow-lg border border-orange-300">
              {[5, 4.7, 4.5, 4].map((r) => (
                <SelectItem
                  key={r}
                  value={r.toString()}
                  className="hover:bg-orange-100 focus:bg-orange-200 cursor-pointer rounded-md text-orange-700 font-semibold"
                >
                  {r} ⭐ & up
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-semibold text-orange-600">Price</label>
          <Select
            onValueChange={(value) => setPriceRange(value as PriceRangeType)}
            value={priceRange}
          >
            <SelectTrigger className="w-[180px] border border-orange-400 bg-white rounded-md shadow-md hover:border-orange-500 focus:ring-2 focus:ring-orange-400 focus:outline-none transition">
              <SelectValue
                placeholder="Choose price range"
                className="text-gray-700"
              />
            </SelectTrigger>
            <SelectContent className="bg-white rounded-md shadow-lg border border-orange-300">
              <SelectItem
                value="lt300"
                className="hover:bg-orange-100 focus:bg-orange-200 cursor-pointer rounded-md text-orange-700 font-semibold"
              >
                Less than ₹300
              </SelectItem>
              <SelectItem
                value="300to600"
                className="hover:bg-orange-100 focus:bg-orange-200 cursor-pointer rounded-md text-orange-700 font-semibold"
              >
                ₹300 – ₹600
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-semibold text-orange-600">Sort by</label>
          <Select
            onValueChange={(value) => setSort(value as SortType)}
            value={sort}
          >
            <SelectTrigger className="w-[180px] border border-orange-400 bg-white rounded-md shadow-md hover:border-orange-500 focus:ring-2 focus:ring-orange-400 focus:outline-none transition">
              <SelectValue
                placeholder="Sort by price"
                className="text-gray-700"
              />
            </SelectTrigger>
            <SelectContent className="bg-white rounded-md shadow-lg border border-orange-300">
              <SelectItem
                value="price_asc"
                className="hover:bg-orange-100 focus:bg-orange-200 cursor-pointer rounded-md text-orange-700 font-semibold"
              >
                Price: Low to High
              </SelectItem>
              <SelectItem
                value="price_desc"
                className="hover:bg-orange-100 focus:bg-orange-200 cursor-pointer rounded-md text-orange-700 font-semibold"
              >
                Price: High to Low
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="sm:ml-auto">
          <button
            onClick={() => {
              setTag("");
              setRating("");
              setPriceRange("");
              setSort("");
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
          <>
            {products.length === 0 ? (
  <div className="max-w-md mx-auto p-8 mt-20 text-center text-orange-700">
    <FaBoxOpen className="text-6xl mx-auto mb-4 animate-pulse" />
    <h3 className="text-2xl font-semibold mb-2">
      No Products Found
    </h3>
    <p className="text-orange-600">
      Sorry, we couldn’t find any products matching your filters.
      Please try adjusting your search criteria.
    </p>
  </div>
)  : (
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
          </>
        )}
      </div>
    </>
  );
}
