import React, { createContext, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { useSelector } from 'react-redux'
import { selectUser, selectIsAuthenticated } from '../store'

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

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      const newSocket = io('http://localhost:5000', {
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