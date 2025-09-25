import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DollarSign } from "lucide-react";
import { createOrder } from "@/lib/api"; // Your backend API

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { addressId } = location.state || {}; // Assuming addressId is passed via state

  const [email, setEmail] = useState("");
  const [saveInfo, setSaveInfo] = useState(false);

  const handlePayment = async () => {
    if (!addressId) {
      alert("No address selected. Please go back and choose one.");
      return;
    }

    try {
      // Place the order and receive the response (which includes orderId)
      const res = await createOrder(addressId);
      console.log(res);

      // Inform the user of successful order placement
      const confirmed = window.confirm(
        "Your COD order has been placed successfully! 🛵💸\n\nClick OK to view your orders."
      );

      if (confirmed) {
        // Navigate to the order history page and pass orderId
        navigate("/orderhistory", {
          state: {
            orderId: res.orderId, // Assuming this is returned by the API
          },
        });
      }
    } catch (error) {
      console.error("Order placement failed:", error);
      alert("Failed to place order. Please try again.");
    }
  };

  return (
    <main className="max-w-2xl mx-auto px-6 py-10 space-y-6">
      <h2 className="text-2xl font-semibold text-orange-600 mb-4">
        Cash on Delivery (COD)
      </h2>

      {/* Email */}
      <div className="space-y-1">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
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

      {/* COD Info */}
      <div className="flex items-center gap-3 bg-orange-50 border border-orange-200 rounded-md p-4">
        <DollarSign className="text-orange-600" />
        <p className="text-sm text-gray-700 font-medium">
          You’ll pay in cash when your order is delivered.
        </p>
      </div>

      {/* Save Info */}
      <div className="flex items-center gap-2 p-2 hover:bg-orange-50 rounded-md transition">
        <Checkbox
          id="save-info"
          checked={saveInfo}
          onCheckedChange={(checked: boolean) => setSaveInfo(checked)}
          className="data-[state=checked]:bg-orange-600 data-[state=checked]:border-orange-600 transition"
        />
        <label htmlFor="save-info" className="text-sm text-gray-800 cursor-pointer">
          Save my info for faster checkout
        </label>
      </div>

      {/* Place Order */}
      <Button
        className="w-full bg-orange-600 hover:bg-orange-700 text-white text-lg py-3 mt-4 transition"
        onClick={handlePayment}
      >
        Place COD Order 🛵
      </Button>

      {/* Footer */}
      <div className="text-xs text-gray-500 text-center mt-6 border-t pt-4">
        Powered by COD | <span className="underline cursor-pointer">Privacy Policy</span>
      </div>
    </main>
  );
}
