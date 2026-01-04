import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAppSelector, useAppDispatch } from '../store/hooks'
import { selectAllProducts, fetchProductById, selectCurrentProduct, addToCart } from '../store'

export default function ProductPage() {
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const allProducts = useAppSelector(selectAllProducts);
  const currentProduct = useAppSelector(selectCurrentProduct);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const loadProduct = () => {
      // First try to find in existing products
      const foundProduct = allProducts.find(p => (p._id || p.id) === id);
      if (foundProduct) {
        setProduct(foundProduct);
      } else {
        // If not found, fetch by ID
        dispatch(fetchProductById(id));
      }
    };

    loadProduct();
  }, [id, dispatch]);

  useEffect(() => {
    if (currentProduct) {
      setProduct(currentProduct);
    }
  }, [currentProduct]);

  if (!product) {
    return (
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
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
              onClick={() => dispatch(addToCart(product))}
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