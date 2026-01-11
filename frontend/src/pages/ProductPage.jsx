import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAppSelector, useAppDispatch } from '../store/hooks'
import { selectAllProducts, fetchProductById, selectCurrentProduct, addToCart, selectCartError, clearCartError } from '../store'
import RatingComponent from '../components/RatingComponent'
import CommentComponent from '../components/CommentComponent'

export default function ProductPage() {
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const cartError = useAppSelector(selectCartError);
  const allProducts = useAppSelector(selectAllProducts);
  const currentProduct = useAppSelector(selectCurrentProduct);
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);

  // Get available sizes from product or use defaults
  const getAvailableSizes = (product) => {
    return product?.sizes || ['S', 'M', 'L', 'XL'];
  };

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
      // Set selected size to first available size if current selection not available
      const availableSizes = getAvailableSizes(currentProduct);
      if (!availableSizes.includes(selectedSize)) {
        setSelectedSize(availableSizes[0]);
      }
    }
  }, [currentProduct, selectedSize]);

  useEffect(() => {
    const handleStockUpdate = (event) => {
      const { productId, newStock, newThreshold } = event.detail;
      if (product && product._id === productId) {
        setProduct({
          ...product,
          stock: newStock,
          lowStockThreshold: newThreshold
        });
      }
    };

    window.addEventListener('stock-updated', handleStockUpdate);

    return () => {
      window.removeEventListener('stock-updated', handleStockUpdate);
    }
  }, [product]);

  if (!product) {
    return (
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        {/* Product Images */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Main Product Image */}
          <div>
            <div className="relative">
              <img 
                src={product.images && product.images.length > 0 ? product.images[0] : product.image} 
                alt={product.name}
                className="w-full h-[600px] object-contain rounded-lg bg-gray-50"
              />
            </div>
            
            {/* Thumbnail Gallery */}
            {product.images && product.images.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <img 
                    key={index}
                    src={image} 
                    alt={`${product.name} - Image ${index + 1}`}
                    className="w-full h-24 object-cover rounded cursor-pointer hover:opacity-80 transition"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6 lg:pl-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold">{product.name}</h1>
                {product.rating && (
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-400 text-2xl">⭐</span>
                    <span className="text-lg font-semibold">
                      {product.averageRating ? product.averageRating.toFixed(1) : 'No rating'}
                    </span>
                    <span className="text-gray-600">
                      ({product.ratingCount || 0} {product.ratingCount === 1 ? 'review' : 'reviews'})
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Product Price */}
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">${product.price}</div>
              <div className="text-sm text-gray-500">per item</div>
            </div>
            
            {/* Product Description */}
            {product.description && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Description</h2>
                <p className="text-gray-600">{product.description}</p>
              </div>
            )}
            
            {/* Product Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-2">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Stock Status */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Stock Status</h2>
              <div className="flex items-center gap-2">
                <span className={`font-medium ${
                  (product.stock || 0) === 0 ? 'text-red-600' : 
                  (product.stock || 0) <= (product.lowStockThreshold || 10) ? 'text-yellow-600' : 'text-green-600'
                }`}>
                  {(product.stock || 0) === 0 ? '🔴 Out of Stock' : 
                   (product.stock || 0) <= (product.lowStockThreshold || 10) ? '⚠️ Low Stock' : '✅ In Stock'}
                </span>
                {(product.stock || 0) > 0 && (
                  <span className="text-gray-600 text-sm">
                    ({product.stock} units available)
                  </span>
                )}
              </div>
            </div>
            
            
            
            {/* Quantity Selection */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Select Options</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Size</label>
                <div className="flex space-x-2 flex-wrap">
                  {getAvailableSizes(product).map(size => (
                    <button 
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded transition ${
                        selectedSize === size
                          ? 'bg-primary text-white border-primary' 
                          : 'border border-gray-300 hover:bg-gray-100'
                      } focus:outline-none focus:ring-2 focus:ring-primary`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Quantity</label>
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 border border-gray-300 rounded hover:bg-gray-100 flex items-center justify-center"
                  >
                    -
                  </button>
                  <input 
                    type="number"
                    min="1"
                    max={product.stock || 1}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock || 1, parseInt(e.target.value) || 1)))}
                    className="w-20 text-center border border-gray-300 rounded px-2 py-1"
                  />
                  <button 
                    onClick={() => setQuantity(Math.min(product.stock || 1, quantity + 1))}
                    className="w-10 h-10 border border-gray-300 rounded hover:bg-gray-100 flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-gray-600 mt-1">
                  Max available: {product.stock || 0}
                </span>
              </div>
            </div>
            
            {/* Cart Error Display */}
            {cartError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-red-800 font-medium">🛒 Cart Error: {cartError}</span>
                  <button
                    onClick={() => {
                      dispatch(clearCartError());
                      dispatch(fetchProductById(id)); // Refresh product stock info
                    }}
                    className="text-red-600 hover:text-red-800 text-sm underline"
                  >
                    Dismiss & Refresh
                  </button>
                </div>
              </div>
            )}
            
            {/* Add to Cart Button */}
            <button 
              onClick={() => {
                console.log('🛒 Add to Cart clicked:', {
                  productName: product.name,
                  selectedSize,
                  quantity,
                  currentStock: product.stock,
                  stockThreshold: product.lowStockThreshold
                });
                dispatch(addToCart({
                  ...product,
                  selectedSize,
                  quantity
                }));
                // Clear any previous cart errors when attempting to add
                setTimeout(() => dispatch(clearCartError()), 100);
              }}
              disabled={product.stock === 0 || quantity > (product.stock || 0)}
              className={`w-full font-bold py-3 px-6 rounded transition mb-4 ${
                product.stock > 0 && quantity <= (product.stock || 0)
                  ? 'bg-primary hover:bg-pink-600 text-white' 
                  : 'bg-gray-400 text-gray-200 cursor-not-allowed'
              }`}
            >
              {product.stock === 0 ? '🔴 Out of Stock' : 
               quantity > (product.stock || 0) ? '⚠️ Exceeds Available Stock' : 
               'Add to Cart'}
            </button>
            
            {product.stock > 0 && product.stock <= (product.lowStockThreshold || 10) && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  ⚠️ Low Stock Alert: Only {product.stock} units remaining!
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Product Category Information */}
        {product.category && (
          <div className="mt-12 p-6 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Category Information</h2>
            <div className="flex items-center gap-4">
              {product.category.image && (
                <img 
                  src={product.category.image} 
                  alt={product.category.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
              )}
              <div>
                <h3 className="font-bold text-lg">{product.category.name}</h3>
                {product.category.description && (
                  <p className="text-gray-600 text-sm">{product.category.description}</p>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Ratings and Comments Section */}
        <div className="mt-16">
          <div className="border-t pt-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Customer Reviews</h2>
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-400 text-2xl">⭐</span>
                    <span className="text-lg font-semibold">
                      {product.averageRating ? product.averageRating.toFixed(1) : 'No rating'}
                    </span>
                    <span className="text-gray-600">
                      ({product.ratingCount || 0} {product.ratingCount === 1 ? 'review' : 'reviews'})
                    </span>
                  </div>
                </div>
                <RatingComponent productId={product._id || product.id} productName={product.name} />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Customer Comments</h2>
                  <span className="text-gray-600">
                    Share your experience with this product
                  </span>
                </div>
                <CommentComponent productId={product._id || product.id} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}