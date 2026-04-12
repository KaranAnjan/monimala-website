import { Link } from 'react-router-dom'
import { ShoppingCart, MessageCircle, Phone } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { getImageUrl } from '../../lib/supabaseClient'
import toast from 'react-hot-toast'

const ProductCard = ({ product }) => {
  const { addToCart } = useCart()
  const inStock = product.stock > 0
  const phone = import.meta.env.VITE_PHONE || '+917407437378'

  // Convert image path to public URL if it exists
  const imageUrl = product.image_url ? getImageUrl(product.image_url) : null

  const handleAddToCart = (e) => {
    e.preventDefault()
    addToCart(product)
    toast.success('Added to cart!', { icon: '🛒' })
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

  return (
    <Link to={`/products/${product.id}`} className="group">
      <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col h-full border border-gray-100">
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
          {/* Category Name */}
          <p className="text-sm text-purple-600 font-bold mb-2">
            {product.categories?.category_name}
          </p>

          {/* Product Name */}
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
            {product.product_name}
          </h3>

          {/* Product Code */}
          <p className="text-sm text-gray-500 font-mono mb-3">{product.product_code}</p>

          {/* Price */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-3xl font-bold text-orange-600">₹{product.price}</span>
          </div>

          {/* Stock Status */}
          <p className={`text-sm font-bold mb-4 ${inStock ? 'text-green-600' : 'text-red-600'}`}>
            {inStock ? `✓ ${product.stock} in stock` : 'Out of Stock'}
          </p>

          {/* Action Buttons */}
          <div className="space-y-3 mt-auto">
            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={!inStock}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg text-lg transition-all flex items-center justify-center gap-2"
            >
              <ShoppingCart className="h-6 w-6" />
              Add to Cart
            </button>

            {/* Contact Options */}
            <div className="flex gap-3">
              {/* WhatsApp */}
              <button
                onClick={handleWhatsApp}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-3 rounded-lg text-base transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="h-5 w-5" />
                WhatsApp
              </button>

              {/* Call */}
              <a
                href={`tel:${phone}`}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-3 rounded-lg text-base transition-all flex items-center justify-center gap-2"
              >
                <Phone className="h-5 w-5" />
                Call
              </a>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard