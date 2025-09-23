import { useEffect, useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Trash } from "lucide-react";
import {
  getCart,
  removeFromCart,
  addToCart,
} from "@/lib/api"; // Make sure this is correct
 
interface CartItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    image_url: string;
    price: number;
  };
}
 
export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
 
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
  }, []);
 
  const handleRemove = async (cartId: string) => {
    try {
      await removeFromCart(cartId);
      setCartItems((prev) => prev.filter((item) => item.id !== cartId));
    } catch (error) {
      console.error("Failed to remove item", error);
    }
  };
 
  const updateQuantity = async (
    cartId: string,
    productId: string,
    newQuantity: number
  ) => {
    if (newQuantity < 1) return;
 
    try {
      await addToCart(productId, newQuantity);
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === cartId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      console.error("Failed to update quantity", error);
    }
  };
 
  // ✅ Total price and quantity calculations
  const totalPrice = useMemo(
    () =>
      cartItems.reduce(
        (acc, item) => acc + item.product.price * item.quantity,
        0
      ),
    [cartItems]
  );
 
  const totalQuantity = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.quantity, 0),
    [cartItems]
  );
 
  if (loading) return <p className="text-center py-10">Loading cart...</p>;
 
  if (cartItems.length === 0)
    return (
      <p className="text-center py-10 text-gray-500">Your cart is empty.</p>
    );
 
  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Shopping Cart</h1>
 
      <div className="mb-6 flex justify-end">
        <Badge variant="secondary" className="text-lg px-4 py-2">
          {totalQuantity} item{totalQuantity !== 1 ? "s" : ""}
        </Badge>
      </div>
 
      <div className="space-y-6">
        {cartItems.map(({ id: cartId, product, quantity }) => (
          <div
            key={cartId}
            className="flex flex-col sm:flex-row items-center sm:items-start gap-4 border p-4 rounded-lg shadow-sm"
          >
            <img
              src={product.image_url}
              alt={product.name}
              className="w-28 h-28 object-cover rounded-lg"
            />
            <div className="flex-1 w-full">
              <h2 className="text-xl font-semibold">{product.name}</h2>
              <p className="text-orange-600 font-semibold mt-1">
                ₹{product.price}
              </p>
              <div className="flex items-center gap-4 mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    updateQuantity(cartId, product.id, quantity - 1)
                  }
                  disabled={quantity === 1}
                >
                  <Minus size={16} />
                </Button>
                <span className="font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    updateQuantity(cartId, product.id, quantity + 1)
                  }
                >
                  <Plus size={16} />
                </Button>
 
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 ml-auto"
                  onClick={() => handleRemove(cartId)}
                >
                  <Trash size={18} />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
 
      <div className="mt-10 flex justify-end items-center gap-8">
        <span className="text-xl font-semibold">
          Total:{" "}
          <span className="text-orange-600">₹{totalPrice.toFixed(2)}</span>
        </span>
        <Button
          size="lg"
          className="bg-orange-600 hover:bg-orange-700 text-white"
        >
          Proceed to Checkout
        </Button>
      </div>
    </main>
  );
}