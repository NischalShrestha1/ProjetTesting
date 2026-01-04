
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchOrders, selectOrders, clearUserError } from '../store';

const OrdersPage = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectOrders);
  const loading = useSelector(state => state.user.isLoading);
  const error = useSelector(state => state.user.error);

  useEffect(() => {
    console.log('📦 OrdersPage: Component mounted, fetching orders...');
    dispatch(fetchOrders());
  }, [dispatch]);

  useEffect(() => {
    console.log('📦 OrdersPage: Orders updated:', orders?.length || 0, 'Orders:', orders);
    if (orders && orders.length > 0) {
      console.log('📦 OrdersPage: Order IDs:', orders.map(o => o._id));
    }
  }, [orders]);

  // Listen for real-time order updates
  useEffect(() => {
    const handleOrderUpdate = (event) => {
      console.log('📦 OrdersPage: Real-time update received:', event.detail)
      // Re-fetch orders to get latest data
      dispatch(fetchOrders())
    }

    window.addEventListener('order-status-updated', handleOrderUpdate)

    return () => {
      window.removeEventListener('order-status-updated', handleOrderUpdate)
    }
  }, [dispatch])

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800'
      case 'Processing':
        return 'bg-blue-100 text-blue-800'
      case 'Shipped':
        return 'bg-yellow-100 text-yellow-800'
      case 'Cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="text-xl mt-4">Loading your orders...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => {
              dispatch(clearUserError())
              dispatch(fetchOrders())
            }}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded"
          >
            Try Again
          </button>
        </div>
      ) : (
        <>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-4">Your <span className="text-primary">Orders</span></h2>
            <p className="text-gray-600">
              {orders.length === 0 ? 
                "You haven't placed any orders yet." : 
                `You have ${orders.length} ${orders.length === 1 ? 'order' : 'orders'}`
              }
            </p>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">Start Shopping</h2>
              <Link 
                to="/shop"
                className="bg-primary hover:bg-pink-600 text-white font-bold py-2 px-6 rounded inline-block transition"
              >
                Shop Now
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {orders.map(order => (
                <div key={order._id || order.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">Order #{order._id?.slice(-6).toUpperCase() || order.id?.slice(-6).toUpperCase()}</h3>
                      <p className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</p>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        getStatusColor(order.status)
                      }`}>
                        {order.status || 'Processing'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <Link to={`/orders/${order._id || order.id}`} className="text-blue-600 hover:text-blue-800 underline">View Details</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {orders.length > 0 && (
            <div className="text-center mt-8">
              <Link 
                to="/shop"
                className="bg-primary hover:bg-pink-600 text-white font-bold py-2 px-6 rounded inline-block transition"
              >
                Continue Shopping
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default OrdersPage;