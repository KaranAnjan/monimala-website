import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import toast from 'react-hot-toast'
import { Minus, Plus } from 'lucide-react'

const StockUpdate = ({ product, onUpdate }) => {
  const [quantity, setQuantity] = useState(0)

  const updateStock = async (newStock) => {
    if (newStock < 0) return

    try {
      const { error } = await supabase
        .from('products')
        .update({ stock: newStock })
        .eq('id', product.id)

      if (error) throw error
      toast.success(`Stock updated to ${newStock}`)
      onUpdate()
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className="flex items-center space-x-3">
      <span className="font-mono text-lg font-bold w-12 text-center">
        {product.stock}
      </span>
      <div className="flex items-center space-x-1">
        <button
          onClick={() => updateStock(product.stock - 1)}
          className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition"
        >
          <Minus className="h-4 w-4" />
        </button>
        <button
          onClick={() => updateStock(product.stock + 1)}
          className="p-1 bg-green-100 text-green-600 rounded hover:bg-green-200 transition"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <input
        type="number"
        min="0"
        value={quantity}
        onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
        className="w-20 px-2 py-1 border rounded text-center"
        placeholder="Set"
      />
      <button
        onClick={() => updateStock(quantity)}
        className="text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded hover:bg-indigo-200"
      >
        Set
      </button>
    </div>
  )
}

export default StockUpdate