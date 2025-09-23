import { useLocation } from "react-router-dom";
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CreditCard, Wallet, DollarSign } from "lucide-react"; // icon imports

export default function CheckoutPage() {
  const location = useLocation();
  const { cartItems = [], address = {}, totalPrice = 0 } = location.state || {};
  const [email, setEmail] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [saveInfo, setSaveInfo] = useState(false);

  const handlePayment = () => {
    // payment logic
    console.log("Proceeding to payment", {
      email,
      paymentMethod,
      saveInfo,
    });
    alert("Payment initiated! 🍽️");
  };

  return (
    <main className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Left: Order Summary */}
      <section className="bg-white p-6 shadow-lg rounded-lg border">
        <h2 className="text-2xl font-semibold text-orange-600 mb-6">🧾 Order Summary</h2>
        <div className="space-y-4">
          {cartItems.map((item: any) => (
            <div key={item.id} className="flex items-center gap-4 border-b pb-4 last:border-none">
              <img
                src={item.product.image_url}
                alt={item.product.name}
                className="w-14 h-14 rounded-full object-cover border"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-800">{item.product.name}</p>
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
              </div>
              <p className="text-orange-600 font-semibold whitespace-nowrap">
                ₹{item.product.price * item.quantity}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 text-lg font-bold text-right">
          Total: <span className="text-orange-600">₹{totalPrice.toFixed(2)}</span>
        </div>
      </section>

      {/* Right: Checkout Form */}
      <section className="bg-white p-6 shadow-lg rounded-lg border space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Checkout Details
        </h2>

        {/* Email Input */}
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

        {/* Payment Method */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Payment Method</p>
          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-2">
  <label
    htmlFor="card"
    className="flex items-center gap-3 p-3 border rounded-md cursor-pointer transition-all duration-200 peer-checked:border-orange-600 hover:bg-orange-50"
  >
    <RadioGroupItem
      value="card"
      id="card"
      className="peer hidden"
    />
    <CreditCard className="text-orange-600" size={18} />
    <span className="text-sm text-gray-800 font-medium">Credit / Debit Card</span>
  </label>

  <label
    htmlFor="wallet"
    className="flex items-center gap-3 p-3 border rounded-md cursor-pointer transition-all duration-200 peer-checked:border-orange-600 hover:bg-orange-50"
  >
    <RadioGroupItem
      value="wallet"
      id="wallet"
      className="peer hidden"
    />
    <Wallet className="text-orange-600" size={18} />
    <span className="text-sm text-gray-800 font-medium">Cash App / Wallet</span>
  </label>

  <label
    htmlFor="cod"
    className="flex items-center gap-3 p-3 border rounded-md cursor-pointer transition-all duration-200 peer-checked:border-orange-600 hover:bg-orange-50"
  >
    <RadioGroupItem
      value="cod"
      id="cod"
      className="peer hidden"
    />
    <DollarSign className="text-orange-600" size={18} />
    <span className="text-sm text-gray-800 font-medium">Cash on Delivery (COD)</span>
  </label>
</RadioGroup>

        </div>

        {/* Save Info Checkbox */}
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

        {/* Pay Button */}
        <Button
          className="w-full bg-orange-600 hover:bg-orange-700 text-white text-lg py-3 mt-4 transition"
          onClick={handlePayment}
        >
          Pay and enjoy the bite 🍽️
        </Button>

        {/* Footer */}
        <div className="text-xs text-gray-500 text-center mt-6 border-t pt-4">
          Powered by Stripe |{" "}
          <span className="underline cursor-pointer">Teams Privacy</span>
        </div>
      </section>
    </main>
  );
}
