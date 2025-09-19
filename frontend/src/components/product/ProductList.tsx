import { useEffect, useState } from 'react'
import axios from 'axios'
import ProductCard from './ProductCard'
import type { Product } from '../../types'

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    axios.get('/api/products') // replace with your actual backend
      .then(res => setProducts(res.data))
      .catch(err => console.error(err))
  }, [])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
