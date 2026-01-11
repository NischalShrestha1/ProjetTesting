import React, { createContext, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { useSelector, useDispatch } from 'react-redux'
import { selectUser, selectIsAuthenticated } from '../store'
import { updateProductInList } from '../store/slices/productsSlice'
import { updateCartItemStock } from '../store/slices/cartSlice'

const SocketContext = createContext()

export const useSocket = () => {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider')
  }
  return context
}

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)
  const user = useSelector(selectUser)
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const dispatch = useDispatch()

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      const socketUrl = import.meta.env.VITE_BACKEND_URL?.replace('/api', '') || 'http://localhost:5000';
      const newSocket = io(socketUrl, {
        auth: {
          token: localStorage.getItem('token')
        }
      })

      newSocket.on('connect', () => {
        console.log('🔌 Connected to server with socket:', newSocket.id)
        newSocket.emit('join-user-room', user.id)
      })

      newSocket.on('order-status-updated', (data) => {
        console.log('📨 Real-time order update received:', data)
        // Dispatch to Redux to update orders
        // This will trigger NotificationBell and OrdersPage to update
        window.dispatchEvent(new CustomEvent('order-status-updated', { detail: data }))
      })

      newSocket.on('stock-update', (data) => {
        console.log('📨 Real-time stock update received:', data)

        // Update product in Redux store
        dispatch(updateProductInList({
          _id: data.productId,
          stock: data.newStock,
          lowStockThreshold: data.lowStockThreshold
        }))

        // Update cart items if the product is in the cart
        dispatch(updateCartItemStock({
          productId: data.productId,
          newStock: data.newStock,
          newThreshold: data.lowStockThreshold
        }))

        // Broadcast to all components via CustomEvent
        window.dispatchEvent(new CustomEvent('stock-update', { detail: data }))
      })

      newSocket.on('disconnect', () => {
        console.log('🔌 Disconnected from server')
      })

      setSocket(newSocket)

      return () => {
        newSocket.close()
      }
    } else {
      if (socket) {
        socket.close()
        setSocket(null)
      }
    }
  }, [isAuthenticated, user])

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  )
}