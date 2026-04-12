import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useCategories } from '../../hooks/useCategories'
import ImageUploader from './ImageUploader'
import toast from 'react-hot-toast'
import { Save, X } from 'lucide-react'

const ProductForm = ({ product, onSave, onCancel }) => {
  const { categories } = useCategories()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    product_name: '',
    category_id: '',
    product_code: '',
    image_url: '',
    stock: 0,
    price: 0,
  })

  useEffect(() => {
    if (product) {
      setForm({
        product_name: product.product_name || '',
        category_id: product.category_id || '',
        product_code: product.product_code || '',
        image_url: product.image_url || '',
        stock: product.stock || 0,
        price: product.price || 0,
      })
    }
  }, [product])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (product) {
        // Update
        const { error } = await supabase
          .from('products')
          .update(form)
          .eq('id', product.id)
        if (error) throw error
        toast.success('Product updated!')
      } else {
        // Insert
        const { error } = await supabase.from('products').insert([form])
        if (error) throw error
        toast.success('Product added!')
      }
      onSave()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">
        {product ? 'Edit Product' : 'Add New Product'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <ImageUploader
          currentImage={form.image_url}
          onUpload={(url) => setForm({ ...form, image_url: url })}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name *
            </label>
            <input
              type="text"
              required
              value={form.product_name}
              onChange={(e) =>
                setForm({ ...form, product_name: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Code *
            </label>
            <input
              type="text"
              required
              value={form.product_code}
              onChange={(e) =>
                setForm({ ...form, product_code: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select
              required
              value={form.category_id}
              onChange={(e) =>
                setForm({ ...form, category_id: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.category_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price (₹) *
            </label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={form.price}
              onChange={(e) =>
                setForm({ ...form, price: parseFloat(e.target.value) })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stock *
            </label>
            <input
              type="number"
              required
              min="0"
              value={form.stock}
              onChange={(e) =>
                setForm({ ...form, stock: parseInt(e.target.value) })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex space-x-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center space-x-2 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition"
          >
            <Save className="h-4 w-4" />
            <span>{loading ? 'Saving...' : 'Save Product'}</span>
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center space-x-2 bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            <X className="h-4 w-4" />
            <span>Cancel</span>
          </button>
        </div>
      </form>
    </div>
  )
}

export default ProductForm