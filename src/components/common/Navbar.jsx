import { Link, useLocation } from 'react-router-dom'
import { ShoppingCart, Menu, X, ChevronDown } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { useState } from 'react'
import logo from '../../assets/logo.png'

const Navbar = () => {
  const { cart } = useCart()
  const { isAdmin } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false)
  const location = useLocation()
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const categories = [
    { name: '💎 Fashion Jewellery', slug: 'jwellery' },
    { name: '🎁 Gift Collections', slug: 'gifts' },
    { name: '💄 Cosmetics & Beauty', slug: 'cosmetics' },
    { name: '✨ Special Occasions', slug: 'special-occasions' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center gap-2 md:gap-3 hover:opacity-90 transition-all duration-300 flex-shrink-0 group">
            <img 
              src={logo}
              alt="Monimala Logo" 
              className="h-12 md:h-14 w-12 md:w-14 object-contain group-hover:scale-110 transition-transform duration-300"
            />
            <div className="block">
              <h1 className="text-xs md:text-2xl font-bold text-purple-700 group-hover:text-purple-600 transition-colors duration-300 leading-tight">Monimala</h1>
              <p className="text-[10px] md:text-sm text-gray-500 leading-tight">Fashion Jewellery</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <Link 
              to="/" 
              className={`px-4 py-2 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
                isActive('/') 
                  ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg scale-105' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Home
            </Link>
            
            {/* Products Dropdown */}
            <div className="relative group">
              <button
                className={`px-4 py-2 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2 ${
                  isActive('/products') 
                    ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg scale-105' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Products
                <ChevronDown className="h-4 w-4 group-hover:rotate-180 transition-transform" />
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute left-0 mt-0 w-56 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-40">
                <Link
                  to="/products"
                  className="block px-4 py-3 text-gray-700 hover:bg-purple-50 font-medium first:rounded-t-lg border-b border-gray-100"
                >
                  All Products
                </Link>
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    to={`/products?category=${cat.slug}`}
                    className="block px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-all duration-200 border-b border-gray-100 last:border-b-0 last:rounded-b-lg"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-6">
            {/* Cart Icon */}
            <Link to="/cart" className="relative text-gray-700 hover:text-purple-600 hidden sm:block group transition-all duration-300">
              <ShoppingCart className="h-7 w-7 group-hover:scale-125 transition-transform duration-300" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Admin Button - Only visible to admin users */}
            {isAdmin && (
              <Link
                to="/admin"
                className={`hidden md:block px-5 py-2 rounded-lg font-semibold transition-all duration-300 text-lg transform hover:scale-105 ${
                  isActive('/admin')
                    ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                Admin
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-700 hover:text-purple-600"
            >
              {mobileMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-white pb-4">
            <Link 
              to="/" 
              className={`block px-4 py-3 rounded font-medium text-lg transition-all duration-300 margin-2 ${
                isActive('/') 
                  ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg mx-3 rounded-lg' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/products" 
              className={`block px-4 py-3 rounded font-medium text-lg transition-all duration-300 margin-2 ${
                isActive('/products') 
                  ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg mx-3 rounded-lg' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Products
            </Link>
            <Link 
              to="/cart" 
              className={`block px-4 py-3 rounded font-medium text-lg transition-all duration-300 flex items-center gap-2 margin-2 ${
                isActive('/cart') 
                  ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg mx-3 rounded-lg' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <ShoppingCart className="h-5 w-5" />
              Cart {cartCount > 0 && `(${cartCount})`}
            </Link>
            <Link 
              to="/admin" 
              className={`block px-4 py-3 rounded font-medium text-lg transition-all duration-300 margin-2 ${
                isActive('/admin') 
                  ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg mx-3 rounded-lg' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setMobileMenuOpen(false)}
              style={{ display: isAdmin ? 'block' : 'none' }}
            >
              Admin
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar