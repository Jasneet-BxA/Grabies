import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import ExploreMoreFood from "@/components/product/ExploreMoreFood";
import ProductCard from "@/components/product/ProductCard";
import type { Product, User } from "@/types";
import {
  getAllProducts,
  getCurrentUser,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  addToCart,
} from "@/lib/api";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";

const slides = [
  {
    image:
      "https://plus.unsplash.com/premium_photo-1695758787675-d67242b3529f?q=80&w=721&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Delicious Burgers",
    subtitle: "Get the juiciest deals on all burgers",
  },
  {
    image:
      "https://images.unsplash.com/photo-1703073186159-ae38e1c42dee?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Pizza Mania",
    subtitle: "Cheesy, crusty, and loaded with toppings",
  },
  {
    image:
      "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Momo Melody",
    subtitle: "Spicy flavors delivered to your door",
  },
];

const WISHLIST_KEY = "local_wishlist";

function getWishlistFromLocalStorage(): string[] {
  try {
    const stored = localStorage.getItem(WISHLIST_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveWishlistToLocalStorage(wishlist: string[]) {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
}

function SkeletonCard() {
  return (
    <div className="border rounded-lg p-4 bg-white animate-pulse">
      <div className="h-48 bg-gray-300 rounded mb-4" />
      <div className="h-6 bg-gray-300 rounded w-3/4 mb-2" />
      <div className="h-4 bg-gray-300 rounded w-full mb-1" />
      <div className="h-4 bg-gray-300 rounded w-1/2" />
    </div>
  );
}

export default function Home() {
  const [current, setCurrent] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();
  const delay = 4000;
  const [previewProducts, setPreviewProducts] = useState<Product[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(
      () => setCurrent((prev) => (prev + 1) % slides.length),
      delay
    );
    return () => resetTimeout();
  }, [current]);

  const resetTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  useEffect(() => {
    const fetchPreview = async () => {
      setLoading(true);
      try {
        const data = await getAllProducts(6, 0);
        setPreviewProducts(data);
      } catch (error) {
        console.error("Error fetching preview products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPreview();
  }, []);

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
        const fallback = getWishlistFromLocalStorage();
        setWishlist(fallback);
      }
    };

    fetchUserAndWishlist();
  }, []);

  const handleToggleWishlist = async (product: Product) => {
    const productId = product.id.trim();
    const isAlreadyWishlisted = wishlist.includes(productId);

    let updatedWishlist: string[];

    if (isAlreadyWishlisted) {
      updatedWishlist = wishlist.filter((id) => id !== productId);
      setWishlist(updatedWishlist);
      saveWishlistToLocalStorage(updatedWishlist);

      if (user) {
        try {
          await removeFromWishlist(productId);
          toast.success(`💔 Removed "${product.name}" from your CraveBox`);
        } catch (err) {
          console.error("Failed to remove from server wishlist", err);
        }
      }
    } else {
      updatedWishlist = [...wishlist, productId];
      setWishlist(updatedWishlist);
      saveWishlistToLocalStorage(updatedWishlist);

      if (user) {
        try {
          await addToWishlist(productId);
          toast.success(`😋 Ohhh! "${product.name}" added to your CraveBox!`);
        } catch (err) {
          console.error("Failed to add to server wishlist", err);
        }
      }
    }
  };

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

  const isWishlisted = (product: Product) =>
    wishlist.includes(product.id.trim());

  return (
    <div className="w-full ">
      <div className="relative w-full overflow-hidden h-[400px] md:h-[500px]">
        <div
          className="whitespace-nowrap transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div
              key={index}
              className="inline-block w-full h-[400px] md:h-[500px] relative"
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover brightness-75"
              />
              <div className="absolute inset-0 flex flex-col items-start justify-center px-8 md:px-20 text-white z-10 ">
                <h2 className="text-3xl md:text-5xl font-bold mb-2 drop-shadow-lg">
                  {slide.title}
                </h2>
                <p className="text-lg md:text-2xl drop-shadow">
                  {slide.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`w-3 h-3 rounded-full ${
                current === index ? "bg-white" : "bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="w-full bg-orange-50 mt-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 px-4 py-10">
          <div className="w-full md:w-1/2">
            <img
              src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=900&q=80"
              alt="About Grabies"
              className="w-full h-full rounded-lg shadow-md object-cover"
            />
          </div>

          <div className="w-full md:w-1/2">
            <h2 className="text-4xl font-bold text-orange-700 mb-4">
              About Grabies
            </h2>
            <p className="text-gray-700 mb-6 max-w-xl">
              Grabies simplifies your life by bringing diverse cuisines from
              your favorite local restaurants directly to your doorstep. From
              the aromatic spices of a Hyderabadi biryani to the comforting
              warmth of a hot pizza and the sweet allure of decadent desserts,
              our platform connects you with a vast array of culinary delights.
            </p>
            <Button
              onClick={() => navigate("/about")}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              Know More
            </Button>
          </div>
        </div>
      </div>

      <ExploreMoreFood />

      <div className="w-full bg-orange-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-orange-700 mb-8">
            Taste Sensation
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {loading
              ? Array.from({ length: 6 }).map((_, idx) => (
                  <SkeletonCard key={idx} />
                ))
              : previewProducts.map((product) => (
                  <div
                    key={product.id}
                    className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
                  >
                    <div className="relative w-full h-48">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-xl font-semibold text-gray-800 mb-1">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="mt-4 flex justify-between items-center">
                        <span className="text-orange-600 font-bold text-lg">
                          ₹{product.price}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </div>
    </div>
  );
}
