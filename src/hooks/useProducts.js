import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export const useProducts = (categoryId = null) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchProducts = async () => {
    try {
      setLoading(true)
      let query = supabase
        .from('products')
        .select(`*, categories(category_name)`)
        .order('created_at', { ascending: false })

      if (categoryId) {
        query = query.eq('category_id', categoryId)
      }

      const { data, error } = await query
      if (error) throw error
      setProducts(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [categoryId])

  return { products, loading, error, refetch: fetchProducts }
}

export const useProduct = (id) => {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`*, categories(category_name)`)
        .eq('id', id)
        .single()

      if (!error) setProduct(data)
      setLoading(false)
    }
    if (id) fetchProduct()
  }, [id])

  return { product, loading }
}