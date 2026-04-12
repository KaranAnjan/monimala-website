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
    <div className="bg-gradient-to-br from-purple-50 via-white to-pink-50 min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">Featured Products</h2>
          <p className="text-xl text-gray-600">Discover our latest collections</p>
        </div>

        {loading ? (
          <Loading />
        ) : (
          <ProductGrid products={filteredProducts} />
        )}
      </section>

      {/* Categories Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12">Shop by Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                className={`p-8 rounded-xl text-center font-bold text-2xl transition-all duration-300 transform hover:shadow-xl hover:-translate-y-1 ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {cat.category === 'jewellery' ? '💎' : cat.category === 'gifts' ? '🎁' : '💄'}{' '}
                {cat.category_name}
              </button>
            ))}
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
            <div key={i} className="bg-white p-10 rounded-xl shadow-lg hover:shadow-2xl transition-shadow text-center border border-gray-100">
              <div className="text-8xl mb-6">{item.icon}</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h3>
              <p className="text-lg text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home