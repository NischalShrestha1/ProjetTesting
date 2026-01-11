import { useParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { addToCart, selectAllProducts, selectCategories } from '../store'

export default function CategoryPage() {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectAllProducts);
  const categories = useAppSelector(selectCategories);
  const { id } = useParams() // id is the category slug like "clothing" or "posters"

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
              <ProductCard 
                key={product._id || product.id} 
                product={product} 
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
