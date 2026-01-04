import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '../store/hooks'
import { selectAllProducts, selectCategories } from '../store'

export default function SearchBar({ onSearch, onClose }) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [filteredProducts, setFilteredProducts] = useState([])
  const products = useAppSelector(selectAllProducts)
  const categories = useAppSelector(selectCategories)
  const navigate = useNavigate()
  const searchRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (query.trim() === '') {
      setFilteredProducts([])
      setIsOpen(false)
      return
    }

    const results = products.filter(product => {
      const searchTerm = query.toLowerCase()
      
      // Check product name
      if (product.name?.toLowerCase().includes(searchTerm)) {
        return true
      }
      
      // Check description
      if (product.description?.toLowerCase().includes(searchTerm)) {
        return true
      }
      
      // Check tags
      if (product.tags?.some(tag => tag.toLowerCase().includes(searchTerm))) {
        return true
      }
      
      // Check category name
      let productCategory = null
      if (typeof product.category === 'object' && product.category !== null) {
        productCategory = product.category
      } else if (product.category) {
        productCategory = categories.find(c => 
          c._id === product.category || 
          String(c._id) === String(product.category) ||
          c.id === product.category
        )
      }
      
      if (productCategory?.name?.toLowerCase().includes(searchTerm)) {
        return true
      }
      
      return false
    }).slice(0, 6) // Limit to 6 results for dropdown

    setFilteredProducts(results)
    setIsOpen(results.length > 0)
  }, [query, products, categories])



  const handleProductClick = (product) => {
    setQuery('')
    setIsOpen(false)
    navigate(`/product/${product._id || product.id}`)
    onClose()
  }

  const handleClose = () => {
    setQuery('')
    setIsOpen(false)
    onClose()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query)
      setIsOpen(false)
      navigate('/search')
    }
  }

  const highlightMatch = (text, searchTerm) => {
    if (!text || !searchTerm) return text
    const regex = new RegExp(`(${searchTerm})`, 'gi')
    return text.replace(regex, '<span class="bg-yellow-200">$1</span>')
  }

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center bg-gray-700 text-white focus-within:ring-1 focus-within:ring-primary transition-all">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, categories, anime..."
            className="flex-1 px-4 py-2 bg-transparent outline-none text-white placeholder-gray-400"
            autoFocus
          />
          <button
            type="button"
            onClick={handleClose}
            className="p-2 bg-transparent hover:bg-gray-600 text-white transition-colors"
            aria-label="Close search"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Search Dropdown */}
        {isOpen && filteredProducts.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 rounded-lg shadow-xl border border-gray-600 max-h-96 overflow-y-auto z-50">
            <div className="p-2">
              {filteredProducts.map(product => (
                <div
                  key={product._id || product.id}
                  onClick={() => handleProductClick(product)}
                  className="flex items-center p-3 hover:bg-gray-700 rounded cursor-pointer transition-colors"
                >
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded mr-3"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 
                      className="font-medium text-white truncate"
                      dangerouslySetInnerHTML={{
                        __html: highlightMatch(product.name, query)
                      }}
                    />
                    <p className="text-sm text-gray-300 truncate">
                      {product.category?.name || 'Uncategorized'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary">${product.price?.toFixed(2)}</p>
                    <div className="flex items-center text-xs text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-3 h-3 ${i < Math.floor(product.rating || 0) ? 'text-yellow-400' : 'text-gray-500'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="ml-1 text-gray-400">({product.rating || 0})</span>
                    </div>
                  </div>
                </div>
              ))}
              
              <div
                onClick={() => {
                  onSearch(query)
                  setIsOpen(false)
                  navigate('/search')
                }}
                className="flex items-center justify-center p-3 text-center text-primary hover:bg-gray-700 rounded cursor-pointer transition-colors text-sm font-medium"
              >
                View all results for "{query}"
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}