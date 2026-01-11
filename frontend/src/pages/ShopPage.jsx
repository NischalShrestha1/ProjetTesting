import { useState, useEffect } from 'react'
import ProductCard from '../components/ProductCard'
import { useAppSelector, useAppDispatch } from '../store/hooks'
import { addToCart, selectAllProducts, selectCategories } from '../store'

export default function ShopPage() {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectAllProducts);
  const categories = useAppSelector(selectCategories);
  const [sortOption, setSortOption] = useState('default')
  const [stockFilter, setStockFilter] = useState('all') // 'all', 'in-stock', 'out-of-stock', 'low-stock'
  const [filteredProducts, setFilteredProducts] = useState(products)

  useEffect(() => {
    filterAndSortProducts(products, sortOption, stockFilter);
  }, [products, sortOption, stockFilter]);

  const filterAndSortProducts = (productList, sortOpt, stockOpt) => {
    let filtered = [...productList];

    // Apply stock filter
    switch(stockOpt) {
      case 'in-stock':
        filtered = filtered.filter(p => (p.stock || 0) > 0);
        break;
      case 'out-of-stock':
        filtered = filtered.filter(p => (p.stock || 0) === 0);
        break;
      case 'low-stock':
        filtered = filtered.filter(p => (p.stock || 0) > 0 && (p.stock || 0) <= (p.lowStockThreshold || 10));
        break;
      default:
        // Show all products
        break;
    }

    // Apply sorting
    switch(sortOpt) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'stock-low':
        filtered.sort((a, b) => (a.stock || 0) - (b.stock || 0));
        break;
      case 'stock-high':
        filtered.sort((a, b) => (b.stock || 0) - (a.stock || 0));
        break;
      default:
        // Default sorting (original order)
        break;
    }

    setFilteredProducts(filtered);
  };

  const handleSort = (option) => {
    setSortOption(option);
    filterAndSortProducts(products, option, stockFilter);
  };

  const handleStockFilter = (filter) => {
    setStockFilter(filter);
    filterAndSortProducts(products, sortOption, filter);
  };

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

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold font-anime mb-8 text-center">
          Our <span className="text-primary">Shop</span>
        </h1>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="text-gray-600">
            <span className="font-medium">{filteredProducts.length} products</span> shown from <span className="font-medium">{products.length}</span> total
            <br />
            <span className="text-sm">
              In Stock: <span className="text-green-600 font-medium">{products.filter(p => (p.stock || 0) > 0).length}</span> |
              Out of Stock: <span className="text-red-600 font-medium">{products.filter(p => (p.stock || 0) === 0).length}</span> |
              Low Stock: <span className="text-yellow-600 font-medium">{products.filter(p => (p.stock || 0) > 0 && (p.stock || 0) <= (p.lowStockThreshold || 10)).length}</span>
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center">
              <label htmlFor="stock-filter" className="mr-2 text-gray-700 text-sm">Stock Filter:</label>
              <select
                id="stock-filter"
                value={stockFilter}
                onChange={(e) => handleStockFilter(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-1 focus:ring-primary text-sm"
              >
                <option value="all">All Products</option>
                <option value="in-stock">In Stock Only</option>
                <option value="low-stock">Low Stock Only</option>
                <option value="out-of-stock">Out of Stock Only</option>
              </select>
            </div>

            <div className="flex items-center">
              <label htmlFor="sort" className="mr-2 text-gray-700 text-sm">Sort by:</label>
              <select
                id="sort"
                value={sortOption}
                onChange={(e) => handleSort(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-1 focus:ring-primary text-sm"
              >
                <option value="default">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Rating</option>
                <option value="name">Name</option>
                <option value="stock-low">Stock: Low to High</option>
                <option value="stock-high">Stock: High to Low</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map(product => (
            <ProductCard 
              key={product._id || product.id} 
              product={product} 
            />
          ))}
        </div>
      </div>
    </section>
  )
}