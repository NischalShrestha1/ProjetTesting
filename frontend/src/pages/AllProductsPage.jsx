import { Link } from 'react-router-dom'
import { useAppSelector } from '../store/hooks'
import { selectAllProducts } from '../store'

export default function AllProductsPage() {
  const products = useAppSelector(selectAllProducts)

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
            {products.map((product) => (
              <div key={product._id || product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                <Link to={`/product/${product._id || product.id}`}>
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-48 object-cover"
                  />
                </Link>
                <div className="p-4">
                  <Link to={`/product/${product._id || product.id}`}>
                    <h3 className="font-bold text-lg mb-2 hover:text-primary transition">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-primary">
                      ${product.price.toFixed(2)}
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
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}