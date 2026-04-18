import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, MessageCircle, Phone } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { getImageUrl } from '../../lib/supabaseClient'
import toast from 'react-hot-toast'

const ProductCard = ({ product }) => {
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const inStock = product.stock > 0
  const phone = import.meta.env.VITE_PHONE || '+917407437378'

  // Convert image path to public URL if it exists
  const imageUrl = product.image_url ? getImageUrl(product.image_url) : null

  const handleAddToCart = (e) => {
    e.preventDefault()
    addToCart(product)
    toast.success((t) => (
      <div className="flex items-center justify-between gap-3 w-full">
        <span>Added to cart! 🛒</span>
        <button
          onClick={() => {
            navigate('/cart')
            toast.dismiss(t.id)
          }}
          className="bg-white text-purple-600 font-bold px-3 py-1 rounded-lg hover:bg-purple-50 transition-all text-sm"
        >
          View Cart
        </button>
      </div>
    ))
  }

  const handleWhatsApp = (e) => {
    e.preventDefault()
    const message = `Hi, interested in:\n${product.product_name}\nCode: ${product.product_code}\n₹${product.price}`
    window.open(
      `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`,
      '_blank'
    )
  }

  const categoryTag = {
    gifts: { label: '🎁 Gift', bg: 'bg-pink-500' },
    jewellery: { label: '💎 Jewellery', bg: 'bg-purple-500' },
    cosmetics: { label: '💄 Cosmetics', bg: 'bg-blue-500' }
  }

  const tag = categoryTag[product.categories?.category_name?.toLowerCase()] || { label: 'Product', bg: 'bg-gray-500' }

  // Get stock display text
  const getStockDisplay = () => {
    if (product.stock === 0) return 'Out of Stock'
    if (product.stock <= 3) return `${product.stock} available`
    return 'Available'
  }

  return (
    <Link to={`/products/${product.id}`} className="group">
      <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 flex flex-col h-full border border-gray-100 group">
        {/* Image Container */}
        <div className="relative h-72 overflow-hidden bg-gray-100">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.product_name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.target.style.display = 'none'
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <ShoppingCart className="h-20 w-20 text-gray-400" />
            </div>
          )}

          {/* Category Badge */}
          <span className={`absolute top-3 right-3 ${tag.bg} text-white text-sm font-bold px-4 py-2 rounded-full`}>
            {tag.label}
          </span>

          {/* Stock Badge */}
          {!inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-bold text-2xl">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          {/* Product Name */}
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-all duration-300 group-hover:-translate-x-0.5">
            {product.product_name}
          </h3>

          {/* Product Code */}
          <p className="text-sm text-gray-500 font-mono mb-3">{product.product_code}</p>

          {/* Price */}
          <div className="flex items-center gap-2 mb-3">
            {product.price && product.mrp ? (
              <>
                <span className="text-sm text-gray-500 line-through">₹{product.mrp}</span>
                <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">₹{product.price}</span>
              </>
            ) : product.mrp ? (
              <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">₹{product.mrp}</span>
            ) : (
              <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">₹{product.price}</span>
            )}
          </div>

          {/* Stock Status */}
          <p className={`text-sm font-bold mb-4 ${
            product.stock > 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {product.stock > 0 ? `✓ ${getStockDisplay()}` : '✗ Out of Stock'}
          </p>

          {/* Action Buttons */}
          <div className="space-y-3 mt-auto">
            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={!inStock}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg text-base transition-all flex items-center justify-center gap-2 overflow-hidden"
            >
              <ShoppingCart className="h-5 w-5 flex-shrink-0" />
              <span className="truncate">Add to Cart</span>
            </button>

            {/* Contact Options */}
            <div className="grid grid-cols-2 gap-3">
              {/* WhatsApp */}
              <button
                onClick={handleWhatsApp}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-2 rounded-lg text-sm md:text-base transition-all flex items-center justify-center gap-1 overflow-hidden"
              >
                <MessageCircle className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
                <span className="truncate">Chat</span>
              </button>

              {/* Call */}
              <a
                href={`tel:${phone}`}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-2 rounded-lg text-sm md:text-base transition-all flex items-center justify-center gap-1 overflow-hidden"
              >
                <Phone className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
                <span className="truncate">Call</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard