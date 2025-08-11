import { useParams } from 'react-router-dom'

export default function ProductPage({ addToCart }) {
  const { id } = useParams()
  
  // In a real app, you would fetch this data based on the ID
  const product = {
    id: 1,
    name: 'Naruto Hoodie',
    price: 39.99,
    image: 'https://via.placeholder.com/600x600/3B82F6/FFFFFF?text=Naruto+Hoodie',
    category: 'Clothing',
    description: 'Premium quality hoodie featuring Naruto Uzumaki. Made from 80% cotton and 20% polyester for maximum comfort. Machine washable. Available in sizes S-XXL.'
  }

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full rounded-lg shadow-md"
            />
          </div>
          
          <div>
            <h1 className="text-3xl font-bold font-anime mb-4">{product.name}</h1>
            <p className="text-2xl text-primary font-bold mb-6">${product.price.toFixed(2)}</p>
            
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-2">Description</h2>
              <p className="text-gray-700">{product.description}</p>
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-2">Size</h2>
              <div className="flex space-x-2">
                {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                  <button 
                    key={size}
                    className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            
            <button 
              onClick={() => addToCart(product)}
              className="w-full bg-primary hover:bg-pink-600 text-white font-bold py-3 px-6 rounded transition"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}