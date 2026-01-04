import { useSelector } from 'react-redux'
import { selectUser, selectIsAuthenticated } from '../store'
import { useState, useEffect } from 'react'

export default function AuthStatus() {
  const user = useSelector(selectUser)
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const [status, setStatus] = useState({})

  useEffect(() => {
    const checkStatus = () => {
      const newStatus = {
        token: localStorage.getItem('token'),
        userInStorage: localStorage.getItem('user'),
        tokenValid: localStorage.getItem('token') ? 'Present' : 'Missing',
        userInRedux: user ? 'Present' : 'Missing',
        userId: user?._id || 'None',
        userEmail: user?.email || 'None',
        isAuthenticatedRedux: isAuthenticated,
        isAuthenticatedBoth: isAuthenticated && localStorage.getItem('token')
      }
      
      setStatus(newStatus)
      console.log('🔍 Auth Status Check:', newStatus)
    }

    checkStatus()
    const interval = setInterval(checkStatus, 5000) // Check every 5 seconds
    
    return () => clearInterval(interval)
  }, [user, isAuthenticated])

  return (
    <div className="fixed top-20 right-4 bg-white border-2 border-gray-300 rounded-lg p-4 w-80 z-50 shadow-lg">
      <h3 className="font-bold mb-3 text-lg">🔍 Authentication Status</h3>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Token in localStorage:</span>
          <span className={`font-bold ${status.tokenValid === 'Present' ? 'text-green-600' : 'text-red-600'}`}>
            {status.tokenValid}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>User in localStorage:</span>
          <span className={`font-bold ${status.userInStorage === 'Present' ? 'text-green-600' : 'text-red-600'}`}>
            {status.userInStorage}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>User in Redux:</span>
          <span className={`font-bold ${status.userInRedux === 'Present' ? 'text-green-600' : 'text-red-600'}`}>
            {status.userInRedux}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Redux Authenticated:</span>
          <span className={`font-bold ${isAuthenticated ? 'text-green-600' : 'text-red-600'}`}>
            {isAuthenticated ? 'True' : 'False'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Overall Status:</span>
          <span className={`font-bold ${status.isAuthenticatedBoth ? 'text-green-600' : 'text-red-600'}`}>
            {status.isAuthenticatedBoth ? '✅ Authenticated' : '❌ Not Authenticated'}
          </span>
        </div>
        
        {status.userId && (
          <div className="flex justify-between">
            <span>User ID:</span>
            <span className="font-mono text-xs">{status.userId}</span>
          </div>
        )}
        
        {status.userEmail && (
          <div className="flex justify-between">
            <span>Email:</span>
            <span className="text-xs">{status.userEmail}</span>
          </div>
        )}
      </div>
      
      <div className="mt-4 pt-3 border-t text-xs text-gray-500">
        This panel shows real-time authentication status
      </div>
    </div>
  )
}