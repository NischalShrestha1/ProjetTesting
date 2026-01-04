import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { selectUser, selectIsAuthenticated, selectOrders, fetchOrders } from '../store'
import { Link } from 'react-router-dom'

const statusMessages = {
  'Processing': {
    icon: '⏳',
    title: 'Order Processing',
    message: 'Your order is being prepared for shipment.',
    color: 'blue'
  },
  'Shipped': {
    icon: '📦',
    title: 'Order Shipped',
    message: 'Your order has been shipped and is on its way!',
    color: 'yellow'
  },
  'Delivered': {
    icon: '✅',
    title: 'Order Delivered',
    message: 'Your order has been delivered successfully!',
    color: 'green'
  },
  'Cancelled': {
    icon: '❌',
    title: 'Order Cancelled',
    message: 'Your order has been cancelled.',
    color: 'red'
  }
}

export default function NotificationBell({ onOrderUpdate }) {
  const user = useSelector(selectUser)
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const allOrders = useSelector(selectOrders)
  const dispatch = useDispatch()
  const [showDropdown, setShowDropdown] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  // Fetch orders when component mounts
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchOrders())
    }
  }, [dispatch, isAuthenticated])

  // Update notifications when orders change
  useEffect(() => {
    console.log('🔔 NotificationBell: Orders in Redux:', allOrders?.length || 0)
    
    if (!isAuthenticated) {
      setNotifications([])
      setUnreadCount(0)
      return
    }
    
    // Create notifications from Redux orders
    const orderNotifications = (allOrders || []).map(order => {
      const statusInfo = statusMessages[order.status] || statusMessages['Processing']
      return {
        id: order._id,
        type: 'order',
        title: `${statusInfo.icon} Order #${order._id?.slice(-6).toUpperCase()}`,
        message: statusInfo.message,
        date: order.createdAt,
        read: order.status === 'Delivered' || order.status === 'Cancelled',
        orderId: order._id,
        status: order.status,
        statusColor: statusInfo.color
      }
    })
    
    console.log('🔔 NotificationBell: Created notifications:', orderNotifications)
    
    setNotifications(orderNotifications)
    setUnreadCount(orderNotifications.filter(n => !n.read).length)
    
    // Notify parent component of order updates
    if (onOrderUpdate) {
      onOrderUpdate(allOrders)
    }
  }, [allOrders, isAuthenticated, onOrderUpdate])

  // Request notification permission on component mount
  useEffect(() => {
    if (isAuthenticated && Notification.permission === 'default') {
      Notification.requestPermission()
    }

    // Listen for real-time order updates
    const handleOrderUpdate = (event) => {
      console.log('🔔 NotificationBell: Real-time update received:', event.detail)
      // Re-fetch orders to get latest data
      if (isAuthenticated) {
        dispatch(fetchOrders())
      }
    }

    window.addEventListener('order-status-updated', handleOrderUpdate)

    return () => {
      window.removeEventListener('order-status-updated', handleOrderUpdate)
    }
  }, [isAuthenticated, dispatch])

  if (!isAuthenticated) {
    return null
  }

  const markAsRead = (notificationId) => {
    const updatedNotifications = notifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    )
    setNotifications(updatedNotifications)
    setUnreadCount(updatedNotifications.filter(n => !n.read).length)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="p-2 rounded-full hover:bg-gray-700 transition"
        aria-label="Notifications"
        aria-expanded={showDropdown}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div 
          className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-md shadow-lg py-1 z-50"
          onMouseLeave={() => setShowDropdown(false)}
        >
          <div className="px-4 py-2 border-b border-gray-700">
            <h3 className="text-sm font-medium text-white">Notifications</h3>
          </div>

          {notifications.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-400">
              <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-sm">No notifications</p>
            </div>
          ) : (
            <div className="max-h-64 overflow-y-auto">
              {notifications.map((notification, index) => (
                <div
                  key={notification.id}
                  className={`px-4 py-3 border-b border-gray-700 hover:bg-gray-700 cursor-pointer ${
                    !notification.read ? 'bg-gray-750' : ''
                  }`}
                  onClick={() => {
                    markAsRead(notification.id)
                    setShowDropdown(false)
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">
                        {notification.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-gray-500">
                          {new Date(notification.date).toLocaleDateString()}
                        </p>
                        {notification.orderId && (
                          <Link 
                            to={`/orders/${notification.orderId}`}
                            className="text-xs text-blue-400 hover:text-blue-300"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Track Order →
                          </Link>
                        )}
                      </div>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="px-4 py-2 border-t border-gray-700">
            <Link 
              to="/orders"
              className="text-xs text-blue-400 hover:text-blue-300"
              onClick={() => setShowDropdown(false)}
            >
              View all orders
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}