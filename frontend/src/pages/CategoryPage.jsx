import { useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { addToCart, selectAllProducts, selectCategories } from '../store'

export default function CategoryPage() {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectAllProducts);
  const categories = useAppSelector(selectCategories);
  const { id } = useParams() // id is the category slug like "clothing" or "posters"

  // Find category by string id
  const category = categories.find(cat => cat.id === id || cat._id === id)

  // Filter products that belong to this category
  // Handle both populated category objects and category IDs
  const categoryProducts = products.filter(product => {
    // If category is populated (object), check its id field (slug)
    if (product.category && typeof product.category === 'object' && product.category._id) {
      return product.category.id === id || product.category._id === id;
    }
    
    // If category is a string/ObjectId, find the category and compare by id (slug)
    if (product.category) {
      const productCategory = categories.find(cat => 
        cat._id === product.category || 
        String(cat._id) === String(product.category) ||
        cat.id === product.category
      );
      
      return productCategory && productCategory.id === id;
    }
    
    // If no category but has tags, try to match by tags
    if (!product.category && product.tags && Array.isArray(product.tags)) {
      const matchedCategory = categories.find(cat => {
        if (cat.id !== id) return false;
        const categoryNameLower = cat.name.toLowerCase();
        const categoryIdLower = cat.id.toLowerCase();
        return product.tags.some(tag => {
          const tagLower = tag.toLowerCase();
          return tagLower.includes(categoryIdLower) || 
                 categoryNameLower.includes(tagLower) ||
                 tagLower.includes('clothing') && categoryIdLower === 'clothing' ||
                 tagLower.includes('figure') && categoryIdLower === 'figures' ||
                 tagLower.includes('poster') && categoryIdLower === 'posters' ||
                 (tagLower.includes('keychain') || tagLower.includes('accessory')) && categoryIdLower === 'accessories';
        });
      });
      return !!matchedCategory;
    }
    
    return false;
  })

  if (!category) {
    return (
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold font-anime mb-8">Category not found</h1>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold font-anime mb-8">
          {category.name} <span className="text-primary">Collection</span>
        </h1>
        <p className="text-gray-600 mb-8 max-w-2xl">{category.description}</p>

        {categoryProducts.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">No products in this category yet</h2>
            <p className="text-gray-600">Check back soon for new arrivals!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {categoryProducts.map(product => (
              <div key={product._id} className="bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition">
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
                    onClick={() => dispatch(addToCart(product))}
                    className="w-full bg-primary hover:bg-pink-600 text-white py-2 rounded transition"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
