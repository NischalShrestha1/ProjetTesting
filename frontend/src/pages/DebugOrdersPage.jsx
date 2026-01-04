import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectIsAuthenticated } from '../store'
import axios from 'axios'

const backendUrl = "https://animerch-rvt0.onrender.com/api"

export default function DebugOrdersPage() {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const [debugInfo, setDebugInfo] = useState({})

  useEffect(() => {
    runDebugChecks()
  }, [])

  const runDebugChecks = async () => {
    const info = {}

    // Check authentication
    info.isAuthenticated = isAuthenticated
    info.token = localStorage.getItem('token') ? 'Present' : 'Missing'
    info.userInStorage = localStorage.getItem('user') ? 'Present' : 'Missing'
    
    // Check Redux state
    console.log('Current Redux state check:')
    console.log('isAuthenticated from Redux:', isAuthenticated)
    console.log('user from Redux:', user)
    console.log('localStorage token:', localStorage.getItem('token'))
    console.log('localStorage user:', localStorage.getItem('user'))
    
    // Test backend connection
    try {
      const response = await axios.get(`${backendUrl}/products`)
      info.backendConnection = 'Connected'
      info.productCount = response.data.products?.length || 0
    } catch (error) {
      info.backendConnection = 'Failed'
      info.backendError = error.message
    }

    // Test orders endpoint
    if (isAuthenticated) {
      try {
        const token = localStorage.getItem('token')
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
        
        const ordersResponse = await axios.get(`${backendUrl}/orders`, config)
        info.ordersEndpoint = 'Working'
        info.orderCount = ordersResponse.data.orders?.length || 0
        info.ordersData = ordersResponse.data.orders?.slice(0, 2) // First 2 orders
      } catch (error) {
        info.ordersEndpoint = 'Failed'
        info.ordersError = error.response?.data || error.message
      }
    } else {
      info.ordersEndpoint = 'Not Authenticated'
    }

    // Test user authentication
    if (isAuthenticated) {
      try {
        const token = localStorage.getItem('token')
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
        
        const userResponse = await axios.get(`${backendUrl}/users/debug`, config)
        info.userAuth = 'Working'
        info.userInfo = userResponse.data.user
      } catch (error) {
        info.userAuth = 'Failed'
        info.userAuthError = error.response?.data || error.message
      }
    } else {
      info.userAuth = 'Not Authenticated'
    }

    // Test order creation
    if (isAuthenticated) {
      try {
        const token = localStorage.getItem('token')
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
        
        // First get a real product ID
        const productsResponse = await axios.get(`${backendUrl}/products`)
        const firstProduct = productsResponse.data.products?.[0]
        
        if (!firstProduct) {
          alert('No products found to create test order')
          return
        }
        
        const testOrder = {
          orderItems: [{
            product: firstProduct._id || firstProduct.id,
            name: firstProduct.name,
            image: firstProduct.image,
            price: firstProduct.price,
            quantity: 1
          }],
          shippingAddress: {
            address: '123 Test St',
            phone: '555-1234'
          },
          paymentMethod: 'Card',
          itemsPrice: firstProduct.price,
          shippingPrice: 4.99,
          totalPrice: firstProduct.price + 4.99
        }
        
        const createResponse = await axios.post(`${backendUrl}/orders`, testOrder, config)
        info.orderCreation = 'Working'
        info.createdOrderId = createResponse.data.order?._id || createResponse.data.order?.id
      } catch (error) {
        info.orderCreation = 'Failed'
        info.creationError = error.response?.data || error.message
      }
    }

    setDebugInfo(info)
    
    // Also test cart orders
    try {
      const cartTest = await axios.get(`${backendUrl}/orders/test`, {
        headers: { 'X-Test-Request': 'true' }
      })
      info.cartOrderTest = 'Working'
    } catch (e) {
      info.cartOrderTest = 'Not Available'
    }
  }

  const createTestOrder = async () => {
    try {
      const token = localStorage.getItem('token')
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      }
      
      const testOrder = {
        orderItems: [{
          product: '507f1f77bcf86cd799439011',
          name: 'Test Product',
          image: 'https://via.placeholder.com/150',
          price: 29.99,
          quantity: 1
        }],
        shippingAddress: {
          address: '123 Test St',
          phone: '555-1234'
        },
        paymentMethod: 'Card',
        itemsPrice: 29.99,
        shippingPrice: 4.99,
        totalPrice: 34.98
      }
      
      const response = await axios.post(`${backendUrl}/orders`, testOrder, config)
      alert('Test order created! ID: ' + response.data.order?._id)
      runDebugChecks()
    } catch (error) {
      alert('Failed to create test order: ' + (error.response?.data?.message || error.message))
    }
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold font-anime mb-8">Debug <span className="text-primary">Orders</span></h1>
        
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Connection Status</h2>
          <div className="space-y-2">
            <div><strong>Authenticated:</strong> {debugInfo.isAuthenticated ? 'Yes' : 'No'}</div>
            <div><strong>Token:</strong> {debugInfo.token}</div>
            <div><strong>Backend Connection:</strong> 
              <span className={debugInfo.backendConnection === 'Connected' ? 'text-green-600' : 'text-red-600'}>
                {debugInfo.backendConnection}
              </span>
            </div>
            <div><strong>Products Count:</strong> {debugInfo.productCount || 'Unknown'}</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Orders API</h2>
          <div className="space-y-2">
            <div><strong>Orders Endpoint:</strong> 
              <span className={debugInfo.ordersEndpoint === 'Working' ? 'text-green-600' : 'text-red-600'}>
                {debugInfo.ordersEndpoint}
              </span>
            </div>
            <div><strong>Order Count:</strong> {debugInfo.orderCount || 0}</div>
            <div><strong>User Auth:</strong> 
              <span className={debugInfo.userAuth === 'Working' ? 'text-green-600' : 'text-red-600'}>
                {debugInfo.userAuth}
              </span>
            </div>
            <div><strong>Order Creation:</strong> 
              <span className={debugInfo.orderCreation === 'Working' ? 'text-green-600' : 'text-red-600'}>
                {debugInfo.orderCreation}
              </span>
            </div>
            {debugInfo.createdOrderId && (
              <div><strong>Last Test Order ID:</strong> {debugInfo.createdOrderId}</div>
            )}
          </div>
          
          {debugInfo.ordersError && (
            <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded">
              <strong>Orders Error:</strong>
              <pre className="text-sm text-red-800 mt-2">{JSON.stringify(debugInfo.ordersError, null, 2)}</pre>
            </div>
          )}
          
          {debugInfo.creationError && (
            <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded">
              <strong>Creation Error:</strong>
              <pre className="text-sm text-red-800 mt-2">{JSON.stringify(debugInfo.creationError, null, 2)}</pre>
            </div>
          )}
        </div>

        {debugInfo.ordersData && debugInfo.ordersData.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Sample Orders Data</h2>
            <pre className="text-sm bg-gray-100 p-4 rounded overflow-x-auto">
              {JSON.stringify(debugInfo.ordersData, null, 2)}
            </pre>
          </div>
        )}

        <div className="flex gap-4">
          <button 
            onClick={runDebugChecks}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
          >
            Refresh Debug Info
          </button>
          {isAuthenticated && (
            <button 
              onClick={createTestOrder}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
            >
              Create Test Order
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
