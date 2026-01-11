import { useAppDispatch } from '../store/hooks';
import ProductCard from './ProductCard';

export default function FeaturedProducts({ products }) {
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