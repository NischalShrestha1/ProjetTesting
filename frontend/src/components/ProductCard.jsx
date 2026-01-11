import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAppDispatch } from '../store/hooks';
import { addToCart } from '../store';

export default function ProductCard({ product }) {
  const dispatch = useAppDispatch();
  const availableSizes = product.sizes || ['S', 'M', 'L', 'XL'];
  const [selectedSize, setSelectedSize] = useState(availableSizes.includes('M') ? 'M' : availableSizes[0]);

  // Helper functions for stock status
  const getStockStatus = (product) => {
    const stock = product.stock || 0;
    const threshold = product.lowStockThreshold || 10;

    if (stock === 0) return 'out';
    if (stock <= threshold) return 'low';
    return 'good';
  };

  const getStockStatusLabel = (product) => {
    const status = getStockStatus(product);
    switch (status) {
      case 'out': return '🔴 Out of Stock';
      case 'low': return '⚠️ Low Stock';
      default: return '✅ In Stock';
    }
  };

  const getStockStatusColor = (product) => {
    const status = getStockStatus(product);
    switch (status) {
      case 'out': return 'text-red-600';
      case 'low': return 'text-yellow-600';
      default: return 'text-green-600';
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevent triggering the image click
    dispatch(addToCart({
      ...product,
      selectedSize,
      quantity: 1
    }));
  };

  const isOutOfStock = (product.stock || 0) === 0;
  const isLowStock = (product.stock || 0) > 0 && (product.stock || 0) <= (product.lowStockThreshold || 10);

  return (
    <div className={`bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 ${isOutOfStock ? 'opacity-75' : ''}`}>
      {/* Clickable Product Image */}
      <Link 
        to={`/product/${product._id || product.id}`}
        className="block relative group"
      >
        <div className="relative overflow-hidden">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Stock Badge Overlay */}
          {(isOutOfStock || isLowStock) && (
            <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold z-10 ${
              isOutOfStock ? 'bg-red-500 text-white' : 'bg-yellow-500 text-black'
            }`}>
              {isOutOfStock ? 'OUT OF STOCK' : 'LOW STOCK'}
            </div>
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
            <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
              <div className="bg-black bg-opacity-75 px-3 py-2 rounded">
                <p className="text-sm font-medium">View Details</p>
                <p className="text-xs">Click to see full product</p>
              </div>
            </div>
          </div>
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        {/* Product Name */}
        <Link 
          to={`/products/${product._id || product.id}`}
          className="block mb-2"
        >
          <h3 className="font-bold text-lg mb-1 hover:text-primary transition-colors" title={product.name}>
            {product.name.length > 30 ? `${product.name.substring(0, 30)}...` : product.name}
          </h3>
        </Link>

        {/* Product Rating Display */}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center">
            <span className="text-yellow-400 text-sm">
              {'★'.repeat(Math.round(product.averageRating || 0))}
            </span>
            <span className="text-gray-300 text-sm">
              {'★'.repeat(5 - Math.round(product.averageRating || 0))}
            </span>
          </div>
          <span className="text-gray-600 text-sm">
            ({product.ratingCount || 0})
          </span>
        </div>

        {/* Stock Status */}
        <div className={`text-sm mb-3 ${getStockStatusColor(product)} font-medium`}>
          {getStockStatusLabel(product)}
          {(product.stock || 0) > 0 && (
            <span className="text-gray-500 ml-1">
              ({product.stock} available)
            </span>
          )}
        </div>

        {/* Size Selection */}
        {!isOutOfStock && availableSizes.length > 0 && (
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-700 mb-1">Size:</label>
            <div className="flex gap-1 flex-wrap">
              {availableSizes.map(size => (
                <button
                  key={size}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSize(size);
                  }}
                  className={`px-2 py-1 text-xs rounded transition ${
                    selectedSize === size
                      ? 'bg-primary text-white border-primary'
                      : 'border border-gray-300 hover:bg-gray-100'
                  } focus:outline-none focus:ring-1 focus:ring-primary`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Price and Actions */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xl font-bold text-primary">
              ${(product.price || 0).toFixed(2)}
            </p>
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {product.tags.slice(0, 2).map((tag, index) => (
                  <span 
                    key={index}
                    className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
                {product.tags.length > 2 && (
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                    +{product.tags.length - 2}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`px-4 py-2 rounded text-sm font-medium transition ${
              isOutOfStock
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-primary hover:bg-pink-600 text-white hover:scale-105'
            }`}
            title={isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          >
            {isOutOfStock ? '🔴' : '🛒'}
          </button>
        </div>

        {/* Category Info */}
        {product.category && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2">
              {product.category.image && (
                <img 
                  src={product.category.image} 
                  alt={product.category.name}
                  className="w-6 h-6 object-cover rounded"
                />
              )}
              <span className="text-sm text-gray-600">
                {product.category.name}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}