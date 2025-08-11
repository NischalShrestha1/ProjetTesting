import { useState } from 'react'
import FeaturedProducts from '../components/FeaturedProducts'

export default function ShopPage({ addToCart, products }) {
  const [sortOption, setSortOption] = useState('default')
  const [filteredProducts, setFilteredProducts] = useState(products)

  const handleSort = (option) => {
    setSortOption(option)
    let sortedProducts = [...products]
    
    switch(option) {
      case 'price-low':
        sortedProducts.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        sortedProducts.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        sortedProducts.sort((a, b) => b.rating - a.rating)
        break
      case 'name':
        sortedProducts.sort((a, b) => a.name.localeCompare(b.name))
        break
      default:
        // Default sorting (original order)
        break
    }
    
    setFilteredProducts(sortedProducts)
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold font-anime mb-8 text-center">
          Our <span className="text-primary">Shop</span>
        </h1>
        
        <div className="flex justify-between items-center mb-8">
          <p className="text-gray-600">{products.length} products available</p>
          
          <div className="flex items-center">
            <label htmlFor="sort" className="mr-2 text-gray-700">Sort by:</label>
            <select
              id="sort"
              value={sortOption}
              onChange={(e) => handleSort(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="default">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Rating</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition">
              <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                <div className="flex items-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="text-gray-600 text-sm ml-1">({product.rating})</span>
                </div>
                <p className="text-gray-600 mb-4">${product.price.toFixed(2)}</p>
                <button 
                  onClick={() => addToCart(product)}
                  className="w-full bg-primary hover:bg-pink-600 text-white py-2 rounded transition"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}