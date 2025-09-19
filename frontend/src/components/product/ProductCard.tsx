import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Star } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import type { Product } from '@/types'


interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()

  const handleAdd = () => {
    addToCart(product, 1);
  }

  return (
    <Card className="w-full max-w-sm shadow-md hover:shadow-xl transition-shadow duration-200">
      <CardHeader className="p-0">
        <img
          src={product.image_url}
          alt={product.name}
          className="rounded-t-md w-full h-48 object-cover"
          loading="lazy"
        />
      </CardHeader>

      <CardContent className="p-4 space-y-2">
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="text-sm text-gray-600">{product.description?.slice(0, 60) ?? ''}</p>
        <div className="flex items-center justify-between pt-2">
          <div className="text-orange-600 font-bold text-lg">₹{product.price.toFixed(2)}</div>
          {product.rating && (
            <div className="flex items-center text-sm text-gray-700 gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-500" />
              {product.rating}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button onClick={handleAdd} className="w-full">
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  )
}
