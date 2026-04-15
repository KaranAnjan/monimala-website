import { useProducts } from '../../hooks/useProducts'
import { useCategories } from '../../hooks/useCategories'
import HeroSection from '../../components/public/HeroSection'
import ProductGrid from '../../components/public/ProductGrid'
import Loading from '../../components/common/Loading'
import { useState } from 'react'

const Home = () => {
  const { products, loading } = useProducts()
  const { categories } = useCategories()
  const [selectedCategory, setSelectedCategory] = useState(null)

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category_id === selectedCategory)
    : products.slice(0, 8)

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Products with Categories Sidebar */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Categories Sidebar - Left */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Shop by Category</h3>
              <div className="space-y-3">
                {/* All Products Button */}
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full p-4 rounded-lg text-left font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                    selectedCategory === null
                      ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg scale-105 animate-pulse'
                      : 'bg-white border-2 border-gray-200 text-gray-900 hover:border-purple-300 hover:shadow-md'
                  }`}
                >
                  ✨ All Products
                </button>

                {/* Category Buttons */}
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                    className={`w-full p-4 rounded-lg text-left font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                      selectedCategory === cat.id
                        ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg scale-105 animate-pulse'
                        : 'bg-white border-2 border-gray-200 text-gray-900 hover:border-purple-300 hover:shadow-md'
                    }`}
                  >
                    {cat.category === 'jewellery' ? '💎' : cat.category === 'gifts' ? '🎁' : '💄'} {cat.category_name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Featured Products - Right */}
          <div className="lg:col-span-3">
            <div className="mb-8">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">Featured Products</h2>
              <p className="text-xl text-gray-600">Discover our latest collections</p>
            </div>

            {loading ? (
              <Loading />
            ) : (
              <ProductGrid products={filteredProducts} />
            )}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-16">Why Choose Monimala?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { icon: '✨', title: 'Premium Quality', desc: 'Handpicked items with finest craftsmanship' },
            { icon: '🚚', title: 'Fast Delivery', desc: 'Quick and reliable shipping nationwide' },
            { icon: '🛡️', title: 'Authentic Products', desc: '100% genuine items guaranteed' }
          ].map((item, i) => (
            <div key={i} className="bg-white p-10 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 text-center border border-gray-100 transform hover:scale-105 hover:-translate-y-2 group cursor-pointer">
              <div className="text-8xl mb-6 group-hover:scale-125 transition-transform duration-300 inline-block">{item.icon}</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors">{item.title}</h3>
              <p className="text-lg text-gray-600 group-hover:text-gray-800 transition-colors">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home