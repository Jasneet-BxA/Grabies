import { useEffect, useState } from "react";
import ProductCard from "@/components/product/ProductCard";
import { getAllProducts } from "@/lib/api";
import type { Product } from "@/types";
import ExploreMoreFood from "@/components/product/ExploreMoreFood";
import ProductDetailDialog from "@/pages/ProductDetails"; // ✅ Make sure this import exists
 
export default function OurFood() {
  const [products, setProducts] = useState<Product[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
 
  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllProducts(21,0);
      setProducts(data);
    };
    fetchData();
  }, []);
 
  const handleAddToCart = (product: Product) => {
    console.log("Add to cart:", product);
  };
 
  const handleToggleWishlist = (product: Product) => {
    const exists = wishlist.some((item) => item.id === product.id);
    if (exists) {
      setWishlist((prev) => prev.filter((item) => item.id !== product.id));
    } else {
      setWishlist((prev) => [...prev, product]);
    }
  };
 
  return (
    <>
      <ExploreMoreFood />
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold text-orange-700 mb-8 text-center">
          Flavors That Flirt with Your Senses!
        </h2>
 
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {products.map((product) => (
            <ProductDetailDialog
              key={product.id}
              category={product.cuisine}
              productName={product.name}
              triggerElement={
                <ProductCard
                  product={product}
                  onAddToCart={handleAddToCart}
                  onToggleWishlist={handleToggleWishlist}
                  isWishlisted={wishlist.some((item) => item.id === product.id)}
                />
              }
            />
          ))}
        </div>
      </div>
    </>
  );
}