import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectToken } from '../store/slices/userSlice';
import { api } from '../config/api';
import { useSocket } from '../contexts/SocketContext';

const StockTableRow = ({ product, updatingProduct, updateProductStock }) => {
  const [stockValue, setStockValue] = useState(product.stock || 0);
  const [thresholdValue, setThresholdValue] = useState(product.lowStockThreshold || 10);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    updateProductStock(product._id || product.id, stockValue, thresholdValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setStockValue(product.stock || 0);
    setThresholdValue(product.lowStockThreshold || 10);
    setIsEditing(false);
  };

  const isLowStock = product.stock <= (product.lowStockThreshold || 10);
  const stockStatus = product.stock === 0 ? 'out' : isLowStock ? 'low' : 'good';

  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          {product.image && (
            <img
              src={product.image}
              alt={product.name}
              className="w-10 h-10 object-cover rounded"
            />
          )}
          <div>
            <div className="font-medium text-gray-900">{product.name}</div>
            <div className="text-sm text-gray-500">
              {product.category?.name || 'No Category'}
            </div>
          </div>
        </div>
      </td>

      <td className="px-4 py-3">
        {isEditing ? (
          <input
            type="number"
            min="0"
            value={stockValue}
            onChange={(e) => setStockValue(parseInt(e.target.value) || 0)}
            className="w-20 px-2 py-1 border rounded text-center"
          />
        ) : (
          <span className={`font-medium ${
            stockStatus === 'out' ? 'text-red-600' : 
            stockStatus === 'low' ? 'text-yellow-600' : 'text-green-600'
          }`}>
            {product.stock === 0 ? 'Out of Stock' : 
              stockStatus === 'low' ? `${product.stock} (Low)` : `${product.stock}`}
          </span>
        )}
      </td>

      <td className="px-4 py-3">
        {isEditing ? (
          <input
            type="number"
            min="0"
            value={thresholdValue}
            onChange={(e) => setThresholdValue(parseInt(e.target.value) || 0)}
            className="w-20 px-2 py-1 border rounded text-center"
          />
        ) : (
          <span className="text-gray-600">{product.lowStockThreshold || 10}</span>
        )}
      </td>

      <td className="px-4 py-3">
        {isEditing ? (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={updatingProduct === product._id || updatingProduct === product.id}
              className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
          >
            Edit
          </button>
        )}
      </td>
    </tr>
  );
};

export default function StockManagement({ authConfig: propAuthConfig }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingProduct, setUpdatingProduct] = useState(null);
  const socket = useSocket();
  const token = useSelector(selectToken);

  // Helper function for authenticated API calls
  const authConfig = propAuthConfig || {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    withCredentials: true
  };

  useEffect(() => {
    loadProducts();
    
    // Listen for stock updates
    const handleStockUpdate = (data) => {
      setProducts(prev => prev.map(p => 
        (p._id || p.id) === (data.productId || data._id) 
          ? { ...p, stock: data.newStock, lowStockThreshold: data.newThreshold }
          : p
      ));
    };

    window.addEventListener('stock-updated', handleStockUpdate);

    // Listen for socket updates
    if (socket) {
      socket.on('stock-update', handleStockUpdate);
    }

    return () => {
      window.removeEventListener('stock-updated', handleStockUpdate);
      if (socket) {
        socket.off('stock-update', handleStockUpdate);
      }
    };
  }, [socket]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/products', authConfig);
      setProducts(response.data || []);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProductStock = async (productId, newStock, newThreshold) => {
    try {
      setUpdatingProduct(productId);
      

      
      const response = await api.put(`/stock/${productId}`, {
        stock: newStock,
        lowStockThreshold: newThreshold
      }, authConfig);

      if (response.data) {
        // Update local state immediately
        setProducts(prev => prev.map(p => 
          (p._id || p.id) === productId 
            ? { ...p, stock: newStock, lowStockThreshold: newThreshold }
            : p
        ));

        // Emit real-time update
        window.dispatchEvent(new CustomEvent('stock-updated', {
          detail: {
            productId,
            newStock,
            newThreshold
          }
        }));

        // Emit socket update
        if (socket) {
          socket.emit('stock-update', {
            productId,
            newStock,
            newThreshold
          });
        }
      }
    } catch (error) {
      console.error('Error updating stock:', error);
      alert('Failed to update stock: ' + (error.response?.data?.message || error.message));
    } finally {
      setUpdatingProduct(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const lowStockProducts = products.filter(p => (p.stock || 0) > 0 && (p.stock || 0) <= (p.lowStockThreshold || 10));
  const outOfStockProducts = products.filter(p => (p.stock || 0) === 0);

  return (
    <div className="space-y-6">
      {/* Stock Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="text-blue-800 font-semibold text-lg mb-2">Total Products</h3>
          <p className="text-3xl font-bold text-blue-900">{products.length}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h3 className="text-yellow-800 font-semibold text-lg mb-2">Low Stock</h3>
          <p className="text-3xl font-bold text-yellow-900">{lowStockProducts.length}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <h3 className="text-red-800 font-semibold text-lg mb-2">Out of Stock</h3>
          <p className="text-3xl font-bold text-red-900">{outOfStockProducts.length}</p>
        </div>
      </div>

      {/* Stock Management Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Stock Management</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-3 px-4 text-left font-medium text-gray-700">Product</th>
                <th className="py-3 px-4 text-center font-medium text-gray-700">Current Stock</th>
                <th className="py-3 px-4 text-center font-medium text-gray-700">Threshold</th>
                <th className="py-3 px-4 text-center font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <StockTableRow
                  key={product._id || product.id}
                  product={product}
                  updatingProduct={updatingProduct}
                  updateProductStock={updateProductStock}
                />
              ))}
            </tbody>
          </table>
          {products.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No products found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}