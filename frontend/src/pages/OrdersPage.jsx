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
      <h1 className="text-3xl font-bold mb-8">Your Orders</h1>
      
      {loading && (
        <div className="text-center py-8">
          <p>Loading your orders...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
          <button 
            onClick={() => dispatch(clearUserError())}
            className="mt-2 bg-red-500 text-white px-4 py-2 rounded"
          >
            Clear Error
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          {orders && orders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
              <Link 
                to="/shop"
                className="bg-primary hover:bg-pink-600 text-white font-bold py-2 px-6 rounded inline-block transition"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders?.map(order => (
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
                    <div className="flex items-center space-x-2">
                      <Link to={`/orders/${order._id || order.id}`} className="text-blue-600 hover:text-blue-800 underline">View Details</Link>
                    </div>
                  </div>
                  
                  {/* Show order items with sizes */}
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-3">Order Items</h4>
                    <div className="space-y-3">
                      {order.orderItems?.map((item, index) => (
                        <div key={index} className="flex items-center space-x-4 pb-4 border-b last:border-b-0">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium">{item.name}</h4>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <span>Quantity: {item.quantity}</span>
                              {item.size && (
                                <span className="px-2 py-1 bg-gray-100 rounded text-xs">Size: {item.size}</span>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                            <p className="text-sm text-gray-600">${item.price.toFixed(2)} each</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {orders && orders.length > 0 && (
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