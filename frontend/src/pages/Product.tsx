import { useEffect, useState } from 'react'
import ProductCard from '@/components/product/ProductCard'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'
import type { Product } from '@/types'
// import axios from 'axios'

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

//   useEffect(() => {
// //     axios.get('/api/products').then(res => {
// //       setProducts(res.data)
// //       setLoading(false)
// //     }).catch(() => {
// //       setLoading(false)
// //     })
// //   }, [])

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="px-4 py-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Explore Dishes</h1>
        <Input
          type="text"
          placeholder="Search food..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin h-6 w-6 text-muted" />
        </div>
      ) : ( */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.length > 0 ? (
            filtered.map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p className="text-center col-span-full">No products found</p>
          )
          }
        </div>
      {/* )} */}
    </div>
  )
}
