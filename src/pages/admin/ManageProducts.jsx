import { useState } from 'react'
import { useProducts } from '../../hooks/useProducts'
import { supabase } from '../../lib/supabaseClient'
import ProductForm from '../../components/admin/ProductForm'
import ProductTable from '../../components/admin/ProductTable'
import Loading from '../../components/common/Loading'
import toast from 'react-hot-toast'
import { Plus } from 'lucide-react'

const ManageProducts = () => {
  const { products, loading, refetch } = useProducts()
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  const handleEdit = (product) => {
    setEditingProduct(product)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return

    try {
      const { error } = await supabase.from('products').delete().eq('id', id)
      if (error) throw error
      toast.success('Product deleted!')
      refetch()
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleSave = () => {
    setShowForm(false)
    setEditingProduct(null)
    refetch()
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingProduct(null)
  }

  if (loading) return <Loading />

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Products</h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            <Plus className="h-4 w-4" />
            <span>Add Product</span>
          </button>
        )}
      </div>

      {showForm && (
        <div className="mb-6">
          <ProductForm
            product={editingProduct}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </div>
      )}

      <ProductTable
        products={products}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  )
}

export default ManageProducts