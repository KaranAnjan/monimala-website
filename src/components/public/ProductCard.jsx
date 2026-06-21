import { Link, useNavigate } from 'react-router-dom'
import { Heart, ShoppingCart } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import { getImageUrl } from '../../lib/supabaseClient'
import toast from 'react-hot-toast'

const ProductCard = ({ product }) => {
  const navigate = useNavigate()
  const { cart, addToCart } = useCart()
  const { isInWishlist, toggleWishlist } = useWishlist()
  const inStock = product.stock > 0
  const inCart = cart.some(item => item.id === product.id)
  const wishlisted = isInWishlist(product.id)

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

          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product.id) }}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 hover:bg-white shadow-sm transition-all z-10"
          >
            <Heart className={`h-4 w-4 transition-colors ${wishlisted ? 'fill-purple-600 text-purple-600' : 'text-gray-600'}`} />
          </button>
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
            {inCart ? (
              <Link to="/cart"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-3 rounded-lg text-xs transition-all flex items-center justify-center gap-1.5">
                <ShoppingCart className="h-3.5 w-3.5" />
                View Cart
              </Link>
            ) : (
              <button
                onClick={handleAddToCart}
                disabled={!inStock}
                className="w-full bg-purple-700 hover:bg-purple-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-2 px-3 rounded-lg text-xs transition-all flex items-center justify-center gap-1.5"
              >
                <ShoppingCart className="h-3.5 w-3.5" />
                {inStock ? 'Add to Cart' : 'Sold Out'}
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard
