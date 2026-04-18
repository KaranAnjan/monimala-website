import { useParams, Link, useNavigate } from 'react-router-dom'
import { useProduct } from '../../hooks/useProducts'
import { useCart } from '../../context/CartContext'
import Loading from '../../components/common/Loading'
import { ArrowLeft, Package, IndianRupee, ShoppingCart, MessageCircle, Phone } from 'lucide-react'
import { getImageUrl } from '../../lib/supabaseClient'
import toast from 'react-hot-toast'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { product, loading } = useProduct(id)
  const { addToCart } = useCart()
  const phone = import.meta.env.VITE_PHONE || '+917407437378'

  if (loading) return <Loading />
  if (!product) return <div className="text-center py-16 text-lg text-gray-500">Product not found</div>

  const handleAddToCart = () => {
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

  const handleWhatsApp = () => {
    const message = `Hi, I'm interested in:\n\nProduct: ${product.product_name}\nCode: ${product.product_code}\nPrice: ₹${product.price}`
    const encodedMessage = encodeURIComponent(message)
    window.open(
      `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodedMessage}`,
      '_blank'
    )
  }

  const handleCall = () => {
    window.location.href = `tel:${phone}`
  }

  // Get stock display text
  const getStockDisplay = () => {
    if (product.stock === 0) return 'Out of Stock'
    if (product.stock <= 3) return `${product.stock} available`
    return 'Available'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Back Button */}
        <Link
          to="/products"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-8 transition-all duration-300 hover:gap-2 gap-1 group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Products
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-start">
          {/* Image */}
          <div className="animate-fade-in">
            <div className="aspect-square bg-white rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-300">
              {product.image_url ? (
                <img
                  src={getImageUrl(product.image_url)}
                  alt={product.product_name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                  <Package className="h-32 w-32 text-gray-300" />
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4 md:space-y-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            {/* Category Badge */}
            <div className="inline-flex">
              <span className="px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 text-sm font-semibold rounded-full hover:shadow-md transform hover:scale-105 transition-all duration-300 cursor-pointer">
                {product.categories?.category_name}
              </span>
            </div>

            {/* Title */}
            <div>
              <h1 className="text-2xl md:text-5xl font-bold text-gray-900 mb-2 leading-tight">
                {product.product_name}
              </h1>
              <p className="text-gray-500 text-sm md:text-base">
                Product Code: <span className="font-mono font-semibold text-gray-700">{product.product_code}</span>
              </p>
            </div>

            {/* Price */}
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-4 md:p-6">
              <p className="text-gray-600 text-xs md:text-sm mb-1">Price</p>
              <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                <IndianRupee className="h-8 w-8 md:h-10 md:w-10 text-purple-600 flex-shrink-0" />
                <div className="flex items-center gap-2 flex-wrap">
                  {product.price && product.mrp ? (
                    <>
                      <span className="text-lg md:text-2xl text-gray-400 line-through">₹{product.mrp}</span>
                      <span className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                        {product.price}
                      </span>
                    </>
                  ) : product.mrp ? (
                    <span className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                      {product.mrp}
                    </span>
                  ) : (
                    <span className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                      {product.price}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Stock Status */}
            <div
              className={`px-6 py-4 rounded-2xl font-semibold text-sm ${
                product.stock > 0
                  ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700'
                  : 'bg-gradient-to-r from-red-100 to-pink-100 text-red-700'
              }`}
            >
              {product.stock > 0
                ? `✓ ${getStockDisplay()}`
                : '✗ Out of Stock'}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 md:py-4 px-4 md:px-6 rounded-xl transition-all duration-300 transform hover:shadow-lg hover:-translate-y-1 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 text-base md:text-lg group"
              >
                <ShoppingCart className="h-5 w-5 md:h-6 md:w-6 group-hover:scale-125 transition-transform" />
                Add to Cart
              </button>

              {/* Contact Options */}
              <div className="grid grid-cols-2 gap-3">
                {/* WhatsApp */}
                <button
                  onClick={handleWhatsApp}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 md:py-4 px-3 md:px-4 rounded-xl transition-all duration-300 transform hover:shadow-lg hover:-translate-y-1 hover:scale-105 active:scale-95 flex items-center justify-center gap-1 text-sm md:text-base group"
                >
                  <MessageCircle className="h-4 w-4 md:h-5 md:w-5 group-hover:scale-125 transition-transform flex-shrink-0" />
                  <span>WhatsApp</span>
                </button>

                {/* Call */}
                <button
                  onClick={handleCall}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-3 md:py-4 px-3 md:px-4 rounded-xl transition-all duration-300 transform hover:shadow-lg hover:-translate-y-1 hover:scale-105 active:scale-95 flex items-center justify-center gap-1 text-sm md:text-base group"
                >
                  <Phone className="h-4 w-4 md:h-5 md:w-5 group-hover:scale-125 transition-transform flex-shrink-0" />
                  <span>Call</span>
                </button>
              </div>

              {/* View Cart */}
              <button
                onClick={() => navigate('/cart')}
                className="w-full border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-bold py-2 md:py-3 px-4 md:px-6 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 text-sm md:text-base"
              >
                View Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  )
}

export default ProductDetail