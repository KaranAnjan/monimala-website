import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ShoppingCart, Menu, X, User, Search } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { useCategories } from '../../hooks/useCategories'
import { supabase, getImageUrl } from '../../lib/supabaseClient'
import { useState, useEffect, useRef } from 'react'
import { toSlug, formatName } from '../../lib/utils'
import logo from '../../assets/logo_white.png'

const Navbar = () => {
  const { cart } = useCart()
  const { user, isAdmin } = useAuth()
  const { categories } = useCategories()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const location = useLocation()
  const navigate = useNavigate()
  const [searchResults, setSearchResults] = useState([])
  const [searching, setSearching] = useState(false)
  const searchRef = useRef(null)
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  useEffect(() => {
    setMobileMenuOpen(false)
    setMobileSearchOpen(false)
    setSearchResults([])
  }, [location.pathname, location.search])

  useEffect(() => {
    if (!searchQuery.trim() || !mobileSearchOpen) {
      setSearchResults([])
      return
    }
    const timer = setTimeout(async () => {
      setSearching(true)
      const q = searchQuery.trim().toLowerCase()
      const { data } = await supabase
        .from('products')
        .select('id, product_name, product_code, price, mrp, image_url')
        .or(`product_name.ilike.%${q}%,product_code.ilike.%${q}%`)
        .limit(6)
      setSearchResults(data || [])
      setSearching(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery, mobileSearchOpen])

  useEffect(() => {
    const handleClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchResults([])
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setSearchResults([])
    }
  }

  const isActive = (path) => location.pathname === path
  const pathPart = location.pathname.match(/^\/category\/(.+)/)?.[1]
  const curCategory = pathPart || new URLSearchParams(location.search).get('category')
  const isProductsPage = location.pathname === '/products' || !!pathPart

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-purple-700 via-purple-600 to-purple-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 md:gap-3 hover:opacity-90 transition-all duration-300 flex-shrink-0 group">
            <img
              src={logo}
              alt="Monimala Logo"
              className="h-12 md:h-14 w-12 md:w-14 object-contain group-hover:scale-110 transition-transform duration-300"
            />
            <div className="block">
              <h1 className="text-xs md:text-2xl font-bold text-white group-hover:text-yellow-200 transition-colors duration-300 leading-tight">Monimala</h1>
              <p className="text-[10px] md:text-sm text-purple-200 leading-tight">Fashion Jewellery</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all duration-300 transform hover:scale-105 ${
                isActive('/')
                  ? 'bg-white text-purple-700 shadow-lg scale-105'
                  : 'text-purple-100 hover:bg-white/10'
              }`}
            >
              Home
            </Link>

            <Link
              to="/products"
              className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all duration-300 transform hover:scale-105 ${
                isProductsPage && !curCategory
                  ? 'bg-white text-purple-700 shadow-lg scale-105'
                  : 'text-purple-100 hover:bg-white/10'
              }`}
            >
              All Products
            </Link>

            {categories.map((cat) => {
              const slug = toSlug(cat.category_name)
              return (
              <Link
                key={cat.id}
                to={`/category/${slug}`}
                className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all duration-300 transform hover:scale-105 ${
                  curCategory === slug
                    ? 'bg-white text-purple-700 shadow-lg scale-105'
                    : 'text-purple-100 hover:bg-white/10'
                }`}
              >
                {formatName(cat.category_name)}
              </Link>
              )
            })}

            {/* Compact Search */}
            <form onSubmit={handleSearchSubmit} className="flex items-center ml-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-purple-200" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search all..."
                  className="w-28 lg:w-36 pl-8 pr-3 py-1.5 rounded-lg bg-white/15 text-white placeholder-purple-200 border border-white/20 focus:outline-none focus:bg-white/25 focus:border-white/40 text-xs transition-all"
                />
              </div>
            </form>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <Link to="/cart" className="relative text-purple-100 hover:text-white group transition-all duration-300">
              <ShoppingCart className="h-6 w-6 group-hover:scale-125 transition-transform duration-300" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <Link to="/profile" className="hidden md:flex text-purple-100 hover:text-white transition-colors duration-300 items-center gap-1 group">
                <div className="bg-white/20 p-1.5 rounded-full group-hover:bg-white/30 transition-colors">
                  <User className="h-5 w-5 text-white" />
                </div>
              </Link>
            ) : (
              <Link to="/login" className="hidden md:flex bg-white text-purple-700 px-4 py-2 rounded-lg font-medium hover:bg-yellow-200 transition-all duration-300 transform hover:scale-105 text-sm">
                Login
              </Link>
            )}

            {isAdmin && (
              <Link
                to="/admin"
                className="hidden md:block px-4 py-2 rounded-lg font-semibold transition-all duration-300 text-sm transform hover:scale-105 bg-white/20 text-white hover:bg-white/30"
              >
                Admin
              </Link>
            )}

            {/* Mobile Search + Menu */}
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="md:hidden text-purple-100 hover:text-white"
            >
              <Search className="h-5 w-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-purple-100 hover:text-white"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {mobileSearchOpen && (
          <div ref={searchRef} className="md:hidden border-t border-purple-500 bg-purple-800 relative">
            <div className="px-4 py-3">
              <form onSubmit={(e) => { handleSearchSubmit(e); setMobileSearchOpen(false) }}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-300" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search all products..."
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/15 text-white placeholder-purple-200 border border-white/20 focus:outline-none focus:bg-white/25 focus:border-white/40 text-sm"
                  />
                </div>
              </form>
            </div>
            {searchResults.length > 0 && (
              <div className="absolute left-0 right-0 top-full bg-purple-800 border-t border-purple-500 shadow-xl rounded-b-xl overflow-hidden z-50">
                {searchResults.map((p) => (
                  <Link
                    key={p.id}
                    to={`/products/${p.id}`}
                    onClick={() => { setMobileSearchOpen(false); setSearchQuery(''); setSearchResults([]) }}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-purple-700 overflow-hidden flex-shrink-0">
                      {p.image_url ? (
                        <img src={getImageUrl(p.image_url)} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-purple-300 text-xs">N/A</div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-white truncate">{p.product_name}</p>
                      <p className="text-xs text-purple-300">₹{p.price || p.mrp}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
            {searching && (
              <div className="px-4 py-2 text-xs text-purple-300">Searching...</div>
            )}
          </div>
        )}

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-purple-500 bg-purple-800 pb-4 max-h-[80vh] overflow-y-auto">

            <Link
              to="/"
              className={`block px-4 py-3 rounded font-medium text-base transition-all duration-300 ${
                isActive('/')
                  ? 'bg-white text-purple-700 shadow-lg mx-3 rounded-lg'
                  : 'text-purple-100 hover:bg-white/10'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>

            <div className="px-4 py-2 text-sm font-semibold text-purple-300 uppercase tracking-wider mt-2">Categories</div>
            <div className="space-y-1 mx-3 rounded-lg overflow-hidden">
              <Link
                to="/products"
                className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-lg ${
                  isProductsPage && !curCategory
                    ? 'bg-white text-purple-700 shadow-md'
                    : 'text-purple-100 hover:bg-white/10'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                All Products
              </Link>
              {categories.map((cat) => {
                const slug = toSlug(cat.category_name)
                return (
                <Link
                  key={cat.id}
                  to={`/category/${slug}`}
                  className={`block px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-lg ${
                    curCategory === slug
                      ? 'bg-white text-purple-700 shadow-md'
                      : 'text-purple-100 hover:bg-white/10'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {formatName(cat.category_name)}
                </Link>
                )
              })}
            </div>

            <Link
              to="/cart"
              className={`flex items-center gap-2 px-4 py-3 rounded font-medium text-base transition-all duration-300 ${
                isActive('/cart')
                  ? 'bg-white text-purple-700 shadow-lg mx-3 rounded-lg'
                  : 'text-purple-100 hover:bg-white/10'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <ShoppingCart className="h-5 w-5" />
              Cart {cartCount > 0 && `(${cartCount})`}
            </Link>

            {user ? (
              <Link
                to="/profile"
                className={`flex items-center gap-2 px-4 py-3 rounded font-medium text-base transition-all duration-300 ${
                  isActive('/profile')
                    ? 'bg-white text-purple-700 shadow-lg mx-3 rounded-lg'
                    : 'text-purple-100 hover:bg-white/10'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <User className="h-5 w-5" />
                My Profile
              </Link>
            ) : (
              <Link
                to="/login"
                className={`flex items-center gap-2 px-4 py-3 rounded font-medium text-base transition-all duration-300 ${
                  isActive('/login')
                    ? 'bg-white text-purple-700 shadow-lg mx-3 rounded-lg'
                    : 'text-purple-100 hover:bg-white/10'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <User className="h-5 w-5" />
                Login / Register
              </Link>
            )}

            {isAdmin && (
              <Link
                to="/admin"
                className="block px-4 py-3 rounded font-medium text-base transition-all duration-300 text-purple-100 hover:bg-white/10"
                onClick={() => setMobileMenuOpen(false)}
              >
                Admin
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
