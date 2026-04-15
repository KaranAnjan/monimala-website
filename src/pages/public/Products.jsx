import { useState } from 'react'
import { useProducts } from '../../hooks/useProducts'
import { useCategories } from '../../hooks/useCategories'
import CategoryFilter from '../../components/public/CategoryFilter'
import ProductGrid from '../../components/public/ProductGrid'
import Loading from '../../components/common/Loading'
import { Search } from 'lucide-react'

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const { products, loading } = useProducts(selectedCategory)
  const { categories } = useCategories()

  const filteredProducts = products.filter((p) =>
    p.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.product_code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 animate-fade-in">All Products</h1>

      {/* Search */}
      <div className="relative mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search products by name or code..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 hover:border-purple-300 hover:shadow-md"
        />
      </div>

      {/* Category Filter */}
      <CategoryFilter
        categories={categories}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />

      {/* Products */}
      {loading ? <Loading /> : <ProductGrid products={filteredProducts} />}
    </div>
  )
}

export default Products