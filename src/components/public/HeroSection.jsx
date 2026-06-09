import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'
import Carousel3D from './Carousel3D'

const HeroSection = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase
        .from('products')
        .select('*, categories(category_name)')
        .order('created_at', { ascending: false })
        .limit(10)
      if (data) setProducts(data)
      setLoading(false)
    }
    fetchProducts()
  }, [])

  return (
    <section className="bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/40 via-purple-800/20 to-black/60"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-4 md:py-6">
        <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-8">
          {/* Left: Text + Buttons */}
          <div className="w-full lg:w-5/12 text-center lg:text-left space-y-4">
            <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1 text-[10px] font-medium">
              <Sparkles className="h-3 w-3 text-yellow-300" />
              Premium Fashion Jewellery House
            </div>

            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold leading-snug">
              Exquisite Jewellery &{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-400">
                Thoughtful Gifts
              </span>
            </h1>

            <p className="text-sm text-purple-100/70 leading-relaxed max-w-md">
              Discover timeless elegance and perfect presents for every occasion.
            </p>

            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 bg-white text-purple-700 px-6 py-3 rounded-full font-semibold text-sm hover:bg-yellow-200 transition-all duration-300 transform hover:shadow-2xl hover:scale-105 active:scale-95 group"
              >
                <span>Explore Collection</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform duration-300" />
              </Link>
              <Link
                to="/products?category=gifts"
                className="inline-flex items-center gap-2 border border-white/30 text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-white/10 transition-all duration-300 transform hover:scale-105 active:scale-95"
              >
                Gift Ideas
              </Link>
            </div>
          </div>

          {/* Right: Carousel */}
          <div className="w-full lg:w-7/12">
            {!loading && <Carousel3D products={products} />}
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
