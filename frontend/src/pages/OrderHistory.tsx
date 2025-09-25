import { useEffect, useState } from "react";
import { getOrders } from "@/lib/api"; // Your backend API to fetch all orders
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react"; // Arrow icon for buttons

interface OrderItem {
  quantity: number;
  total_price: number;
  products: {
    name: string;
    price: number;
    image_url?: string;
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
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <h1 className="text-3xl font-bold text-center text-orange-700 mb-8">
        🧾 Your Order History
      </h1>

      {orders.length === 0 ? (
        <p className="text-center text-lg text-gray-500 py-16">
          No orders placed yet. Check back later!
        </p>
      ) : (
        orders.map((order) => (
          <div
            key={order.id}
            className="group space-y-4 bg-white rounded-lg shadow-md p-6 hover:bg-orange-100/50 hover:shadow-lg transition-all duration-300 ease-in-out"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <h2 className="text-xl font-medium text-gray-800">Order #{order.id}</h2>
                <Badge variant="outline" className="text-sm font-medium bg-orange-200">
                  {order.status}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">
                {new Date(order.created_at).toLocaleDateString()}
              </p>
            </div>

            <div className="space-y-3 mt-4">
              {order.order_items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-5 hover:bg-gray-50 p-3 rounded-md transition-colors duration-200">
                  {item.products.image_url && (
                    <img
                      src={item.products.image_url}
                      alt={item.products.name}
                      className="w-16 h-16 object-cover rounded-md shadow-sm"
                    />
                  )}
                  <div className="flex-1">
                    <p className="text-md font-medium text-gray-800">{item.products.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-md text-gray-600 font-semibold">₹{item.total_price}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mt-6 border-t pt-4">
              <p className="text-xl font-semibold text-gray-800">
                Total: <span className="text-orange-600">₹{order.total_price.toFixed(2)}</span>
              </p>
              <Button
                onClick={() => navigate(`/order/${order.id}`)}
                className="flex items-center gap-2 bg-orange-600 text-white hover:bg-orange-700 text-sm px-5 py-2 rounded-md"
              >
                View Details <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        ))
      )}
    </main>
  );
}
