import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { supabase, getImageUrl } from '../../lib/supabaseClient'
import { Package, User, LogOut, Loader, MapPin } from 'lucide-react'
import toast from 'react-hot-toast'

const Profile = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  
  const [profile, setProfile] = useState(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    const fetchProfileAndOrders = async () => {
      try {
        setLoading(true)
        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profileError && profileError.code !== 'PGRST116') {
          console.error("Error fetching profile:", profileError)
        } else if (profileData) {
          setProfile(profileData)
        }

        // Fetch user orders
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select(`
            *,
            order_items (
              *,
              products (
                name,
                image_url,
                product_code
              )
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (ordersError) {
          console.error("Error fetching orders:", ordersError)
        } else {
          setOrders(ordersData || [])
        }
      } catch (err) {
        console.error("Unexpected error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchProfileAndOrders()
  }, [user, navigate])

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success('Logged out successfully')
      navigate('/')
    } catch (error) {
      toast.error('Failed to log out')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader className="h-8 w-8 text-purple-600 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-md p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="h-24 w-24 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="h-10 w-10 text-purple-600" />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{profile?.name || user?.email}</h1>
              <p className="text-gray-500">{user?.email}</p>
              {profile?.phone && <p className="text-gray-500 text-sm mt-1">{profile.phone}</p>}
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Address Info */}
          <div className="bg-white rounded-2xl shadow-md p-6 h-fit">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-purple-600" />
              <h2 className="text-xl font-bold text-gray-900">Saved Address</h2>
            </div>
            {profile?.address ? (
              <div className="text-gray-600 text-sm space-y-1">
                <p>{profile.address}</p>
                <p>{profile.city}, {profile.state}</p>
                <p>PIN: {profile.pincode}</p>
              </div>
            ) : (
              <p className="text-gray-500 text-sm italic">No address saved yet. It will be saved on your first order.</p>
            )}
          </div>

          {/* Orders History */}
          <div className="md:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Package className="h-6 w-6 text-purple-600" />
              Order History
            </h2>

            {orders.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-md p-8 text-center">
                <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
                <button
                  onClick={() => navigate('/products')}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white rounded-2xl shadow-md p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 pb-4 border-b border-gray-100 gap-2">
                      <div>
                        <p className="text-sm text-gray-500">Order ID: {order.id.slice(0, 8)}...</p>
                        <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                          order.status === 'completed' ? 'bg-green-100 text-green-700' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {order.status || 'pending'}
                        </span>
                        <p className="font-bold text-lg text-purple-600">₹{order.total_amount}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {order.order_items?.map((item) => (
                        <div key={item.id} className="flex items-center gap-4">
                          <div className="h-16 w-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            {item.products?.image_url ? (
                              <img
                                src={getImageUrl(item.products.image_url)}
                                alt={item.products.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <Package className="h-8 w-8 m-auto text-gray-300 mt-4" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {item.products?.name || 'Unknown Product'}
                            </p>
                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                          </div>
                          <p className="text-sm font-medium text-gray-900">₹{item.price * item.quantity}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
