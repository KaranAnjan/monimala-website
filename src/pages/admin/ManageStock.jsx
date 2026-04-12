import { useProducts } from '../../hooks/useProducts'
import StockUpdate from '../../components/admin/StockUpdate'
import Loading from '../../components/common/Loading'
import { Package } from 'lucide-react'
import { getImageUrl } from '../../lib/supabaseClient'

const ManageStock = () => {
  const { products, loading, refetch } = useProducts()

  if (loading) return <Loading />

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Stock Management
      </h1>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Stock Control
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    {product.image_url ? (
                      <img
                        src={getImageUrl(product.image_url)}
                        alt=""
                        className="h-10 w-10 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Package className="h-5 w-5 text-gray-300" />
                      </div>
                    )}
                    <span className="font-medium">{product.product_name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 font-mono text-sm text-gray-500">
                  {product.product_code}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      product.stock > 10
                        ? 'bg-green-100 text-green-700'
                        : product.stock > 0
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {product.stock > 10
                      ? 'In Stock'
                      : product.stock > 0
                      ? 'Low Stock'
                      : 'Out of Stock'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <StockUpdate product={product} onUpdate={refetch} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ManageStock