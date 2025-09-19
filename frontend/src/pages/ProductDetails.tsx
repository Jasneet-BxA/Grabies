import { useParams } from 'react-router'
import { useEffect, useState } from 'react'
import type{ Product } from '@/types'
import { Button } from '@/components/ui/button'
import { useCart } from '@/context/CartContext'
import axios from 'axios'

export default function ProductDetails() {
  const { id } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const { addToCart } = useCart()

//   useEffect(() => {
//     if (!id) return
//     axios.get(`/api/products/${id}`)
//       .then(res => setProduct(res.data))
//       .catch(err => console.error(err))
//   }, [id])

  if (!product) return <p className="text-center mt-10">Loading...</p>

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="grid md:grid-cols-2 gap-10 items-start">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full rounded-lg object-cover h-96"
        />

        <div>
          <h2 className="text-3xl font-bold mb-2">{product.name}</h2>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <p className="text-xl font-semibold text-orange-600 mb-2">₹{product.price.toFixed(2)}</p>

          {product.rating && (
            <p className="text-sm text-gray-500 mb-4">⭐ {product.rating} rating</p>
          )}

          <Button onClick={() => addToCart(product, 1)}>Add to Cart</Button>
        </div>
      </div>
    </div>
  )
}
