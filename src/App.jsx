import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'

// Layouts
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import AdminSidebar from './components/admin/AdminSidebar'
import ProtectedRoute from './components/common/ProtectedRoute'

// Public Pages
import Home from './pages/public/Home'
import Products from './pages/public/Products'
import ProductDetail from './pages/public/ProductDetail'
import Cart from './pages/public/Cart'
import Login from './pages/public/Login'
import Register from './pages/public/Register'
import Profile from './pages/public/Profile'

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin'
import Dashboard from './pages/admin/Dashboard'
import ManageProducts from './pages/admin/ManageProducts'
import ManageCategories from './pages/admin/ManageCategories'
import ManageStock from './pages/admin/ManageStock'

// Public Layout
const PublicLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
)

// Admin Layout
const AdminLayout = ({ children }) => (
  <ProtectedRoute>
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 p-8">{children}</main>
    </div>
  </ProtectedRoute>
)

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Toaster position="top-right" />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
            <Route path="/products" element={<PublicLayout><Products /></PublicLayout>} />
            <Route path="/products/:id" element={<PublicLayout><ProductDetail /></PublicLayout>} />
            <Route path="/cart" element={<PublicLayout><Cart /></PublicLayout>} />
            <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
            <Route path="/register" element={<PublicLayout><Register /></PublicLayout>} />
            <Route path="/profile" element={<PublicLayout><Profile /></PublicLayout>} />

            {/* Admin Login (no layout) */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Admin Routes (protected) */}
            <Route path="/admin" element={<AdminLayout><Dashboard /></AdminLayout>} />
            <Route path="/admin/products" element={<AdminLayout><ManageProducts /></AdminLayout>} />
            <Route path="/admin/categories" element={<AdminLayout><ManageCategories /></AdminLayout>} />
            <Route path="/admin/stock" element={<AdminLayout><ManageStock /></AdminLayout>} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  )
}

export default App