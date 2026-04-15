import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { Trash2, Minus, Plus, MessageCircle, ArrowLeft, ShoppingCart } from 'lucide-react'
import { getImageUrl } from '../../lib/supabaseClient'
import toast from 'react-hot-toast'

const Cart = () => {
  const navigate = useNavigate()
  const { cart, removeFromCart, updateQuantity, total, clearCart } = useCart()
  const phone = import.meta.env.VITE_PHONE || '+917407437378'

  const handleWhatsAppOrder = () => {
    if (cart.length === 0) {
      toast.error('Cart is empty!')
      return
    }

    let message = 'Hi, I want to order the following products:\n\n'
    message += cart
      .map(
        (item) =>
          `📦 ${item.product_name}\n   Code: ${item.product_code}\n   Price: ₹${item.price}\n   Qty: ${item.quantity}\n`
      )
      .join('')
    message += `\n💰 Total: ₹${total}`

    const encodedMessage = encodeURIComponent(message)
    window.open(
      `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodedMessage}`,
      '_blank'
    )
  }

  const handlePayment = () => {
    if (cart.length === 0) {
      toast.error('Cart is empty!')
      return
    }
    // TODO: Integrate Razorpay or other payment gateway
    toast.info('Payment gateway coming soon!')
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <Link
            to="/products"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-8 gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Shop
          </Link>

          <div className="text-center py-16">
            <ShoppingCart className="h-20 w-20 mx-auto text-gray-300 mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-8">Add some amazing products to get started!</p>
            <Link
              to="/products"
              className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-xl transition-all duration-200"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Back Button */}
        <Link
          to="/products"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-800 hover:translate-x-1 mb-8 gap-1 transition-all duration-300 group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Shop
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow p-6 flex gap-6 animate-fade-in"
                >
                  {/* Image */}
                  <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                    {item.image_url ? (
                      <img
                        src={getImageUrl(item.image_url)}
                        alt={item.product_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingCart className="h-8 w-8 text-gray-300" />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg">{item.product_name}</h3>
                    <p className="text-sm text-gray-500">Code: {item.product_code}</p>
                    <div className="mt-3 flex items-center gap-3">
                      <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-pink-600">
                        ₹{item.price}
                      </span>
                      <span className="text-sm text-gray-500">
                        Subtotal: ₹{item.price * item.quantity}
                      </span>
                    </div>
                  </div>

                  {/* Quantity & Actions */}
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition-all duration-200 transform hover:scale-125 active:scale-95"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>

                    <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-2 border-2 border-gray-200 hover:border-purple-300 transition-colors duration-300">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-gray-200 rounded transition-all duration-200 transform hover:scale-110 active:scale-90"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-gray-200 rounded transition-all duration-200 transform hover:scale-110 active:scale-90"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary & Checkout */}
          <div>
            <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

              {/* Items Summary */}
              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm text-gray-600">
                    <span>
                      {item.product_name} x{item.quantity}
                    </span>
                    <span className="font-semibold">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="bg-gradient-to-r from-orange-100 to-pink-100 rounded-xl p-4 mb-6">
                <p className="text-gray-600 text-sm mb-1">Total Amount</p>
                <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-pink-600">
                  ₹{total}
                </p>
              </div>

              {/* Buttons */}
              <div className="space-y-3">
                {/* WhatsApp Order */}
                <button
                  onClick={handleWhatsAppOrder}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 hover:shadow-lg hover:-translate-y-1 flex items-center justify-center gap-2 group"
                >
                  <MessageCircle className="h-5 w-5 group-hover:scale-125 transition-transform" />
                  Order via WhatsApp
                </button>

                {/* Payment Button */}
                <button
                  onClick={handlePayment}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 hover:shadow-lg hover:-translate-y-1"
                >
                  Proceed to Payment
                </button>

                {/* Continue Shopping */}
                <button
                  onClick={() => navigate('/products')}
                  className="w-full border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
                >
                  Continue Shopping
                </button>

                {/* Clear Cart */}
                <button
                  onClick={() => {
                    clearCart()
                    toast.success('Cart cleared!')
                  }}
                  className="w-full text-red-600 hover:text-red-800 hover:bg-red-50 text-sm font-medium py-2 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
                >
                  Clear Cart
                </button>
              </div>

              {/* Info */}
              {cart.length >= 3 && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-700">
                    ✓ You have 3+ items! Get special pricing via WhatsApp.
                  </p>
                </div>
              )}
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

export default Cart
