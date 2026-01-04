import { useAppDispatch } from '../store/hooks';
import { addToCart } from '../store';

export default function FeaturedProducts({ products }) {
  const dispatch = useAppDispatch();
  // Use first 4 products as featured or filter as needed
  const featuredProducts = products.slice(0, 4)
  
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold font-anime text-center mb-12">
          Featured <span className="text-primary">Products</span>
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map(product => (
            <div key={product.id} className="bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition">
              <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-4">${product.price.toFixed(2)}</p>
                <button 
                  onClick={() => dispatch(addToCart(product))}
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