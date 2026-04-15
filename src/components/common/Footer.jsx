import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-purple-700 via-purple-600 to-purple-800 text-white pt-20 pb-10 mt-20">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* About Section */}
          <div>
            <h3 className="text-3xl font-bold mb-5">Monimala</h3>
            <p className="text-purple-100 mb-4 text-lg">Fashion Jewellery House</p>
            <p className="text-purple-200 text-base leading-relaxed">
              Bringing timeless elegance and thoughtful gifts to every occasion. Premium quality jewellery and curated gift collections.
            </p>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-2xl font-bold mb-6">Contact Us</h3>
            <div className="space-y-4 text-purple-100">
              <div className="flex items-center gap-3 hover:translate-x-1 transition-transform duration-300 cursor-pointer group">
                <Phone className="h-6 w-6 text-yellow-300 group-hover:scale-125 transition-transform" />
                <span className="text-lg group-hover:text-yellow-300 transition-colors">+91 7407437378</span>
              </div>
              <div className="flex items-center gap-3 hover:translate-x-1 transition-transform duration-300 cursor-pointer group">
                <Mail className="h-6 w-6 text-yellow-300 group-hover:scale-125 transition-transform" />
                <span className="text-lg group-hover:text-yellow-300 transition-colors">info@monimala.com</span>
              </div>
              <div className="flex items-center gap-3 hover:translate-x-1 transition-transform duration-300 cursor-pointer group">
                <MapPin className="h-6 w-6 text-yellow-300 group-hover:scale-125 transition-transform" />
                <span className="text-lg group-hover:text-yellow-300 transition-colors">India</span>
              </div>
            </div>
          </div>

          {/* Categories Section */}
          <div>
            <h3 className="text-2xl font-bold mb-6">Categories</h3>
            <ul className="space-y-3 text-purple-100">
              <li className="hover:text-yellow-300 hover:translate-x-1 transition-all duration-300 cursor-pointer text-lg transform">💎 Fashion Jewellery</li>
              <li className="hover:text-yellow-300 hover:translate-x-1 transition-all duration-300 cursor-pointer text-lg transform">🎁 Gift Collections</li>
              <li className="hover:text-yellow-300 hover:translate-x-1 transition-all duration-300 cursor-pointer text-lg transform">💄 Cosmetics & Beauty</li>
              <li className="hover:text-yellow-300 hover:translate-x-1 transition-all duration-300 cursor-pointer text-lg transform">✨ Special Occasions</li>
            </ul>
          </div>

          {/* Social Section */}
          <div>
            <h3 className="text-2xl font-bold mb-6">Follow Us</h3>
            <div className="flex gap-6 mb-6">
              <a href="#" className="bg-purple-500 hover:bg-yellow-300 p-4 rounded-full transition-all duration-300 transform hover:scale-125 hover:-translate-y-1 group">
                <Facebook className="h-6 w-6 text-white group-hover:text-purple-600" />
              </a>
              <a href="#" className="bg-purple-500 hover:bg-yellow-300 p-4 rounded-full transition-all duration-300 transform hover:scale-125 hover:-translate-y-1 group">
                <Instagram className="h-6 w-6 text-white group-hover:text-purple-600" />
              </a>
              <a href="#" className="bg-purple-500 hover:bg-yellow-300 p-4 rounded-full transition-all duration-300 transform hover:scale-125 hover:-translate-y-1 group">
                <Twitter className="h-6 w-6 text-white group-hover:text-purple-600" />
              </a>
            </div>
            <p className="text-purple-200 text-base">Connect with us on social media</p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-purple-500 py-8">
          {/* Copyright */}
          <div className="text-center">
            <p className="text-purple-100 text-base">
              &copy; 2024 Monimala Fashion Jewellery House. All rights reserved.
            </p>
            <p className="text-purple-200 text-sm mt-3">
              Crafting elegance, one piece at a time | Premium Quality Guaranteed
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer