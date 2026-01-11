import ProductCard from '../components/ProductCard';
import { useAppDispatch } from '../store/hooks';
import { addToCart } from '../store';

export default function SearchResultsPage({ results, sortOption, onSort }) {
  const dispatch = useAppDispatch();

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
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold font-anime mb-8">
          Search Results {results.length > 0 && `(${results.length})`}
        </h1>

        {results.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">No products found</h2>
            <p className="text-gray-600 mb-6">Try different search terms</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-8">
              <p className="text-gray-600">{results.length} products found</p>

              <div className="flex items-center">
                <label htmlFor="sort" className="mr-2 text-gray-700">Sort by:</label>
                <select
                  id="sort"
                  value={sortOption}
                  onChange={(e) => onSort(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="default">Relevance</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Rating</option>
                  <option value="name">Name</option>
                </select>
              </div>
            </div>

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {results.map(product => (
                <ProductCard 
                  key={product._id || product.id} 
                  product={product} 
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}