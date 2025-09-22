import { useEffect, useState } from 'react';
import { getProductsByCategory } from '@/lib/api';
 
type Product = {
  id: string;
  name: string;
  image_url: string;
  price: number;
  rating: number;
  description: string;
  category: string;
  availability: boolean;
  stock: number;
};
 
export default function OurFood() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
 
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setLoading(true);
        const data = await getProductsByCategory('all'); // Use special 'all' case
        setProducts(data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch food items.');
      } finally {
        setLoading(false);
      }
    };
 
    fetchAllProducts();
  }, []);
 
  const handleAddToCart = (product: Product) => {
  console.log('Added to cart:', product);
  // TODO: Call context, redux, or backend cart API
};
 
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-4xl font-bold text-orange-700 mb-8 text-center">Our Food</h2>
 
      {loading && <p className="text-center text-gray-500">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
 
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {products.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition duration-300"
          >
            <img
              src={item.image_url}
              alt={item.name}
              className="w-full h-64 object-cover"
            />
            <div className="p-5">
              <h3 className="text-xl font-semibold text-gray-800">{item.name}</h3>
              <p className="text-sm text-gray-600 mt-2">{item.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-lg text-orange-600 font-semibold">₹{item.price}</span>
                <span className="text-sm text-yellow-500">⭐ {item.rating}</span>
              </div>
              <button
  onClick={() => handleAddToCart(item)}
  disabled={!item.availability || item.stock === 0}
  className={`mt-4 w-full ${
    item.availability && item.stock > 0
      ? 'bg-orange-600 hover:bg-orange-700'
      : 'bg-gray-300 cursor-not-allowed'
  } text-white text-sm font-medium py-2 rounded transition`}
>
  {item.availability && item.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
</button>
 
 
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}