import { Link } from 'react-router-dom'
import { ShoppingCart, Menu, X } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useState } from 'react'
import logo from '../../assets/logo.png'

const Navbar = () => {
  const { cart } = useCart()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity flex-shrink-0">
            <img 
              src={logo}
              alt="Monimala Logo" 
              className="h-14 w-14 object-contain"
            />
            <div className="hidden sm:block">
              <h1 className="text-2xl font-bold text-purple-700">Monimala</h1>
              <p className="text-sm text-gray-500">Fashion Jewellery</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-gray-700 hover:text-purple-600 font-semibold text-lg">
              Home
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-purple-600 font-semibold text-lg">
              Products
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-6">
            {/* Cart Icon */}
            <Link to="/cart" className="relative text-gray-700 hover:text-purple-600 hidden sm:block">
              <ShoppingCart className="h-7 w-7" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Admin Button */}
            <Link
              to="/admin"
              className="hidden md:block bg-purple-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors text-lg"
            >
              Admin
            </Link>

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
            <Link to="/" className="block px-4 py-3 text-gray-700 hover:bg-gray-100 rounded font-medium text-lg">Home</Link>
            <Link to="/products" className="block px-4 py-3 text-gray-700 hover:bg-gray-100 rounded font-medium text-lg">Products</Link>
            <Link to="/cart" className="block px-4 py-3 text-gray-700 hover:bg-gray-100 rounded flex items-center gap-2 font-medium text-lg">
              <ShoppingCart className="h-5 w-5" />
              Cart {cartCount > 0 && `(${cartCount})`}
            </Link>
            <Link to="/admin" className="block px-4 py-3 text-gray-700 hover:bg-gray-100 rounded font-medium text-lg">Admin</Link>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar