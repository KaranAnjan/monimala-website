import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import { supabase } from '../lib/supabaseClient'
import toast from 'react-hot-toast'

const WishlistContext = createContext()

export const useWishlist = () => useContext(WishlistContext)

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth()
  const [wishlistIds, setWishlistIds] = useState(new Set())
  const [wishlistProducts, setWishlistProducts] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchWishlist = async () => {
    if (!user) {
      setWishlistIds(new Set())
      setWishlistProducts([])
      return
    }
    setLoading(true)
    const { data, error } = await supabase
      .from('wishlists')
      .select('*, products(*)')
      .eq('user_id', user.id)
    if (!error && data) {
      setWishlistIds(new Set(data.map(item => item.product_id)))
      setWishlistProducts(data.map(item => item.products).filter(Boolean))
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchWishlist()
  }, [user])

  const addToWishlist = async (productId) => {
    if (!user) { toast.error('Please login to add to wishlist'); return }
    const { error } = await supabase
      .from('wishlists')
      .insert({ user_id: user.id, product_id: productId })
    if (!error) {
      setWishlistIds(prev => new Set([...prev, productId]))
      toast.success('Added to wishlist!')
    }
  }

  const removeFromWishlist = async (productId) => {
    if (!user) return
    const { error } = await supabase
      .from('wishlists')
      .delete()
      .eq('user_id', user.id)
      .eq('product_id', productId)
    if (!error) {
      setWishlistIds(prev => {
        const next = new Set(prev)
        next.delete(productId)
        return next
      })
      setWishlistProducts(prev => prev.filter(p => p.id !== productId))
    }
  }

  const toggleWishlist = async (productId) => {
    if (wishlistIds.has(productId)) {
      await removeFromWishlist(productId)
    } else {
      await addToWishlist(productId)
    }
  }

  const isInWishlist = (productId) => wishlistIds.has(productId)

  return (
    <WishlistContext.Provider value={{
      wishlistIds, wishlistProducts, loading,
      addToWishlist, removeFromWishlist, toggleWishlist, isInWishlist, refetch: fetchWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  )
}
