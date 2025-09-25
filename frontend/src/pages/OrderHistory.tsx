import { useEffect, useState } from "react";
import { getOrders } from "@/lib/api"; // Your backend API to fetch all orders
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface OrderItem {
  quantity: number;
  total_price: number;
  products: {
    name: string;
    price: number;
    image_url?: string; // Optional for safety
  };
}

interface Order {
  id: string;
  total_price: number;
  status: string;
  created_at: string;
  order_items: OrderItem[];
}

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders(); 
        console.log(data);
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <main className="max-w-5xl mx-auto px-6 py-10 space-y-8">
      <h1 className="text-4xl font-bold text-center text-orange-600">🧾 Your Orders</h1>

      {orders.length === 0 ? (
        <p className="text-center py-10 text-gray-500">You have no orders yet.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="space-y-4 border p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-center">
              
              <Badge variant="secondary">{order.status}</Badge>
            </div>

            <div className="space-y-4 mt-4">
              {order.order_items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  {item.products.image_url && (
                    <img
                      src={item.products.image_url}
                      alt={item.products.name}
                      className="w-24 h-24 object-cover rounded-md"
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{item.products.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-orange-600 font-semibold">₹{item.total_price}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 text-lg font-semibold">
              Total: <span className="text-orange-600">₹{order.total_price.toFixed(2)}</span>
            </div>

            <Button
              onClick={() => navigate(`/order/${order.id}` )}
              className="mt-4 bg-blue-600 text-white hover:bg-blue-700"
            >
              View Order Details
            </Button>
          </div>
        ))
      )}
    </main>
  );
}
