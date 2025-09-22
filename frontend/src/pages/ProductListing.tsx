import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getProductsByCategory } from "@/lib/api";
import ProductCard from "@/components/product/ProductCard";
import type { Product } from "@/types";
import ProductDetailDialog from "@/pages/ProductDetails";
 
export default function ProductListing() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
   const [wishlist, setWishlist] = useState<Product[]>([]);
  const category = searchParams.get("category");
 
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
 
        const data = await getProductsByCategory(category || "all");
        setProducts(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
 
    fetchProducts();
  }, [category]);
 
  const handleAddToCart = (product: Product) => {
    console.log("Added to cart:", product);
    // Add to cart logic goes here
  };
   const handleToggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };
  const isWishlisted = (product: Product) =>
    wishlist.some((item) => item.id === product.id);
return (
  <div className="max-w-6xl mx-auto px-4 py-10">
    <h2 className="text-3xl font-bold text-orange-700 mb-8 capitalize">
      {category ? `${category} Items` : "All Food Items"}
    </h2>
 
    {loading && <p className="text-center text-gray-500">Loading...</p>}
    {error && <p className="text-center text-red-500">{error}</p>}
 
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
      {products.map((product) => (
  <ProductDetailDialog
    key={product.id}
    category={product.cuisine} // assumes your Product type has a `cuisine` field
    productName={product.name}
    triggerElement={
      <ProductCard
        product={product}
        onAddToCart={handleAddToCart}
        onToggleWishlist={handleToggleWishlist}
        isWishlisted={isWishlisted(product)}
      />
    }
  />
))}
    </div>
  </div>
);
}