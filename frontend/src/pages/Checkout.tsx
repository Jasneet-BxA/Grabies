import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DollarSign } from "lucide-react";
import { createOrder } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { addressId } = location.state || {};
  const { refreshCart } = useCart();

  const [email, setEmail] = useState("");
  const [saveInfo, setSaveInfo] = useState(false);

  const handlePayment = async () => {
    if (!addressId) {
      alert("No address selected. Please go back and choose one.");
      return;
    }

    try {
      const res = await createOrder(addressId);
      await refreshCart();
      console.log(res);

      toast.success("Your COD order has been placed successfully! 🛵💸");

      setTimeout(() => {
        navigate("/orderhistory", {
          state: {
            orderId: res.orderId,
          },
        });
      }, 3000);
    } catch (error) {
      console.error("Order placement failed:", error);
      toast.error("Failed to place order. Please try again.");
    }
  };

  return (
    <main className="max-w-2xl mx-auto px-6 py-10 space-y-6">
      <h2 className="text-2xl font-semibold text-orange-600 mb-4">
        Cash on Delivery (COD)
      </h2>

      <div className="space-y-1">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email Address
        </label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border-gray-300 focus:ring-orange-500"
        />
      </div>

      <div className="flex items-center gap-3 bg-orange-50 border border-orange-200 rounded-md p-4">
        <DollarSign className="text-orange-600" />
        <p className="text-sm text-gray-700 font-medium">
          You’ll pay in cash when your order is delivered.
        </p>
      </div>

      <div className="flex items-center gap-2 p-2 hover:bg-orange-50 rounded-md transition">
        <Checkbox
          id="save-info"
          checked={saveInfo}
          onCheckedChange={(checked: boolean) => setSaveInfo(checked)}
          className="data-[state=checked]:bg-orange-600 data-[state=checked]:border-orange-600 transition"
        />
        <label
          htmlFor="save-info"
          className="text-sm text-gray-800 cursor-pointer"
        >
          Save my info for faster checkout
        </label>
      </div>

      <Button
        className="w-full bg-orange-600 hover:bg-orange-700 text-white text-lg py-3 mt-4 transition"
        onClick={handlePayment}
        disabled={!email}
      >
        Place COD Order
      </Button>

      <div className="text-xs text-gray-500 text-center mt-6 border-t pt-4">
        Powered by COD |{" "}
        <span className="underline cursor-pointer">Privacy Policy</span>
      </div>
    </main>
  );
}
