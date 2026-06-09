import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { getImageUrl } from '../../lib/supabaseClient'
import toast from 'react-hot-toast'

const ProductCard = ({ product }) => {
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const inStock = product.stock > 0

  const imageUrl = product.image_url ? getImageUrl(product.image_url) : null

  const handleAddToCart = (e) => {
    e.preventDefault()
    addToCart(product)
    toast.success((t) => (
      <div className="flex items-center justify-between gap-3 w-full">
        <span>Added to cart!</span>
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

  return (
    <Link to={`/products/${product.id}`} className="group block h-full">
      <div className="bg-white rounded-lg border border-gray-200 hover:border-purple-200 hover:shadow-lg transition-all duration-300 flex flex-col h-full overflow-hidden">
        <div className="relative aspect-[4/3] bg-gray-50 overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.product_name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                e.target.style.display = 'none'
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-50">
              <ShoppingCart className="h-12 w-12 text-gray-300" />
            </div>
          )}

          {!inStock && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="text-white font-semibold text-sm bg-black/60 px-3 py-1 rounded">Out of Stock</span>
            </div>
          )}
        </div>

        <div className="p-4 flex flex-col flex-1">
          <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2 leading-snug">
            {product.product_name}
          </h3>

          <p className="text-xs text-gray-400 font-mono mb-3">{product.product_code}</p>

          <div className="flex items-center gap-2 mb-3">
            {product.price && product.mrp ? (
              <>
                <span className="text-xs text-gray-400 line-through">₹{product.mrp}</span>
                <span className="text-base font-bold text-purple-700">₹{product.price}</span>
              </>
            ) : product.mrp ? (
              <span className="text-base font-bold text-purple-700">₹{product.mrp}</span>
            ) : (
              <span className="text-base font-bold text-purple-700">₹{product.price}</span>
            )}
          </div>

          {inStock && product.stock <= 3 && (
            <p className="text-xs text-amber-600 mb-3">Only {product.stock} left</p>
          )}

          <div className="mt-auto">
            <button
              onClick={handleAddToCart}
              disabled={!inStock}
              className="w-full bg-purple-700 hover:bg-purple-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-2 px-3 rounded-lg text-xs transition-all flex items-center justify-center gap-1.5"
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              {inStock ? 'Add to Cart' : 'Sold Out'}
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard
