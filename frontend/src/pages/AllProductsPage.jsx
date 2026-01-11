import { Link } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../store/hooks'
import { selectAllProducts, addToCart } from '../store'

export default function AllProductsPage() {
  const products = useAppSelector(selectAllProducts)
  const dispatch = useAppDispatch()

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

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold font-anime mb-8">All <span className="text-primary">Products</span></h1>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">No products available</h2>
            <p className="text-gray-600">Check back later for new arrivals!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => {
              const isOutOfStock = (product.stock || 0) === 0;
              const isLowStock = (product.stock || 0) > 0 && (product.stock || 0) <= (product.lowStockThreshold || 10);

              return (
                <div key={product._id || product.id} className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow ${isOutOfStock ? 'opacity-75' : ''}`}>
                  <div className="relative">
                    <Link to={`/product/${product._id || product.id}`}>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                      />
                    </Link>
                    {(isOutOfStock || isLowStock) && (
                      <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold ${
                        isOutOfStock ? 'bg-red-500 text-white' : 'bg-yellow-500 text-black'
                      }`}>
                        {isOutOfStock ? 'OUT OF STOCK' : 'LOW STOCK'}
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <Link to={`/product/${product._id || product.id}`}>
                      <h3 className="font-bold text-lg mb-2 hover:text-primary transition">
                        {product.name}
                      </h3>
                    </Link>

                    <div className={`text-sm mb-2 ${getStockStatusColor(product)} font-medium`}>
                      {getStockStatusLabel(product)}
                      {(product.stock || 0) > 0 && (
                        <span className="text-gray-500 ml-1">
                          ({product.stock} available)
                        </span>
                      )}
                    </div>

                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xl font-bold text-primary">
                        ${(product.price || 0).toFixed(2)}
                      </span>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                        <span className="text-sm text-gray-600 ml-1">
                          {product.rating || '5.0'}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => dispatch(addToCart(product))}
                      disabled={isOutOfStock}
                      className={`w-full py-2 rounded transition font-medium ${
                        isOutOfStock
                          ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                          : 'bg-primary hover:bg-pink-600 text-white'
                      }`}
                    >
                      {isOutOfStock ? '🔴 Out of Stock' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  )
}