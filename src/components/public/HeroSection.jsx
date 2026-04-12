import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-56 h-56 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-56 h-56 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-24 md:py-40 relative z-10">
        <div className="text-center">
          {/* Main Heading */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Exquisite Jewellery &<br />
            <span className="text-yellow-200">Thoughtful Gifts</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-purple-100 mb-6 max-w-3xl mx-auto">
            Discover timeless elegance and perfect presents for every occasion
          </p>

          {/* Description */}
          <p className="text-lg md:text-xl text-purple-50 mb-12 max-w-2xl mx-auto">
            Premium Fashion Jewellery House - Bringing elegance to every moment
          </p>

          {/* CTA Button */}
          <Link
            to="/products"
            className="inline-flex items-center gap-3 bg-white text-purple-600 px-10 py-4 rounded-full font-bold text-xl hover:bg-yellow-200 transition-all duration-300 transform hover:shadow-2xl hover:-translate-y-1"
          >
            <span>Shop Now</span>
            <ArrowRight className="h-6 w-6" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default HeroSection