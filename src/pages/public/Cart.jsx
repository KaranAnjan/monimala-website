import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { Trash2, Minus, Plus, MessageCircle, ArrowLeft, ShoppingCart, MapPin, CheckCircle } from 'lucide-react'
import { supabase, getImageUrl } from '../../lib/supabaseClient'
import toast from 'react-hot-toast'

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
]

const Cart = () => {
  const navigate = useNavigate()
  const { cart, removeFromCart, updateQuantity, total, clearCart } = useCart()
  const { user } = useAuth()
  const phone = import.meta.env.VITE_PHONE || '+917407437378'

  const [showAddressForm, setShowAddressForm] = useState(false)
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  const [address, setAddress] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  })

  // When user logs in (or comes back from login page), fetch their saved profile
  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        const { data } = await supabase.from('users').select('*').eq('id', user.id).single()
        if (data) {
          setAddress({
            name: data.name || '',
            phone: data.phone || '',
            address: data.address || '',
            city: data.city || '',
            state: data.state || '',
            pincode: data.pincode || ''
          })
        }
      }
      fetchProfile()
    }
  }, [user])

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

  const handleProceedToCheckout = () => {
    if (cart.length === 0) {
      toast.error('Cart is empty!')
      return
    }
    if (!user) {
      toast.error('Please login to continue checkout')
      navigate('/login?redirect=/cart')
      return
    }
    setShowAddressForm(true)
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault()
    if (!user) return
    
    setIsPlacingOrder(true)
    try {
      // 1. Upsert user profile (ensures user exists in public.users table)
      const { error: userError } = await supabase.from('users').upsert({
        id: user.id,
        email: user.email || '',
        name: address.name,
        phone: address.phone,
        address: address.address,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        updated_at: new Date().toISOString(),
        is_active: true
      }, { onConflict: 'id' })
      
      if (userError) throw userError

      // 2. Create order
      const orderId = crypto.randomUUID()
      const { error: orderError } = await supabase.from('orders').insert({
        id: orderId,
        user_id: user.id,
        total_amount: total,
        status: 'pending',
        created_at: new Date().toISOString()
      })
      if (orderError) throw orderError

      // 3. Create order items
      const orderItems = cart.map(item => ({
        id: crypto.randomUUID(),
        order_id: orderId,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price
      }))
      const { error: itemsError } = await supabase.from('order_items').insert(orderItems)
      if (itemsError) throw itemsError

      // Success
      toast.success('Order placed successfully! (Cash on Delivery)')
      clearCart()
      navigate('/profile')
    } catch (error) {
      console.error(error)
      toast.error('Failed to place order. Please try again.')
    } finally {
      setIsPlacingOrder(false)
    }
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Back Button */}
        <Link
          to="/products"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-800 hover:translate-x-1 mb-8 gap-1 transition-all duration-300 group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Shop
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-6 md:mb-8">Shopping Cart</h1>

            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow p-4 md:p-6 flex flex-col md:flex-row gap-4 md:gap-6 animate-fade-in"
                >
                  {/* Image */}
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
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
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-base md:text-lg line-clamp-2">{item.product_name}</h3>
                    <p className="text-xs md:text-sm text-gray-500">Code: {item.product_code}</p>
                    <div className="mt-2 md:mt-3 flex flex-col md:flex-row md:items-center md:gap-3 gap-1">
                      <span className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                        ₹{item.price}
                      </span>
                      <span className="text-xs md:text-sm text-gray-500">
                        Subtotal: ₹{item.price * item.quantity}
                      </span>
                    </div>
                  </div>

                  {/* Quantity & Actions */}
                  <div className="flex items-center justify-between md:flex-col md:items-end md:justify-between gap-2">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition-all duration-200 transform hover:scale-125 active:scale-95"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>

                    <div className="flex items-center gap-1 md:gap-2 bg-gray-100 rounded-lg p-1.5 md:p-2 border-2 border-gray-200 hover:border-purple-300 transition-colors duration-300">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-gray-200 rounded transition-all duration-200 transform hover:scale-110 active:scale-90"
                      >
                        <Minus className="h-3 w-3 md:h-4 md:w-4" />
                      </button>
                      <span className="w-6 md:w-8 text-center font-semibold text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-gray-200 rounded transition-all duration-200 transform hover:scale-110 active:scale-90"
                      >
                        <Plus className="h-3 w-3 md:h-4 md:w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary & Checkout */}
          <div>
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 lg:sticky lg:top-8">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

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
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-3 md:p-4 mb-6">
                <p className="text-gray-600 text-xs md:text-sm mb-1">Total Amount</p>
                <p className="text-2xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                  ₹{total}
                </p>
              </div>

              {/* Buttons or Address Form */}
              {!showAddressForm ? (
                <div className="space-y-3">
                  {/* WhatsApp Order */}
                  <button
                    onClick={handleWhatsAppOrder}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 md:py-4 px-4 md:px-6 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 hover:shadow-lg hover:-translate-y-1 flex items-center justify-center gap-2 text-sm md:text-base group"
                  >
                    <MessageCircle className="h-4 w-4 md:h-5 md:w-5 group-hover:scale-125 transition-transform flex-shrink-0" />
                    Order via WhatsApp
                  </button>

                  {/* Checkout Button */}
                  <button
                    onClick={handleProceedToCheckout}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 md:py-4 px-4 md:px-6 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 hover:shadow-lg hover:-translate-y-1 text-sm md:text-base"
                  >
                    Proceed to Checkout
                  </button>

                  {/* Continue Shopping */}
                  <button
                    onClick={() => navigate('/products')}
                    className="w-full border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-bold py-2 md:py-3 px-4 md:px-6 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 text-sm md:text-base"
                  >
                    Continue Shopping
                  </button>

                  {/* Clear Cart */}
                  <button
                    onClick={() => {
                      clearCart()
                      toast.success('Cart cleared!')
                    }}
                    className="w-full text-red-600 hover:text-red-800 hover:bg-red-50 text-xs md:text-sm font-medium py-2 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
                  >
                    Clear Cart
                  </button>
                </div>
              ) : (
                <form onSubmit={handlePlaceOrder} className="space-y-4 animate-fade-in border-t border-gray-200 pt-6">
                  <div className="flex items-center gap-2 mb-4 text-purple-700 font-bold">
                    <MapPin className="h-5 w-5" />
                    <h3>Delivery Details</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <input
                      type="text"
                      required
                      placeholder="Full Name"
                      value={address.name}
                      onChange={e => setAddress({...address, name: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <input
                      type="tel"
                      required
                      placeholder="Phone Number"
                      value={address.phone}
                      onChange={e => setAddress({...address, phone: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <textarea
                      required
                      placeholder="Full Address"
                      rows="2"
                      value={address.address}
                      onChange={e => setAddress({...address, address: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    ></textarea>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        required
                        placeholder="City"
                        value={address.city}
                        onChange={e => setAddress({...address, city: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <select
                        required
                        value={address.state}
                        onChange={e => setAddress({...address, state: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                      >
                        <option value="" disabled>Select State</option>
                        {INDIAN_STATES.map(state => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="PIN Code"
                      value={address.pincode}
                      onChange={e => setAddress({...address, pincode: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div className="bg-yellow-50 text-yellow-800 p-3 rounded-lg text-sm mb-4 border border-yellow-200">
                    <strong>Payment Method:</strong> Cash on Delivery (COD) only.
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddressForm(false)}
                      className="flex-1 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-bold py-3 rounded-xl transition-all duration-300 text-sm"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isPlacingOrder}
                      className={`flex-[2] bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm shadow-lg ${isPlacingOrder ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}`}
                    >
                      {isPlacingOrder ? 'Placing Order...' : (
                        <>
                          <CheckCircle className="h-5 w-5" />
                          Place Order (COD)
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* Info */}
              {cart.length >= 3 && !showAddressForm && (
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
