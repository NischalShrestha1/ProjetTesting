import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectUser, selectIsAuthenticated } from '../store'
import axios from 'axios'

const backendUrl = "https://animerch-gjcd.onrender.com/api"

const orderStages = [
  {
    name: 'Order Placed',
    key: 'placed',
    icon: '📝',
    description: 'Your order has been received'
  },
  {
    name: 'Processing',
    key: 'processing',
    icon: '⏳',
    description: 'Your order is being prepared'
  },
  {
    name: 'Shipped',
    key: 'shipped',
    icon: '📦',
    description: 'Your order is on its way'
  },
  {
    name: 'Delivered',
    key: 'delivered',
    icon: '✅',
    description: 'Your order has been delivered'
  }
]

export default function OrderTrackingPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const user = useSelector(selectUser)
  const isAuthenticated = useSelector(selectIsAuthenticated)
  
  console.log('📋 OrderTrackingPage: User state:', user)
  console.log('📋 OrderTrackingPage: Auth state:', isAuthenticated)
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    console.log('📋 OrderTrackingPage: useEffect triggered', { 
      isAuthenticated, 
      userId: user?.id,  // Note: user.id not user._id
      id 
    })
    if (isAuthenticated && user?.id) {
      console.log('📋 OrderTrackingPage: Conditions met, fetching order details')
      fetchOrderDetails()
    } else {
      console.log('📋 OrderTrackingPage: Conditions not met, setting loading false')
      setLoading(false)
    }
  }, [isAuthenticated, user, id])

  // Force fetch order details if we have an order ID
  useEffect(() => {
    if (id && !loading && !order && !error) {
      console.log('📋 OrderTrackingPage: Force fetching order details for ID:', id)
      fetchOrderDetails()
    }
  }, [id])

  const fetchOrderDetails = async () => {
    try {
      const token = localStorage.getItem('token')
      console.log('📋 OrderTrackingPage: Token:', token ? 'exists' : 'missing')
      console.log('📋 OrderTrackingPage: Order ID:', id)
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      }
      
      const response = await axios.get(`${backendUrl}/orders/${id}`, config)
      console.log('📋 OrderTrackingPage: API response:', response.data)
      console.log('📋 OrderTrackingPage: Order data:', response.data.order)
      setOrder(response.data.order)
      setLoading(false)
    } catch (error) {
      setError('Failed to fetch order details')
      setLoading(false)
    }
  }

  const getCurrentStage = (status) => {
    const statusMap = {
      'Processing': 'processing',
      'Shipped': 'shipped',
      'Delivered': 'delivered',
      'Cancelled': 'processing'
    }
    return statusMap[status] || 'placed'
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Please Login</h1>
            <p className="text-gray-600 mb-8">You need to login to track your order.</p>
            <button 
              onClick={() => navigate('/')}
              className="bg-primary hover:bg-pink-600 text-white px-6 py-2 rounded inline-block"
            >
              Back to Store
            </button>
          </div>
        </div>
      </div>
    )
  }

console.log('📋 OrderTrackingPage: Render state:', { loading, error, order })

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    console.log('📋 OrderTrackingPage: Error state:', error)
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
        <p className="text-gray-600">{error}</p>
      </div>
    )
  }

  if (!order) {
    console.log('📋 OrderTrackingPage: No order data')
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-600 mb-4">Order not found</h2>
        <button 
          onClick={() => navigate('/orders')}
          className="bg-primary hover:bg-pink-600 text-white font-bold py-2 px-6 rounded"
        >
          Back to Orders
        </button>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4 text-red-600">Order Not Found</h1>
            <p className="text-gray-600 mb-8">{error || 'This order could not be found.'}</p>
            <button 
              onClick={() => navigate('/orders')}
              className="bg-primary hover:bg-pink-600 text-white px-6 py-2 rounded inline-block"
            >
              View All Orders
            </button>
          </div>
        </div>
      </div>
    )
  }

  const currentStage = getCurrentStage(order.status)
  const isCancelled = order.status === 'Cancelled'

  return (
    <section className="py-12 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold font-anime mb-2">
                Order <span className="text-primary">#{order._id?.slice(-6).toUpperCase()}</span>
              </h1>
              <p className="text-gray-600">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-primary">${order.totalPrice?.toFixed(2) || '0.00'}</p>
            </div>
          </div>
        </div>

        {isCancelled ? (
          <div className="bg-red-50 border-l-4 border-red-400 p-6 mb-8 rounded-lg">
            <div className="flex items-center">
              <span className="text-2xl mr-3">❌</span>
              <div>
                <h2 className="text-lg font-semibold text-red-800">Order Cancelled</h2>
                <p className="text-red-700">This order has been cancelled.</p>
              </div>
            </div>
          </div>
        ) : (
          /* Tracking Timeline */
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-xl font-semibold mb-6">Order Tracking</h2>
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-gray-200"></div>
              
              {/* Stages */}
              <div className="space-y-8">
                {orderStages.map((stage, index) => {
                  const isCompleted = orderStages.findIndex(s => s.key === currentStage) >= index
                  const isCurrent = stage.key === currentStage
                  
                  return (
                    <div key={stage.key} className="flex items-center relative">
                      {/* Stage Icon */}
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center z-10 ${
                        isCompleted 
                          ? 'bg-primary text-white' 
                          : 'bg-gray-200 text-gray-400'
                      } ${isCurrent ? 'ring-4 ring-primary ring-opacity-30' : ''}`}>
                        <span className="text-2xl">{stage.icon}</span>
                      </div>
                      
                      {/* Stage Details */}
                      <div className="ml-6 flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className={`font-semibold text-lg ${
                              isCompleted ? 'text-primary' : 'text-gray-400'
                            }`}>
                              {stage.name}
                            </h3>
                            <p className={`text-sm ${
                              isCompleted ? 'text-gray-600' : 'text-gray-400'
                            }`}>
                              {stage.description}
                            </p>
                          </div>
                          {isCompleted && (
                            <span className="text-sm text-green-600 font-medium">
                              ✓ Complete
                            </span>
                          )}
                        </div>
                        
                        {/* Current Status Details */}
                        {isCurrent && stage.key !== 'delivered' && !isCancelled && (
                          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-sm text-blue-800">
                              <strong>Current Status:</strong> {stage.description}
                            </p>
                            {stage.key === 'shipped' && (
                              <p className="text-xs text-blue-600 mt-2">
                                Tracking number will be available once shipped
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Order Details */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-xl font-semibold mb-6">Order Details</h2>
          
          {/* Items */}
          <div className="mb-6">
            <h3 className="font-medium mb-4">Items Ordered</h3>
            <div className="space-y-4">
              {order.orderItems?.map((item, index) => (
                <div key={index} className="flex items-center space-x-4 pb-4 border-b">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                    <p className="text-sm text-gray-600">${item.price.toFixed(2)} each</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping & Payment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-medium mb-4">Shipping Information</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Address:</strong> {order.shippingAddress?.address || 'N/A'}</p>
                <p><strong>Phone:</strong> {order.shippingAddress?.phone || 'N/A'}</p>
                <p><strong>Method:</strong> {order.paymentMethod || 'Standard'}</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-4">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Items:</span>
                  <span>${order.itemsPrice?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>${order.shippingPrice?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total:</span>
                  <span className="text-primary">${order.totalPrice?.toFixed(2) || '0.00'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={() => navigate('/orders')}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition"
          >
            ← Back to Orders
          </button>
          {!isCancelled && currentStage !== 'delivered' && (
            <button 
              onClick={() => window.location.href = `mailto:support@animemerch.com?subject=Order Inquiry #${order._id?.slice(-6).toUpperCase()}`}
              className="flex-1 bg-primary hover:bg-pink-600 text-white font-semibold py-3 px-6 rounded-lg transition"
            >
              Contact Support
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
