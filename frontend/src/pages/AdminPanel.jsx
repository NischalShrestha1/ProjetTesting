import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectToken } from '../store/slices/userSlice'
import axios from 'axios'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import { Bar, Pie } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)
ChartJS.register(ArcElement, Tooltip, Legend)

const SalesChart = ({ orders }) => {
  if (!orders || orders.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center bg-gray-50 rounded border-2 border-dashed border-gray-300">
        <div className="text-center">
          <p className="text-gray-500">No sales data available</p>
        </div>
      </div>
    )
  }

  // Group orders by month
  const monthlyData = orders.reduce((acc, order) => {
    if (!order.createdAt) return acc
    const month = new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    if (!acc[month]) acc[month] = 0
    acc[month] += order.total || 0
    return acc
  }, {})

  const labels = Object.keys(monthlyData)
  const data = Object.values(monthlyData)

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Monthly Sales',
        data: data,
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Sales Overview',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '$' + value.toFixed(0)
          }
        }
      }
    }
  }

  return (
    <div className="h-64">
      <Bar data={chartData} options={options} />
    </div>
  )
}

const CategoryChart = ({ products, categories }) => {
  if (!products || !categories || products.length === 0 || categories.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center bg-gray-50 rounded border-2 border-dashed border-gray-300">
        <div className="text-center">
          <p className="text-gray-500">No category data available</p>
        </div>
      </div>
    )
  }

  // Count products by category
  const categoryData = categories.map(category => {
    const count = products.filter(product => 
      product.category === category._id || product.category?._id === category._id
    ).length
    return { name: category.name, count }
  })

  const labels = categoryData.map(cat => cat.name)
  const data = categoryData.map(cat => cat.count)
  const colors = [
    'rgba(59, 130, 246, 0.8)',
    'rgba(16, 185, 129, 0.8)',
    'rgba(245, 158, 11, 0.8)',
    'rgba(239, 68, 68, 0.8)',
    'rgba(139, 92, 246, 0.8)',
    'rgba(236, 72, 153, 0.8)'
  ]

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Products by Category',
        data: data,
        backgroundColor: colors,
        borderColor: colors.map(color => color.replace('0.8', '1')),
        borderWidth: 1,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'Product Distribution',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || ''
            const value = context.parsed || 0
            const total = context.dataset.data.reduce((a, b) => a + b, 0)
            const percentage = ((value / total) * 100).toFixed(1)
            return `${label}: ${value} (${percentage}%)`
          }
        }
      }
    }
  }

  return (
    <div className="h-64">
      <Pie data={chartData} options={options} />
    </div>
  )
}

const backendUrl = "https://animerch-gjcd.onrender.com/api";

export default function AdminPanel({ products: initialProducts, categories: initialCategories, user }) {
  const token = useSelector(selectToken)

  // Helper function for authenticated API calls
  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    withCredentials: true
  }

  const [activeTab, setActiveTab] = useState('dashboard')
  const [products, setProducts] = useState(initialProducts || [])
  const [categories, setCategories] = useState(initialCategories || [])
  const [orders, setOrders] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [dashboardStats, setDashboardStats] = useState({})
  const [categorySearch, setCategorySearch] = useState('')
  
  // Form visibility states
  const [showProductForm, setShowProductForm] = useState(false)
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  
  // Fetch orders and users data
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${backendUrl}/orders/admin/all`, authConfig)
        setOrders(response.data.orders || response.data || [])
      } catch (error) {
        console.error('Error fetching orders:', error)
      }
    }
    
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${backendUrl}/users`, authConfig)
        setUsers(response.data.users || response.data || [])
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }
    
    if (token) {
      fetchOrders()
      fetchUsers()
    }
  }, [token])
  
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

  const handleProductSubmit = async (e) => {
    e.preventDefault()
    try {
      const productData = {
        ...productForm,
        price: parseFloat(productForm.price),
        rating: parseFloat(productForm.rating),
        tags: productForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        category: productForm.categoryId // Backend expects 'category', not 'categoryId'
      }
      
      // Remove categoryId as it's not needed in the backend
      delete productData.categoryId
      
      if (productForm._id) {
        // Update existing product
        await axios.put(`${backendUrl}/products/${productForm._id}`, productData, authConfig)
        console.log('Product updated successfully')
      } else {
        // Create new product
        await axios.post(`${backendUrl}/products`, productData, authConfig)
        console.log('Product created successfully')
      }
      
      // Refresh products list
      const response = await axios.get(`${backendUrl}/products`)
      setProducts(response.data.products || response.data || [])
      
      // Reset form and hide
      setProductForm({
        name: '',
        price: '',
        description: '',
        categoryId: '',
        image: '',
        rating: '5',
        tags: ''
      })
      setShowProductForm(false)
    } catch (error) {
      console.error('Error saving product:', error)
      console.error('Error details:', error.response?.data)
      alert(`Error: ${error.response?.data?.error || error.message}`)
    }
  }

  const handleCategorySubmit = async (e) => {
    e.preventDefault()
    try {
      // Generate ID if not provided
      const categoryData = {
        ...categoryForm,
        id: categoryForm.id || (categoryForm.name && categoryForm.name.toLowerCase().replace(/\s+/g, '-'))
      }
      
      if (categoryForm._id) {
        // Update existing category
        await axios.put(`${backendUrl}/categories/${categoryForm._id}`, categoryData, authConfig)
        console.log('Category updated successfully')
      } else {
        // Create new category
        await axios.post(`${backendUrl}/categories`, categoryData, authConfig)
        console.log('Category created successfully')
      }
      
      // Refresh categories list
      const response = await axios.get(`${backendUrl}/categories`)
      setCategories(response.data.categories || response.data || [])
      
      // Reset form and hide
      setCategoryForm({ id: '', name: '', image: '', description: '' })
      setShowCategoryForm(false)
    } catch (error) {
      console.error('Error saving category:', error)
      console.error('Error details:', error.response?.data)
      alert(`Error: ${error.response?.data?.error || error.message}`)
    }
  }

  const editProduct = (product) => {
    setProductForm({
      _id: product._id || product.id,
      name: product.name,
      price: product.price.toString(),
      description: product.description,
      categoryId: product.categoryId || product.category,
      image: product.image,
      rating: product.rating?.toString() || '5',
      tags: Array.isArray(product.tags) ? product.tags.join(', ') : ''
    })
    setActiveTab('products')
    setShowProductForm(true)
  }

  const editCategory = (category) => {
    setCategoryForm({
      _id: category._id || category.id,
      id: category.id,
      name: category.name,
      image: category.image,
      description: category.description || ''
    })
    setActiveTab('categories')
    setShowCategoryForm(true)
  }

  const deleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`${backendUrl}/products/${id}`, authConfig)
        setProducts(products.filter(p => p._id !== id && p.id !== id))
      } catch (error) {
        console.error('Error deleting product:', error)
      }
    }
  }

  const deleteCategory = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await axios.delete(`${backendUrl}/categories/${id}`, authConfig)
        setCategories(categories.filter(c => c._id !== id && c.id !== id))
      } catch (error) {
        console.error('Error deleting category:', error)
      }
    }
  }

  const deleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`${backendUrl}/users/${id}`, authConfig)
        setUsers(users.filter(u => u._id !== id && u.id !== id))
      } catch (error) {
        console.error('Error deleting user:', error)
      }
    }
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await axios.put(`${backendUrl}/orders/${orderId}/status`, { status: newStatus }, authConfig)
      setOrders(orders.map(order => 
        order._id === orderId ? response.data.order : order
      ))
    } catch (error) {
      console.error('Error updating order status:', error)
    }
  }

  const [userForm, setUserForm] = useState({
    _id: '',
    firstname: '',
    lastname: '',
    username: '',
    email: '',
    address: '',
    phone: '',
    isAdmin: false
  })

  const editUser = (user) => {
    setUserForm({
      _id: user._id || user.id,
      firstname: user.firstname || '',
      lastname: user.lastname || '',
      username: user.username || '',
      email: user.email,
      address: user.address || '',
      phone: user.phone || '',
      isAdmin: user.isAdmin || false
    })
  }

  const handleUserSubmit = async (e) => {
    e.preventDefault()
    try {
      if (userForm._id) {
        // Update existing user - exclude password field
        const updateData = {
          firstname: userForm.firstname,
          lastname: userForm.lastname,
          username: userForm.username,
          email: userForm.email,
          address: userForm.address,
          phone: userForm.phone,
          isAdmin: userForm.isAdmin
        }
        
        await axios.put(`${backendUrl}/users/${userForm._id}`, updateData, authConfig)
        console.log('User updated successfully')
        
        // Refresh users list
        const response = await axios.get(`${backendUrl}/users`, authConfig)
        setUsers(response.data.users || response.data || [])
        
        // Reset form and hide
        setUserForm({ 
          _id: '', 
          firstname: '', 
          lastname: '', 
          username: '', 
          email: '', 
          address: '', 
          phone: '', 
          isAdmin: false 
        })
      }
    } catch (error) {
      console.error('Error updating user:', error)
      console.error('Error details:', error.response?.data)
      alert(`Error: ${error.response?.data?.message || error.response?.data?.error || error.message}`)
    }
  }

  // Check if user is authenticated as admin
  if (!user || !user.isAdmin) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-8">
            <h1 className="text-3xl font-bold text-gray-800">Admin Access Required</h1>
            <p className="text-gray-600">Please login as an administrator to access this page.</p>
            <Link to="/" className="bg-primary text-white px-4 py-2 rounded hover:bg-pink-600 inline-block mt-4">
              Back to Store
            </Link>
          </div>
        </div>
      </div>
    )
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
                
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-600 text-sm font-medium">Total Products</p>
                        <p className="text-3xl font-bold text-blue-900">{products.length}</p>
                      </div>
                      <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4M4 7v10l-8 4M4 7h16" />
                      </svg>
                    </div>
                  </div>
                  <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-600 text-sm font-medium">Total Categories</p>
                        <p className="text-3xl font-bold text-green-900">{categories.length}</p>
                      </div>
                      <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 00-2 2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-600 text-sm font-medium">Total Orders</p>
                        <p className="text-3xl font-bold text-purple-900">{orders.length}</p>
                      </div>
                      <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                  </div>
                  <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-orange-600 text-sm font-medium">Total Users</p>
                        <p className="text-3xl font-bold text-orange-900">{users.length}</p>
                      </div>
                      <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold mb-4">Sales Overview</h3>
                    <SalesChart orders={orders} />
                  </div>
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold mb-4">Product Categories</h3>
                    <CategoryChart products={products} categories={categories} />
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4M4 7v10l-8 4M4 7h16" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium">New product added</p>
                          <p className="text-xs text-gray-500">2 minutes ago</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium">New order received</p>
                          <p className="text-xs text-gray-500">15 minutes ago</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium">New user registered</p>
                          <p className="text-xs text-gray-500">1 hour ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">All Orders</h2>
                
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Search orders..."
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white">
                    <thead>
                      <tr>
                        <th className="py-2 px-4 border-b">Order ID</th>
                        <th className="py-2 px-4 border-b">Customer</th>
                        <th className="py-2 px-4 border-b">Date</th>
                        <th className="py-2 px-4 border-b">Total</th>
                        <th className="py-2 px-4 border-b">Status</th>
                        <th className="py-2 px-4 border-b">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(order => (
                        <tr key={order._id || order.id}>
                          <td className="py-2 px-4 border-b">#{(order._id || order.id)?.slice(-6).toUpperCase()}</td>
                          <td className="py-2 px-4 border-b">
                            {order.user?.username || 
                             `${order.user?.firstname || ''} ${order.user?.lastname || ''}`.trim() || 
                             'N/A'}
                          </td>
                          <td className="py-2 px-4 border-b">
                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="py-2 px-4 border-b">${order.totalPrice?.toFixed(2) || '0.00'}</td>
                          <td className="py-2 px-4 border-b">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                              order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                              order.status === 'Shipped' ? 'bg-yellow-100 text-yellow-800' :
                              order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {order.status || 'Processing'}
                            </span>
                          </td>
                          <td className="py-2 px-4 border-b space-x-2">
                            <select 
                              value={order.status || 'Processing'}
                              onChange={(e) => updateOrderStatus(order._id || order.id, e.target.value)}
                              className="text-sm border rounded px-2 py-1"
                            >
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {orders.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No orders found
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Users Management</h2>
                
                {/* Edit User Form */}
                {userForm._id && (
                  <div className="bg-gray-50 p-6 rounded-lg mb-6">
                    <h3 className="text-lg font-medium mb-4">Edit User</h3>
                  <form onSubmit={handleUserSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                        <input
                          type="text"
                          value={userForm.firstname}
                          onChange={(e) => setUserForm({...userForm, firstname: e.target.value})}
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                        <input
                          type="text"
                          value={userForm.lastname}
                          onChange={(e) => setUserForm({...userForm, lastname: e.target.value})}
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        <input
                          type="text"
                          value={userForm.username}
                          onChange={(e) => setUserForm({...userForm, username: e.target.value})}
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                          type="email"
                          value={userForm.email}
                          onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <input
                          type="text"
                          value={userForm.address}
                          onChange={(e) => setUserForm({...userForm, address: e.target.value})}
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input
                          type="text"
                          value={userForm.phone}
                          onChange={(e) => setUserForm({...userForm, phone: e.target.value})}
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={userForm.isAdmin}
                            onChange={(e) => setUserForm({...userForm, isAdmin: e.target.checked})}
                            className="mr-2"
                          />
                          <span className="text-sm font-medium text-gray-700">Admin Role</span>
                        </label>
                      </div>
                      <div className="md:col-span-2 flex space-x-2">
                        <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
                          Update User
                        </button>
                        <button 
                          type="button"
                          onClick={() => setUserForm({ 
                            _id: '', 
                            firstname: '', 
                            lastname: '', 
                            username: '', 
                            email: '', 
                            address: '', 
                            phone: '', 
                            isAdmin: false 
                          })}
                          className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                </div>
                )}
                
                {/* Users Table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white">
                    <thead>
                      <tr>
                        <th className="py-2 px-4 border-b">Name</th>
                        <th className="py-2 px-4 border-b">Email</th>
                        <th className="py-2 px-4 border-b">Role</th>
                        <th className="py-2 px-4 border-b">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(user => (
                        <tr key={user._id || user.id}>
                          <td className="py-2 px-4 border-b">
                            {user.firstname && user.lastname ? `${user.firstname} ${user.lastname}` : 
                             user.firstname || user.lastname || user.username || user.email}
                          </td>
                          <td className="py-2 px-4 border-b">{user.email}</td>
                          <td className="py-2 px-4 border-b">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              user.isAdmin ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {user.isAdmin ? 'Admin' : 'User'}
                            </span>
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
                    <div className="text-center py-8 text-gray-500">
                      No users found
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'products' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Products Management</h2>
                  <button
                    onClick={() => {
                      setProductForm({
                        name: '',
                        price: '',
                        description: '',
                        categoryId: '',
                        image: '',
                        rating: '5',
                        tags: ''
                      })
                      setShowProductForm(true)
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Add New Product
                  </button>
                </div>
                
                {/* Add/Edit Product Form - Show when adding or editing */}
                {(showProductForm || productForm._id) && (
                  <div className="bg-gray-50 p-6 rounded-lg mb-6">
                    <h3 className="text-lg font-medium mb-4">
                      {productForm._id ? 'Edit Product' : 'Add New Product'}
                    </h3>
                  <form onSubmit={handleProductSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        value={productForm.name}
                        onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                      <input
                        type="number"
                        step="0.01"
                        value={productForm.price}
                        onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select
                        value={productForm.categoryId}
                        onChange={(e) => setProductForm({...productForm, categoryId: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map(category => (
                          <option key={category._id || category.id} value={category._id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        step="0.1"
                        value={productForm.rating}
                        onChange={(e) => setProductForm({...productForm, rating: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        value={productForm.description}
                        onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="3"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                      <input
                        type="text"
                        value={productForm.image}
                        onChange={(e) => setProductForm({...productForm, image: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
                      <input
                        type="text"
                        value={productForm.tags}
                        onChange={(e) => setProductForm({...productForm, tags: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="anime, manga, figure"
                      />
                    </div>
                    <div className="md:col-span-2 flex space-x-2">
                      <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
                        {productForm._id ? 'Update Product' : 'Add Product'}
                      </button>
                      <button 
                        type="button"
                        onClick={() => {
                          setProductForm({
                            name: '',
                            price: '',
                            description: '',
                            categoryId: '',
                            image: '',
                            rating: '5',
                            tags: ''
                          })
                          setShowProductForm(false)
                        }}
                        className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
                )}
                
                {/* Products Table */}
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
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Categories Management</h2>
                  <button
                    onClick={() => {
                      setCategoryForm({ id: '', name: '', image: '', description: '' })
                      setShowCategoryForm(true)
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Add New Category
                  </button>
                </div>
                
                {/* Add/Edit Category Form - Show when adding or editing */}
                {(showCategoryForm || categoryForm._id) && (
                  <div className="bg-gray-50 p-6 rounded-lg mb-6">
                    <h3 className="text-lg font-medium mb-4">
                      {categoryForm._id ? 'Edit Category' : 'Add New Category'}
                    </h3>
                  <form onSubmit={handleCategorySubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        value={categoryForm.name}
                        onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
                      <input
                        type="text"
                        value={categoryForm.id}
                        onChange={(e) => setCategoryForm({...categoryForm, id: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="auto-generated if empty"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        value={categoryForm.description}
                        onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="3"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                      <input
                        type="text"
                        value={categoryForm.image}
                        onChange={(e) => setCategoryForm({...categoryForm, image: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="md:col-span-2 flex space-x-2">
                      <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
                        {categoryForm._id ? 'Update Category' : 'Add Category'}
                      </button>
                      <button 
                        type="button"
                        onClick={() => {
                          setCategoryForm({ id: '', name: '', image: '', description: '' })
                          setShowCategoryForm(false)
                        }}
                        className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
                )}
                
                {/* Categories Table */}
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
                            {typeof category.image === 'string' && category.image && (
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
          </div>
        </div>
      </div>
    </div>
    )
}
