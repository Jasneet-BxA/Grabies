import { useEffect, useState } from "react";

interface WishlistItem {
  id: string;
  name: string;
  image: string;
  price: number;
}

export default function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    // Fetch wishlist items from backend or localStorage
    // For demo, using dummy data:
    const dummyData = [
      {
        id: "1",
        name: "Delicious Pizza",
        image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=600&q=80",
        price: 12.99,
      },
      {
        id: "2",
        name: "Spicy Noodles",
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
        price: 9.99,
      },
    ];

    setWishlistItems(dummyData);
  }, []);

  if (wishlistItems.length === 0) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Your Wishlist</h1>
        <p>You have no items in your wishlist.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Your Wishlist</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {wishlistItems.map((item) => (
          <div key={item.id} className="border rounded-lg overflow-hidden shadow-sm">
            <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h2 className="text-xl font-semibold">{item.name}</h2>
              <p className="text-orange-600 font-bold">${item.price.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
