// components/product/ProductCard.tsx
import { FaHeart, FaRegHeart } from "react-icons/fa";
import type { Product } from "@/types";
 
type Props = {
  product: Product;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
};
 
export default function ProductCard({
  product,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
}: Props) {
  return (
<div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
      {/* Product Image */}
<img
        src={product.image_url}
        alt={product.name}
        className="w-full h-64 object-cover"
      />
 
      <div className="p-5">
        {/* Title + Wishlist Icon */}
<div className="flex justify-between items-center">
<h3 className="text-xl font-semibold text-gray-800">
            {product.name}
</h3>
<button
            onClick={(e) => {e.stopPropagation(), onToggleWishlist(product)}}
            className="text-xl text-red-500"
            title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
>
            {isWishlisted ? <FaHeart /> : <FaRegHeart />}
</button>
</div>
 
        {/* Description */}
<p className="text-sm text-gray-600 mt-2">{product.description}</p>
 
        {/* Price and Rating */}
<div className="mt-4 flex items-center justify-between">
<span className="text-lg text-orange-600 font-semibold">
            ₹{product.price}
</span>
<span className="text-sm text-yellow-500">⭐ {product.rating}</span>
</div>
 
        {/* Add to Cart Button */}

<button
          onClick={(e) => {e.stopPropagation(), onAddToCart(product)}}
          disabled={!product.availability || (product.stock ?? 0) === 0}
          className={`mt-4 w-full ${
            product.availability && (product.stock ?? 0) > 0
              ? "bg-orange-600 hover:bg-orange-700"
              : "bg-gray-300 cursor-not-allowed"
          } text-white text-sm font-medium py-2 rounded transition`}
>
          {product.availability && (product.stock ?? 0) > 0
            ? "Add to Cart"
            : "Out of Stock"}
</button>
</div>
</div>
  );
}