import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { supabase, getImageUrl } from '../../lib/supabaseClient'
import { Package, User, LogOut, Loader, MapPin, Edit3, Save, ChevronDown, ChevronUp } from 'lucide-react'
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

const DEFAULT_ADDR = { name: '', phone: '', address: '', city: '', state: '', pincode: '' }

const Profile = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const [profile, setProfile] = useState(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [address, setAddress] = useState({ ...DEFAULT_ADDR })
  const [expandedOrder, setExpandedOrder] = useState(null)

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    setAddress({ ...DEFAULT_ADDR, ...(user.user_metadata?.address || {}) })
    setProfile({ ...(user.user_metadata?.address || {}) })
    fetchOrders()
  }, [user])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const { data: rawOrders, error } = await supabase
        .from('orders').select('*')
        .eq('user_id', user.id).order('created_at', { ascending: false })
      if (error) throw error

      const ordersWithItems = await Promise.all((rawOrders || []).map(async (order) => {
        const { data: items } = await supabase
          .from('order_items').select('*, products(*)')
          .eq('order_id', order.id)
        return { ...order, order_items: items || [] }
      }))

      setOrders(ordersWithItems)
    } catch (err) {
      console.error('fetchOrders error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveAddress = async () => {
    if (!user) return
    setSaving(true)
    try {
      const payload = {
        name: address.name, phone: address.phone,
        address: address.address, city: address.city,
        state: address.state, pincode: address.pincode,
        updated_at: new Date().toISOString()
      }
      const { data: userData, error } = await supabase.auth.updateUser({
        data: { address: payload }
      })
      if (error) throw error
      setProfile(payload)
      setEditing(false)
      toast.success('Address saved!')
    } catch (_err) {
      toast.error('Failed to save address')
    } finally {
      setSaving(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    toast.success('Logged out')
    navigate('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader className="h-8 w-8 text-purple-600 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header */}
        <div className="bg-white rounded-lg border border-gray-200 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="h-7 w-7 text-purple-600" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">{user?.user_metadata?.name || user?.email}</h1>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>
          <button onClick={handleSignOut} className="text-sm text-red-600 hover:text-red-700 transition-colors flex items-center gap-1.5">
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Address */}
          <div className="bg-white rounded-lg border border-gray-200 p-5 h-fit">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-purple-600" />
                <h2 className="text-base font-bold text-gray-900">Address</h2>
              </div>
              {!editing && (profile?.address || profile?.city) && (
                <button onClick={() => setEditing(true)} className="text-purple-600 hover:text-purple-700 text-xs flex items-center gap-1">
                  <Edit3 className="h-3 w-3" /> Edit
                </button>
              )}
            </div>

            {editing ? (
              <div className="space-y-2">
                <input type="text" placeholder="Full Name" value={address.name}
                  onChange={e => setAddress({...address, name: e.target.value})}
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                <input type="tel" placeholder="Phone" value={address.phone}
                  onChange={e => setAddress({...address, phone: e.target.value})}
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                <textarea placeholder="Address" rows={2} value={address.address}
                  onChange={e => setAddress({...address, address: e.target.value})}
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none" />
                <div className="grid grid-cols-2 gap-2">
                  <input type="text" placeholder="City" value={address.city}
                    onChange={e => setAddress({...address, city: e.target.value})}
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                  <select value={address.state} onChange={e => setAddress({...address, state: e.target.value})}
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white">
                    <option value="">State</option>
                    {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <input type="text" placeholder="PIN Code" value={address.pincode}
                  onChange={e => setAddress({...address, pincode: e.target.value})}
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                <div className="flex gap-2 pt-1">
                  <button onClick={() => setEditing(false)} className="flex-1 text-sm text-gray-600 border border-gray-300 rounded-md py-1.5 hover:bg-gray-50 transition-colors">
                    Cancel
                  </button>
                  <button onClick={handleSaveAddress} disabled={saving}
                    className="flex-1 text-sm bg-purple-700 text-white rounded-md py-1.5 hover:bg-purple-800 transition-colors flex items-center justify-center gap-1">
                    <Save className="h-3.5 w-3.5" />
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-600 space-y-1">
                {profile?.name && <p className="font-medium text-gray-900">{profile.name}</p>}
                {profile?.phone && <p className="text-gray-500">{profile.phone}</p>}
                {profile?.address ? (
                  <>
                    <p>{profile.address}</p>
                    <p>{profile.city}{profile.city && profile.state ? ', ' : ''}{profile.state}</p>
                    {profile.pincode && <p>PIN: {profile.pincode}</p>}
                  </>
                ) : profile?.city ? (
                  <>
                    <p>{profile.city}{profile.state ? ', ' + profile.state : ''}</p>
                    {profile.pincode && <p>PIN: {profile.pincode}</p>}
                  </>
                ) : (
                  <div>
                    <p className="text-gray-400 text-xs italic mb-2">No address saved.</p>
                    <button onClick={() => setEditing(true)} className="text-xs text-purple-600 hover:text-purple-700">Add Address</button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Orders */}
          <div className="md:col-span-2 space-y-4">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Package className="h-5 w-5 text-purple-600" />
              Order History
            </h2>

            {orders.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
                <p className="text-sm text-gray-500 mb-4">No orders yet.</p>
                <button onClick={() => navigate('/products')} className="bg-purple-700 hover:bg-purple-800 text-white text-sm px-5 py-2 rounded-lg transition-colors">
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white rounded-lg border border-gray-200">
                    <button onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                      className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left">
                      <div>
                        <p className="text-xs text-gray-400">{order.order_number || `#${order.id}`}</p>
                        <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize whitespace-nowrap ${
                          order.delivery_status === 'delivered' ? 'bg-green-100 text-green-700' :
                          order.delivery_status === 'cancelled' ? 'bg-red-100 text-red-700' :
                          order.delivery_status === 'shipped' || order.delivery_status === 'out_for_delivery' ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {order.delivery_status || order.status || 'pending'}
                        </span>
                        <span className="text-sm font-bold text-purple-700">₹{order.total_amount}</span>
                        {expandedOrder === order.id ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
                      </div>
                    </button>

                    {expandedOrder === order.id && (
                      <div className="border-t border-gray-100 p-4 space-y-2">
                        {order.delivery_date && (
                          <p className="text-xs text-gray-500 mb-2">Delivered on {new Date(order.delivery_date).toLocaleDateString()}</p>
                        )}
                        {order.order_items?.length === 0 ? (
                          <p className="text-xs text-gray-400">No items in this order.</p>
                        ) : (
                          order.order_items?.map((item) => (
                            <Link key={item.id} to={`/products/${item.product_id}`}
                              className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 transition-colors">
                              <div className="h-12 w-12 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                {item.products?.image_url ? (
                                  <img src={getImageUrl(item.products.image_url)} alt={item.products.name} className="h-full w-full object-cover" />
                                ) : (
                                  <Package className="h-5 w-5 m-auto text-gray-300 mt-3.5" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-900 truncate">{item.products?.name || 'Product'}</p>
                                <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                              </div>
                              <span className="text-sm font-medium text-gray-900">₹{item.price * item.quantity}</span>
                            </Link>
                          ))
                        )}
                      </div>
                    )}
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
