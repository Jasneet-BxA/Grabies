import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Trash } from "lucide-react";
import {
  getCart,
  removeFromCart,
  addToCart,
} from "@/lib/api"; // Adjust path if needed
import { useCart } from "@/context/CartContext";
import { useNavigate } from "react-router";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Adjust path if needed
import { getUserAddress } from "@/lib/api"; // import your getUserAddress API
import type { Address } from "@/types/index.ts";
import { Skeleton } from "@/components/ui/skeleton";

interface CartItem {
  id: string; // cart table item ID
  quantity: number;
  product: {
    id: string;
    name: string;
    image_url: string;
    price: number;
  };
}

 
export default function Cart() {
  const { cartitem, quantity, removeItem } = useCart();
  const {refreshCart} = useCart();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
 const [addresses, setAddresses] = useState<Address[]>([]);
const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  // ✅ Fetch cart from backend and transform
  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const rawData = await getCart();
      const transformed: CartItem[] = rawData.map((item: any) => ({
        id: item.id,
        quantity: item.quantity,
        product: {
          id: item.products.id,
          name: item.products.name,
          image_url: item.products.image_url,
          price: item.products.price,
        },
      }));
 
      setCartItems(transformed);
    } catch (error) {
      console.error("Failed to fetch cart items", error);
    } finally {
      setLoading(false);
    }
  };
 
 useEffect(() => {
  fetchCartItems();
  fetchAddresses();
}, []);

const fetchAddresses = async () => {
  try {
    const res = await getUserAddress();
    setAddresses(res);
  } catch (err) {
    console.error("Error fetching addresses", err);
  }
};
 
  // ✅ Remove item handler
  const handleRemove = async (cartId: string) => {
    try {
      await removeFromCart(cartId);
      await refreshCart();
      removeItem(cartId);
      setCartItems((prev) => prev.filter((item) => item.id !== cartId));
    } catch (error) {
      console.error("Failed to remove item", error);
    }
  };
 
  // ✅ Update quantity handler
  const updateQuantity = async (
    cartId: string,
    productId: string,
    newQuantity: number
  ) => {
    if (newQuantity < 1) return;
 
    try {
      await addToCart(productId, newQuantity);
      await refreshCart();
      quantity(cartId, productId, newQuantity);
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === cartId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      console.error("Failed to update quantity", error);
    }
  };
 
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );
 
if (loading) {
  return (
    <main className="max-w-5xl mx-auto px-6 py-10 space-y-8">
      <h1 className="text-4xl font-bold text-center text-orange-600">
        🛒 Your Shopping Cart
      </h1>

      <div className="space-y-6">
        {[1, 2, 3].map((_, i) => (
          <div
            key={i}
            className="flex flex-col sm:flex-row items-center gap-6 bg-gray-90 border border-gray-400 p-5 rounded-xl shadow-sm"
          >
            <Skeleton className="w-28 h-28 rounded-lg bg-gray-200" />

            <div className="flex-1 w-full space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/4" />

              <div className="flex gap-3 mt-3">
                <Skeleton className="h-10 w-10 rounded-md" />
                <Skeleton className="h-10 w-10 rounded-md" />
                <Skeleton className="h-10 w-10 rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
 
  if (cartItems.length === 0)
    return (
<p className="text-center py-10 text-gray-500">Your cart is empty.</p>
    );
 
  return (
<main className="max-w-5xl mx-auto px-6 py-10 space-y-8">
  <h1 className="text-4xl font-bold text-center text-orange-600">
    🛒 Your Shopping Cart
  </h1>

  <div className="flex justify-end">
    <Badge variant="secondary" className="text-md px-3 py-1.5 rounded-full">
      {cartItems.reduce((total, item) => total + item.quantity, 0)} item
      {cartItems.reduce((total, item) => total + item.quantity, 0) !== 1 ? "s" : ""}
    </Badge>
  </div>

  <div className="space-y-6">
    {cartItems.map(({ id: cartId, product, quantity }) => (
      <div
        key={cartId}
        className="flex flex-col sm:flex-row items-center gap-6 bg-white border border-gray-200 p-5 rounded-xl shadow-sm hover:shadow-md transition"
      >
        <img
          src={product.image_url}
          alt={product.name}
          className="w-28 h-28 object-cover rounded-lg"
        />

        <div className="flex-1 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{product.name}</h2>
              <p className="text-orange-600 font-bold text-md mt-1">
                ₹{product.price}
              </p>
            </div>

            <div className="flex items-center gap-3 mt-2 sm:mt-0">
             <Button
  variant="outline"
  size="icon"
  onClick={() => updateQuantity(cartId, product.id, quantity - 1)}
  disabled={quantity === 1}
  className="transition-all hover:bg-orange-100 hover:text-orange-600 border-gray-300"
>
  <Minus size={16} />
</Button>

<span className="font-medium text-gray-800">{quantity}</span>

<Button
  variant="outline"
  size="icon"
  onClick={() => updateQuantity(cartId, product.id, quantity + 1)}
  className="transition-all hover:bg-orange-100 hover:text-orange-600 border-gray-300"
>
  <Plus size={16} />
</Button>

<Button
  variant="ghost"
  size="icon"
  className="text-red-500 hover:bg-red-100 hover:text-red-600 ml-2 transition-all"
  onClick={() => handleRemove(cartId)}
>
  <Trash size={18} />
</Button>

            </div>
          </div>
        </div>
      </div>
    ))}
  </div>

  {/* Address Selection */}
 <div className="w-full max-w-lg mx-auto">
  <label className="block text-gray-800 font-semibold mb-2">
    📍 Select Delivery Address:
  </label>
  <Select
    onValueChange={(value) => {
      const selected = addresses.find(
        (addr) => `${addr.address_line},${addr.city}` === value
      );
      setSelectedAddress(selected || null);
    }}
  >
    <SelectTrigger className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white shadow-sm hover:border-orange-500 focus:ring-2 focus:ring-orange-500 transition duration-150">
      <SelectValue placeholder="Choose an address" />
    </SelectTrigger>

    <SelectContent className="bg-white rounded-lg shadow-lg border border-gray-200">
      {addresses.map((addr, index) => (
        <SelectItem
          key={index}
          value={`${addr.address_line},${addr.city}`}
          className="hover:bg-orange-100 hover:text-orange-700 cursor-pointer px-4 py-2 transition-colors duration-150 rounded-md"
        >
          {addr.address_line}, {addr.city}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>


  {/* Total & CTA */}
  {/* Total & CTA */}
<div className="flex flex-col sm:flex-row justify-between items-center mt-10 border-t pt-6 gap-4">
  <div className="text-2xl font-semibold text-gray-800">
    Total:{" "}
    <span className="text-orange-600">₹{totalPrice.toFixed(2)}</span>
  </div>

  {/* Show button only if an address is selected */}
  {selectedAddress ? (
    <Button
      size="lg"
      className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg transition"
      onClick={() => {
        navigate("/order", {
          state: {
            address: selectedAddress,
          },
        });
      }}
    >
      🚀 Let's Order Now
    </Button>
  ) : (
    <p className="text-sm text-gray-500 italic">
      Please select a delivery address to proceed.
    </p>
  )}
</div>

</main>

  );
}