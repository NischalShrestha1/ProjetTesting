import { useState, useEffect } from 'react'
import React from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js'
import { Bar, Pie, Line } from 'react-chartjs-2'

const backendUrl = "http://localhost:5000/api";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

export default function AdminPanel({ products: initialProducts, categories: initialCategories }) {
  console.log('AdminPanel - initialProducts:', initialProducts);
  console.log('AdminPanel - initialCategories:', initialCategories);
  
  const [activeTab, setActiveTab] = useState('dashboard')
  const [products, setProducts] = useState(initialProducts || [])
  const [categories, setCategories] = useState(initialCategories || [])
  const [orders, setOrders] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [dashboardStats, setDashboardStats] = useState({})
  
  // Form states
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    description: '',
    categoryId: '',
    image: '',
    rating: '5',
    tags: ''
  })
  
  const [categoryForm, setCategoryForm] = useState({
    id: '',
    name: '',
    image: '',
    description: ''
  })

  // Load data from backend
  useEffect(() => {
    loadOrders();
    loadUsers();
    loadDashboardStats();
  }, [])

  const loadOrders = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/orders/admin/all`, {
        withCredentials: true
      });
      setOrders(data.orders || data);
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  // Calculate statistics
  const stats = {
    totalProducts: products.length,
    totalCategories: categories.length,
    totalOrders: dashboardStats.stats?.totalOrders || orders.length,
    totalUsers: dashboardStats.stats?.totalUsers || users.length,
    totalRevenue: dashboardStats.stats?.totalRevenue || 
      orders.reduce((sum, order) => sum + (order.totalPrice || order.totalAmount || 0), 0),
    averageOrderValue: orders.length > 0 ? 
      (dashboardStats.stats?.totalRevenue || 0) / orders.length : 
      (orders.reduce((sum, order) => sum + (order.totalPrice || order.totalAmount || 0), 0) / orders.length)
  };

  // Prepare chart data
  const categoryData = dashboardStats.categoryStats?.length > 0 ? dashboardStats.categoryStats : 
    categories.map(category => ({
      name: category.name,
      count: products.filter(product => product.category?._id === category._id || product.category === category._id).length
    }));

  const salesData = dashboardStats.monthlyStats?.length > 0 ? dashboardStats.monthlyStats.map(stat => ({
    month: new Date(stat._id + '-01').toLocaleDateString('en-US', { month: 'short' }),
    sales: stat.revenue,
    orders: stat.orders
  })) : [];

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const loadUsers = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/users`, {
        withCredentials: true
      });
      setUsers(data.filter(user => !user.isAdmin)); // Only show non-admin users
    } catch (error) {
      console.error('Error loading users:', error);
    }
  }

  const loadDashboardStats = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/stats`, {
        withCredentials: true
      });
      setDashboardStats(data);
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    }
  }

  const handleProductSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const productData = {
        ...productForm,
        price: parseFloat(productForm.price),
        rating: parseFloat(productForm.rating),
        tags: productForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      }

      if (productForm._id) {
        // Update existing product
        await axios.put(`${backendUrl}/api/products/${productForm._id}`, productData, {
          withCredentials: true
        });
      } else {
        // Create new product
        await axios.post(`${backendUrl}/api/products`, productData, {
          withCredentials: true
        });
      }

      // Refresh products list
      window.location.reload();
      
      setProductForm({
        name: '',
        price: '',
        description: '',
        categoryId: '',
        image: '',
        rating: '5',
        tags: ''
      })
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product');
    } finally {
      setLoading(false)
    }
  }

  const handleCategorySubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const categoryData = {
        id: categoryForm.id || categoryForm.name.toLowerCase().replace(/\s+/g, '-'),
        name: categoryForm.name,
        image: categoryForm.image,
        description: categoryForm.description
      }

      if (categoryForm._id) {
        // Update existing category
        await axios.put(`${backendUrl}/api/categories/${categoryForm._id}`, categoryData, {
          withCredentials: true
        });
      } else {
        // Create new category
        await axios.post(`${backendUrl}/api/categories`, categoryData, {
          withCredentials: true
        });
      }

      // Refresh categories list
      window.location.reload();
      
      setCategoryForm({ id: '', name: '', image: '', description: '' })
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Error saving category');
    } finally {
      setLoading(false)
    }
  }

  const deleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`${backendUrl}/api/products/${id}`, {
          withCredentials: true
        });
        setProducts(products.filter(p => p._id !== id || p.id !== id))
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product');
      }
    }
  }

  const deleteCategory = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await axios.delete(`${backendUrl}/api/categories/${id}`, {
          withCredentials: true
        });
        setCategories(categories.filter(c => c._id !== id || c.id !== id))
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('Error deleting category');
      }
    }
  }

  const editProduct = (product) => {
    setProductForm({
      _id: product._id,
      name: product.name,
      price: product.price.toString(),
      description: product.description,
      categoryId: product.categoryId || (product.category && product.category._id),
      image: product.image,
      rating: product.rating?.toString() || '5',
      tags: Array.isArray(product.tags) ? product.tags.join(', ') : ''
    })
    setActiveTab('products')
  }

  const editCategory = (category) => {
    setCategoryForm({
      _id: category._id,
      id: category.id,
      name: category.name,
      image: category.image,
      description: category.description || ''
    })
    setActiveTab('categories')
  }

  const deleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`${backendUrl}/api/users/${id}`, {
          withCredentials: true
        });
        setUsers(users.filter(u => u._id !== id || u.id !== id))
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error deleting user');
      }
    }
  }

  const editUser = (user) => {
    const newEmail = prompt('Enter new email:', user.email);
    if (newEmail && newEmail !== user.email) {
      updateUser(user._id || user.id, { email: newEmail });
    }
  }

  const updateUser = async (id, userData) => {
    try {
      await axios.put(`${backendUrl}/api/users/${id}`, userData, {
        withCredentials: true
      });
      loadUsers(); // Refresh users list
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Error updating user');
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <Link to="/" className="bg-primary text-white px-4 py-2 rounded hover:bg-pink-600">
            Back to Store
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="flex border-b flex-wrap">
            <button
              className={`px-6 py-3 font-medium ${activeTab === 'dashboard' ? 'text-primary border-b-2 border-primary' : 'text-gray-600'}`}
              onClick={() => setActiveTab('dashboard')}
            >
              Dashboard
            </button>
            <button
              className={`px-6 py-3 font-medium ${activeTab === 'products' ? 'text-primary border-b-2 border-primary' : 'text-gray-600'}`}
              onClick={() => setActiveTab('products')}
            >
              Products ({products.length})
            </button>
            <button
              className={`px-6 py-3 font-medium ${activeTab === 'categories' ? 'text-primary border-b-2 border-primary' : 'text-gray-600'}`}
              onClick={() => setActiveTab('categories')}
            >
              Categories ({categories.length})
            </button>
            <button
              className={`px-6 py-3 font-medium ${activeTab === 'orders' ? 'text-primary border-b-2 border-primary' : 'text-gray-600'}`}
              onClick={() => setActiveTab('orders')}
            >
              Orders ({orders.length})
            </button>
            <button
              className={`px-6 py-3 font-medium ${activeTab === 'users' ? 'text-primary border-b-2 border-primary' : 'text-gray-600'}`}
              onClick={() => setActiveTab('users')}
            >
              Users ({users.length})
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'dashboard' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
                
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading dashboard data...</p>
                  </div>
                ) : (
                  <div>
                    <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Backend Status:</strong> Connected to real data API
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        Products: {stats.totalProducts} | Categories: {stats.totalCategories} | 
                        Orders: {stats.totalOrders} | Users: {stats.totalUsers}
                      </p>
                    </div>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-600 text-sm font-medium">Total Products</p>
                        <p className="text-3xl font-bold text-blue-900">{stats.totalProducts}</p>
                      </div>
                      <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              )}
              {activeTab === 'products' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  {productForm._id ? 'Edit Product' : 'Add New Product'}
                </h2>
                <form onSubmit={handleProductSubmit} className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={productForm.name}
                      onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                      className="w-full px-3 py-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                    <input
                      type="number"
                      value={productForm.price}
                      onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                      className="w-full px-3 py-2 border rounded"
                      step="0.01"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={productForm.categoryId}
                      onChange={(e) => setProductForm({...productForm, categoryId: e.target.value})}
                      className="w-full px-3 py-2 border rounded"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat._id || cat.id} value={cat._id || cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                    <input
                      type="text"
                      value={productForm.image}
                      onChange={(e) => setProductForm({...productForm, image: e.target.value})}
                      className="w-full px-3 py-2 border rounded"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={productForm.description}
                      onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                      className="w-full px-3 py-2 border rounded"
                      rows="3"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rating (0-5)</label>
                    <input
                      type="number"
                      value={productForm.rating}
                      onChange={(e) => setProductForm({...productForm, rating: e.target.value})}
                      className="w-full px-3 py-2 border rounded"
                      min="0"
                      max="5"
                      step="0.1"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
                    <input
                      type="text"
                      value={productForm.tags}
                      onChange={(e) => setProductForm({...productForm, tags: e.target.value})}
                      className="w-full px-3 py-2 border rounded"
                      placeholder="anime, manga, action"
                    />
                  </div>
                  <div className="md:col-span-2 flex justify-end space-x-3">
                    {productForm._id && (
                      <button
                        type="button"
                        onClick={() => setProductForm({
                          name: '', price: '', description: '', categoryId: '', image: '', rating: '5', tags: ''
                        })}
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-primary text-white rounded hover:bg-pink-600 disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : (productForm._id ? 'Update Product' : 'Add Product')}
                    </button>
                  </div>
                </form>

                <h2 className="text-xl font-semibold mb-4">All Products</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white">
                    <thead>
                      <tr>
                        <th className="py-2 px-4 border-b">Name</th>
                        <th className="py-2 px-4 border-b">Price</th>
                        <th className="py-2 px-4 border-b">Category</th>
                        <th className="py-2 px-4 border-b">Rating</th>
                        <th className="py-2 px-4 border-b">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map(product => (
                        <tr key={product._id || product.id}>
                          <td className="py-2 px-4 border-b">{product.name}</td>
                          <td className="py-2 px-4 border-b">${product.price.toFixed(2)}</td>
                          <td className="py-2 px-4 border-b">
                            {product.category?.name || 'N/A'}
                          </td>
                          <td className="py-2 px-4 border-b">{product.rating || 'N/A'}</td>
                          <td className="py-2 px-4 border-b space-x-2">
                            <button
                              onClick={() => editProduct(product)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteProduct(product._id || product.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'categories' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  {categoryForm._id ? 'Edit Category' : 'Add New Category'}
                </h2>
                <form onSubmit={handleCategorySubmit} className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={categoryForm.name}
                      onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
                      className="w-full px-3 py-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ID (slug)</label>
                    <input
                      type="text"
                      value={categoryForm.id}
                      onChange={(e) => setCategoryForm({...categoryForm, id: e.target.value})}
                      className="w-full px-3 py-2 border rounded"
                      placeholder="category-slug"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                    <input
                      type="text"
                      value={categoryForm.image}
                      onChange={(e) => setCategoryForm({...categoryForm, image: e.target.value})}
                      className="w-full px-3 py-2 border rounded"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={categoryForm.description}
                      onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})}
                      className="w-full px-3 py-2 border rounded"
                      rows="2"
                    />
                  </div>
                  <div className="md:col-span-2 flex justify-end space-x-3">
                    {categoryForm._id && (
                      <button
                        type="button"
                        onClick={() => setCategoryForm({ id: '', name: '', image: '', description: '' })}
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-primary text-white rounded hover:bg-pink-600 disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : (categoryForm._id ? 'Update Category' : 'Add Category')}
                    </button>
                  </div>
                </form>

                <h2 className="text-xl font-semibold mb-4">All Categories</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white">
                    <thead>
                      <tr>
                        <th className="py-2 px-4 border-b">Name</th>
                        <th className="py-2 px-4 border-b">ID</th>
                        <th className="py-2 px-4 border-b">Image</th>
                        <th className="py-2 px-4 border-b">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map(category => (
                        <tr key={category._id || category.id}>
                          <td className="py-2 px-4 border-b">{category.name}</td>
                          <td className="py-2 px-4 border-b">{category.id}</td>
                          <td className="py-2 px-4 border-b">
                            {category.image && (
                              <img src={category.image} alt={category.name} className="h-10 object-cover" />
                            )}
                          </td>
                          <td className="py-2 px-4 border-b space-x-2">
                            <button
                              onClick={() => editCategory(category)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteCategory(category._id || category.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Purchase Records</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white">
                    <thead>
                      <tr>
                        <th className="py-2 px-4 border-b">Order ID</th>
                        <th className="py-2 px-4 border-b">Customer</th>
                        <th className="py-2 px-4 border-b">Total</th>
                        <th className="py-2 px-4 border-b">Status</th>
                        <th className="py-2 px-4 border-b">Date</th>
                        <th className="py-2 px-4 border-b">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(order => (
                        <tr key={order._id || order.id}>
                          <td className="py-2 px-4 border-b">{order._id || order.id}</td>
                          <td className="py-2 px-4 border-b">
                            {order.user?.email || order.userId || 'Guest'}
                          </td>
                          <td className="py-2 px-4 border-b">${(order.totalPrice || order.totalAmount || 0).toFixed(2)}</td>
                          <td className="py-2 px-4 border-b">
                            <span className={`px-2 py-1 rounded text-xs ${
                              order.status === 'completed' ? 'bg-green-100 text-green-800' :
                              order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {order.status || 'pending'}
                            </span>
                          </td>
                          <td className="py-2 px-4 border-b">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-2 px-4 border-b">
                            <button className="text-blue-600 hover:text-blue-800">
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {orders.length === 0 && (
                    <p className="text-center text-gray-500 py-8">No orders found</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">User Management</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white">
                    <thead>
                      <tr>
                        <th className="py-2 px-4 border-b">Username</th>
                        <th className="py-2 px-4 border-b">Email</th>
                        <th className="py-2 px-4 border-b">Name</th>
                        <th className="py-2 px-4 border-b">Phone</th>
                        <th className="py-2 px-4 border-b">Joined</th>
                        <th className="py-2 px-4 border-b">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(user => (
                        <tr key={user._id || user.id}>
                          <td className="py-2 px-4 border-b">{user.username}</td>
                          <td className="py-2 px-4 border-b">{user.email}</td>
                          <td className="py-2 px-4 border-b">
                            {user.firstname} {user.lastname}
                          </td>
                          <td className="py-2 px-4 border-b">{user.phone || 'N/A'}</td>
                          <td className="py-2 px-4 border-b">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-2 px-4 border-b space-x-2">
                            <button
                              onClick={() => editUser(user)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteUser(user._id || user.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {users.length === 0 && (
                    <p className="text-center text-gray-500 py-8">No non-admin users found</p>
                  )}
                </div>

        </div>
      </div>
    </div>
   )
}
import { Bar, Pie, Line } from 'react-chartjs-2'

const backendUrl = "http://localhost:5000/api";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

export default function AdminPanel({ products: initialProducts, categories: initialCategories }) {
  console.log('AdminPanel - initialProducts:', initialProducts);
  console.log('AdminPanel - initialCategories:', initialCategories);
  
  const [activeTab, setActiveTab] = useState('dashboard')
  const [products, setProducts] = useState(initialProducts || [])
  const [categories, setCategories] = useState(initialCategories || [])
  const [orders, setOrders] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [dashboardStats, setDashboardStats] = useState({})
  
  // Form states
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    description: '',
    categoryId: '',
    image: '',
    rating: '5',
    tags: ''
  })
  
  const [categoryForm, setCategoryForm] = useState({
    id: '',
    name: '',
    image: '',
    description: ''
  })

  // Load data from backend
  useEffect(() => {
    loadOrders();
    loadUsers();
    loadDashboardStats();
  }, [])

  const loadOrders = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/orders/admin/all`, {
        withCredentials: true
      });
      setOrders(data.orders || data);
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  // Calculate statistics
  const stats = {
    totalProducts: products.length,
    totalCategories: categories.length,
    totalOrders: dashboardStats.stats?.totalOrders || orders.length,
    totalUsers: dashboardStats.stats?.totalUsers || users.length,
    totalRevenue: dashboardStats.stats?.totalRevenue || 
      orders.reduce((sum, order) => sum + (order.totalPrice || order.totalAmount || 0), 0),
    averageOrderValue: orders.length > 0 ? 
      (dashboardStats.stats?.totalRevenue || 0) / orders.length : 
      (orders.reduce((sum, order) => sum + (order.totalPrice || order.totalAmount || 0), 0) / orders.length)
  };

  // Prepare chart data
  const categoryData = dashboardStats.categoryStats?.length > 0 ? dashboardStats.categoryStats : 
    categories.map(category => ({
      name: category.name,
      count: products.filter(product => product.category?._id === category._id || product.category === category._id).length
    }));

  const salesData = dashboardStats.monthlyStats?.length > 0 ? dashboardStats.monthlyStats.map(stat => ({
    month: new Date(stat._id + '-01').toLocaleDateString('en-US', { month: 'short' }),
    sales: stat.revenue,
    orders: stat.orders
  })) : [];

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const loadUsers = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/users`, {
        withCredentials: true
      });
      setUsers(data.filter(user => !user.isAdmin)); // Only show non-admin users
    } catch (error) {
      console.error('Error loading users:', error);
    }
  }

  const loadDashboardStats = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/stats`, {
        withCredentials: true
      });
      setDashboardStats(data);
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    }
  }

  const handleProductSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const productData = {
        ...productForm,
        price: parseFloat(productForm.price),
        rating: parseFloat(productForm.rating),
        tags: productForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      }

      if (productForm._id) {
        // Update existing product
        await axios.put(`${backendUrl}/api/products/${productForm._id}`, productData, {
          withCredentials: true
        });
      } else {
        // Create new product
        await axios.post(`${backendUrl}/api/products`, productData, {
          withCredentials: true
        });
      }

      // Refresh products list
      window.location.reload();
      
      setProductForm({
        name: '',
        price: '',
        description: '',
        categoryId: '',
        image: '',
        rating: '5',
        tags: ''
      })
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product');
    } finally {
      setLoading(false)
    }
  }

  const handleCategorySubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const categoryData = {
        id: categoryForm.id || categoryForm.name.toLowerCase().replace(/\s+/g, '-'),
        name: categoryForm.name,
        image: categoryForm.image,
        description: categoryForm.description
      }

      if (categoryForm._id) {
        // Update existing category
        await axios.put(`${backendUrl}/api/categories/${categoryForm._id}`, categoryData, {
          withCredentials: true
        });
      } else {
        // Create new category
        await axios.post(`${backendUrl}/api/categories`, categoryData, {
          withCredentials: true
        });
      }

      // Refresh categories list
      window.location.reload();
      
      setCategoryForm({ id: '', name: '', image: '', description: '' })
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Error saving category');
    } finally {
      setLoading(false)
    }
  }

  const deleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`${backendUrl}/api/products/${id}`, {
          withCredentials: true
        });
        setProducts(products.filter(p => p._id !== id || p.id !== id))
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product');
      }
    }
  }

  const deleteCategory = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await axios.delete(`${backendUrl}/api/categories/${id}`, {
          withCredentials: true
        });
        setCategories(categories.filter(c => c._id !== id || c.id !== id))
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('Error deleting category');
      }
    }
  }

  const editProduct = (product) => {
    setProductForm({
      _id: product._id,
      name: product.name,
      price: product.price.toString(),
      description: product.description,
      categoryId: product.categoryId || (product.category && product.category._id),
      image: product.image,
      rating: product.rating?.toString() || '5',
      tags: Array.isArray(product.tags) ? product.tags.join(', ') : ''
    })
    setActiveTab('products')
  }

  const editCategory = (category) => {
    setCategoryForm({
      _id: category._id,
      id: category.id,
      name: category.name,
      image: category.image,
      description: category.description || ''
    })
    setActiveTab('categories')
  }

  const deleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`${backendUrl}/api/users/${id}`, {
          withCredentials: true
        });
        setUsers(users.filter(u => u._id !== id || u.id !== id))
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error deleting user');
      }
    }
  }

  const editUser = (user) => {
    const newEmail = prompt('Enter new email:', user.email);
    if (newEmail && newEmail !== user.email) {
      updateUser(user._id || user.id, { email: newEmail });
    }
  }

  const updateUser = async (id, userData) => {
    try {
      await axios.put(`${backendUrl}/api/users/${id}`, userData, {
        withCredentials: true
      });
      loadUsers(); // Refresh users list
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Error updating user');
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <Link to="/" className="bg-primary text-white px-4 py-2 rounded hover:bg-pink-600">
            Back to Store
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="flex border-b flex-wrap">
            <button
              className={`px-6 py-3 font-medium ${activeTab === 'dashboard' ? 'text-primary border-b-2 border-primary' : 'text-gray-600'}`}
              onClick={() => setActiveTab('dashboard')}
            >
              Dashboard
            </button>
            <button
              className={`px-6 py-3 font-medium ${activeTab === 'products' ? 'text-primary border-b-2 border-primary' : 'text-gray-600'}`}
              onClick={() => setActiveTab('products')}
            >
              Products ({products.length})
            </button>
            <button
              className={`px-6 py-3 font-medium ${activeTab === 'categories' ? 'text-primary border-b-2 border-primary' : 'text-gray-600'}`}
              onClick={() => setActiveTab('categories')}
            >
              Categories ({categories.length})
            </button>
            <button
              className={`px-6 py-3 font-medium ${activeTab === 'orders' ? 'text-primary border-b-2 border-primary' : 'text-gray-600'}`}
              onClick={() => setActiveTab('orders')}
            >
              Orders ({orders.length})
            </button>
            <button
              className={`px-6 py-3 font-medium ${activeTab === 'users' ? 'text-primary border-b-2 border-primary' : 'text-gray-600'}`}
              onClick={() => setActiveTab('users')}
            >
              Users ({users.length})
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'dashboard' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
                
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading dashboard data...</p>
                  </div>
                ) : (
                  <div>
                    <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Backend Status:</strong> Connected to real data API
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        Products: {stats.totalProducts} | Categories: {stats.totalCategories} | 
                        Orders: {stats.totalOrders} | Users: {stats.totalUsers}
                      </p>
                    </div>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-600 text-sm font-medium">Total Products</p>
                        <p className="text-3xl font-bold text-blue-900">{stats.totalProducts}</p>
                      </div>
                      <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              )}
              {activeTab === 'products' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  {productForm._id ? 'Edit Product' : 'Add New Product'}
                </h2>
                <form onSubmit={handleProductSubmit} className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={productForm.name}
                      onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                      className="w-full px-3 py-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                    <input
                      type="number"
                      value={productForm.price}
                      onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                      className="w-full px-3 py-2 border rounded"
                      step="0.01"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={productForm.categoryId}
                      onChange={(e) => setProductForm({...productForm, categoryId: e.target.value})}
                      className="w-full px-3 py-2 border rounded"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat._id || cat.id} value={cat._id || cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                    <input
                      type="text"
                      value={productForm.image}
                      onChange={(e) => setProductForm({...productForm, image: e.target.value})}
                      className="w-full px-3 py-2 border rounded"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={productForm.description}
                      onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                      className="w-full px-3 py-2 border rounded"
                      rows="3"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rating (0-5)</label>
                    <input
                      type="number"
                      value={productForm.rating}
                      onChange={(e) => setProductForm({...productForm, rating: e.target.value})}
                      className="w-full px-3 py-2 border rounded"
                      min="0"
                      max="5"
                      step="0.1"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
                    <input
                      type="text"
                      value={productForm.tags}
                      onChange={(e) => setProductForm({...productForm, tags: e.target.value})}
                      className="w-full px-3 py-2 border rounded"
                      placeholder="anime, manga, action"
                    />
                  </div>
                  <div className="md:col-span-2 flex justify-end space-x-3">
                    {productForm._id && (
                      <button
                        type="button"
                        onClick={() => setProductForm({
                          name: '', price: '', description: '', categoryId: '', image: '', rating: '5', tags: ''
                        })}
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-primary text-white rounded hover:bg-pink-600 disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : (productForm._id ? 'Update Product' : 'Add Product')}
                    </button>
                  </div>
                </form>

                <h2 className="text-xl font-semibold mb-4">All Products</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white">
                    <thead>
                      <tr>
                        <th className="py-2 px-4 border-b">Name</th>
                        <th className="py-2 px-4 border-b">Price</th>
                        <th className="py-2 px-4 border-b">Category</th>
                        <th className="py-2 px-4 border-b">Rating</th>
                        <th className="py-2 px-4 border-b">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map(product => (
                        <tr key={product._id || product.id}>
                          <td className="py-2 px-4 border-b">{product.name}</td>
                          <td className="py-2 px-4 border-b">${product.price.toFixed(2)}</td>
                          <td className="py-2 px-4 border-b">
                            {product.category?.name || 'N/A'}
                          </td>
                          <td className="py-2 px-4 border-b">{product.rating || 'N/A'}</td>
                          <td className="py-2 px-4 border-b space-x-2">
                            <button
                              onClick={() => editProduct(product)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteProduct(product._id || product.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'categories' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  {categoryForm._id ? 'Edit Category' : 'Add New Category'}
                </h2>
                <form onSubmit={handleCategorySubmit} className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={categoryForm.name}
                      onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
                      className="w-full px-3 py-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ID (slug)</label>
                    <input
                      type="text"
                      value={categoryForm.id}
                      onChange={(e) => setCategoryForm({...categoryForm, id: e.target.value})}
                      className="w-full px-3 py-2 border rounded"
                      placeholder="category-slug"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                    <input
                      type="text"
                      value={categoryForm.image}
                      onChange={(e) => setCategoryForm({...categoryForm, image: e.target.value})}
                      className="w-full px-3 py-2 border rounded"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={categoryForm.description}
                      onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})}
                      className="w-full px-3 py-2 border rounded"
                      rows="2"
                    />
                  </div>
                  <div className="md:col-span-2 flex justify-end space-x-3">
                    {categoryForm._id && (
                      <button
                        type="button"
                        onClick={() => setCategoryForm({ id: '', name: '', image: '', description: '' })}
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-primary text-white rounded hover:bg-pink-600 disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : (categoryForm._id ? 'Update Category' : 'Add Category')}
                    </button>
                  </div>
                </form>

                <h2 className="text-xl font-semibold mb-4">All Categories</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white">
                    <thead>
                      <tr>
                        <th className="py-2 px-4 border-b">Name</th>
                        <th className="py-2 px-4 border-b">ID</th>
                        <th className="py-2 px-4 border-b">Image</th>
                        <th className="py-2 px-4 border-b">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map(category => (
                        <tr key={category._id || category.id}>
                          <td className="py-2 px-4 border-b">{category.name}</td>
                          <td className="py-2 px-4 border-b">{category.id}</td>
                          <td className="py-2 px-4 border-b">
                            {category.image && (
                              <img src={category.image} alt={category.name} className="h-10 object-cover" />
                            )}
                          </td>
                          <td className="py-2 px-4 border-b space-x-2">
                            <button
                              onClick={() => editCategory(category)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteCategory(category._id || category.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Purchase Records</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white">
                    <thead>
                      <tr>
                        <th className="py-2 px-4 border-b">Order ID</th>
                        <th className="py-2 px-4 border-b">Customer</th>
                        <th className="py-2 px-4 border-b">Total</th>
                        <th className="py-2 px-4 border-b">Status</th>
                        <th className="py-2 px-4 border-b">Date</th>
                        <th className="py-2 px-4 border-b">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(order => (
                        <tr key={order._id || order.id}>
                          <td className="py-2 px-4 border-b">{order._id || order.id}</td>
                          <td className="py-2 px-4 border-b">
                            {order.user?.email || order.userId || 'Guest'}
                          </td>
                          <td className="py-2 px-4 border-b">${(order.totalPrice || order.totalAmount || 0).toFixed(2)}</td>
                          <td className="py-2 px-4 border-b">
                            <span className={`px-2 py-1 rounded text-xs ${
                              order.status === 'completed' ? 'bg-green-100 text-green-800' :
                              order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {order.status || 'pending'}
                            </span>
                          </td>
                          <td className="py-2 px-4 border-b">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-2 px-4 border-b">
                            <button className="text-blue-600 hover:text-blue-800">
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {orders.length === 0 && (
                    <p className="text-center text-gray-500 py-8">No orders found</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">User Management</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white">
                    <thead>
                      <tr>
                        <th className="py-2 px-4 border-b">Username</th>
                        <th className="py-2 px-4 border-b">Email</th>
                        <th className="py-2 px-4 border-b">Name</th>
                        <th className="py-2 px-4 border-b">Phone</th>
                        <th className="py-2 px-4 border-b">Joined</th>
                        <th className="py-2 px-4 border-b">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(user => (
                        <tr key={user._id || user.id}>
                          <td className="py-2 px-4 border-b">{user.username}</td>
                          <td className="py-2 px-4 border-b">{user.email}</td>
                          <td className="py-2 px-4 border-b">
                            {user.firstname} {user.lastname}
                          </td>
                          <td className="py-2 px-4 border-b">{user.phone || 'N/A'}</td>
                          <td className="py-2 px-4 border-b">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-2 px-4 border-b space-x-2">
                            <button
                              onClick={() => editUser(user)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteUser(user._id || user.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {users.length === 0 && (
                    <p className="text-center text-gray-500 py-8">No non-admin users found</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}