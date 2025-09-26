import { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getCart,
  getUserAddress,
  createStripeCheckoutSession,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { MapPin, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import type { RawCartItem } from "@/types";

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

interface Address {
  id: string;
  address_line: string;
  city: string;
  state: string;
  pincode: string;
}

export default function OrderPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [address, setAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState(true);
  const [addressConfirmed, setAddressConfirmed] = useState(false);
  const { refreshCart } = useCart();

  const location = useLocation();
  const addressId = location.state?.addressId;
  const navigate = useNavigate();
  const handlePayByCOD = () => {
    navigate("/checkout", {
      state: {
        addressId,
        cartItems,
        totalPrice,
      },
    });
  };

  const passedAddress = location.state?.address;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cartData: RawCartItem[] = await getCart();
        const formattedCart = cartData.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          product: {
            id: item.products.id,
            name: item.products.name,
            image_url: item.products.image_url,
            price: item.products.price,
          },
        }));
        setCartItems(formattedCart);

        if (passedAddress) {
          setAddress(passedAddress);
        } else {
          const addresses = await getUserAddress();
          if (addresses.length > 0) {
            setAddress(addresses[0]);
          }
        }
      } catch (err) {
        console.error("Error loading order data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [passedAddress]);

  const totalPrice = useMemo(() => {
    return cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  }, [cartItems]);

  const handleConfirmAddress = () => {
    if (!address) {
      alert("Please add a delivery address in your profile first.");
      return;
    }
    setAddressConfirmed(true);
  };

  const handleProceedToPay = async () => {
    if (!address) {
      alert("No address found. Cannot proceed to payment.");
      return;
    }
    try {
      const res = await createStripeCheckoutSession(address.id);
      await refreshCart();
      window.location.href = res.data.url;
    } catch (err) {
      console.error("Error redirecting to Stripe Checkout:", err);
      alert("Failed to start payment session. Try again later.");
    }
  };

  if (loading) {
    return (
      <p className="text-center py-20 text-gray-500">
        Loading your order details...
      </p>
    );
  }

  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center text-orange-700">
        🧾 Order Summary
      </h1>

      <section className="mb-8 bg-white shadow rounded-lg p-6 border border-orange-100">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="text-orange-600" size={22} />
          <h2 className="text-xl font-semibold text-gray-800">
            Delivery Address
          </h2>
        </div>

        {address ? (
          <div className="text-gray-700 space-y-1">
            <p>{address.address_line}</p>
            <p>
              {address.city}, {address.state} - {address.pincode}
            </p>

            {!addressConfirmed ? (
              <Button
                className="mt-4 bg-orange-600 hover:bg-orange-700 text-white"
                onClick={handleConfirmAddress}
              >
                Confirm Address
              </Button>
            ) : (
              <p className="mt-2 text-green-600 font-medium">
                ✅ Address confirmed
              </p>
            )}
          </div>
        ) : (
          <p className="text-red-600">No address found. Please add one.</p>
        )}
      </section>

      <section className="mb-8 bg-white shadow rounded-lg p-6 border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <ShoppingBag className="text-orange-500" size={22} />
          <h2 className="text-xl font-semibold text-gray-800">
            Items in Your Cart
          </h2>
        </div>

        <div className="divide-y divide-gray-200">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="py-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.product.image_url}
                  alt={item.product.name}
                  className="w-14 h-14 rounded-full object-cover border border-gray-200 shadow-sm"
                />
                <div>
                  <p className="font-medium text-gray-800">
                    {item.product.name}
                  </p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
              </div>

              <p className="text-orange-600 font-semibold whitespace-nowrap">
                ₹{item.product.price * item.quantity}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col sm:flex-row justify-between items-center border-t pt-6">
        <p className="text-xl font-bold text-gray-800 mb-4 sm:mb-0">
          Total Amount:{" "}
          <span className="text-orange-600">₹{totalPrice.toFixed(2)}</span>
        </p>

        {addressConfirmed && (
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <Button
              onClick={handleProceedToPay}
              className="bg-orange-600 hover:bg-orange-700 text-white text-lg"
            >
              Pay Online (Stripe)
            </Button>

            <Button
              onClick={handlePayByCOD}
              variant="outline"
              className="text-orange-700 border-orange-600 hover:bg-orange-50"
            >
              Pay by COD
            </Button>
          </div>
        )}
      </section>
    </main>
  );
}
