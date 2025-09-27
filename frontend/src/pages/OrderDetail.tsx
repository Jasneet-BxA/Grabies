import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderById } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { FaArrowLeft } from "react-icons/fa";
import {OrderItem} from "@/types/index";
import {Order} from "@/types/index";

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await getOrderById(id);
        setOrder(data);
      } catch (err: unknown) {
        console.error("Error fetching order:", err);

        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to load order details.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <main className="max-w-4xl mx-auto px-6 py-10 space-y-6">
        <Skeleton className="h-12 w-1/3 bg-gray-200" />
        <Skeleton className="h-8 w-1/4 bg-gray-200" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="w-24 h-24 rounded-md bg-gray-200" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4 bg-gray-200" />
                <Skeleton className="h-4 w-1/2 bg-gray-200" />
              </div>
              <Skeleton className="h-6 w-20 bg-gray-200" />
            </div>
          ))}
        </div>
      </main>
    );
  }

  if (error) {
    return <div className="text-center text-red-600 mt-20">{error}</div>;
  }

  if (!order) {
    return (
      <div className="text-center text-gray-500 mt-20">No order found.</div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-10 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-extrabold text-orange-600">
          🧾 Order #{order.id}
        </h1>
        {/* <Badge className="text-sm px-3 py-1 rounded-full bg-gray-100 text-gray-800 capitalize bg-orange-100/50">
          {order.status}
        </Badge> */}
      </div>

      <div className="space-y-6 mt-6 ">
        {order.order_items.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-4 p-6 rounded-lg shadow-xl bg-white hover:shadow-2xl transition-all duration-300 ease-in-out hover:bg-orange-100/50"
          >
            {item.products.image_url && (
              <img
                src={item.products.image_url}
                alt={item.products.name}
                className="w-24 h-24 object-cover rounded-md shadow-md "
              />
            )}
            <div className="flex-1 space-y-2 ">
              <p className="font-semibold text-gray-800 text-lg">
                {item.products.name}
              </p>
              <p className="text-sm text-gray-600">
                Price: ₹{item.products.price}
              </p>
              <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
            </div>
            <p className="text-lg text-orange-600 font-semibold">
              ₹{item.total_price.toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-6 border-t pt-4">
        <p className="text-xl font-bold text-gray-700">
          Total:{" "}
          <span className="text-orange-600">
            ₹{order.total_price.toFixed(2)}
          </span>
        </p>
      </div>

      <div className="mt-6 flex justify-between items-center">
        <button
          className="flex items-center space-x-2 px-4 py-2 rounded-md bg-orange-600 text-white font-semibold text-sm hover:bg-orange-700 transition-all"
          onClick={() => navigate("/order")}
        >
          <FaArrowLeft className="text-white" />
          <span>Back to Orders</span>
        </button>
      </div>
    </main>
  );
}
