import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function AdminPanel({ products, categories, onUpdateProducts, onUpdateCategories }) {
  const [activeTab, setActiveTab] = useState('products')
  const [editingProduct, setEditingProduct] = useState(null)
  const [editingCategory, setEditingCategory] = useState(null)
  
  // Form states
  const [productForm, setProductForm] = useState({
    id: '',
    name: '',
    price: '',
    description: '',
    category: '',
    image: '',
    rating: '',
    tags: ''
  })
  
  const [categoryForm, setCategoryForm] = useState({
    id: '',
    name: '',
    image: ''
  })

  const handleProductSubmit = (e) => {
    e.preventDefault()
    const newProduct = {
      ...productForm,
      id: editingProduct ? productForm.id : Date.now().toString(),
      price: parseFloat(productForm.price),
      rating: parseFloat(productForm.rating),
      tags: productForm.tags.split(',').map(tag => tag.trim())
    }

    const updatedProducts = editingProduct
      ? products.map(p => p.id === productForm.id ? newProduct : p)
      : [...products, newProduct]

    onUpdateProducts(updatedProducts)
    setProductForm({
      id: '',
      name: '',
      price: '',
      description: '',
      category: '',
      image: '',
      rating: '',
      tags: ''
    })
    setEditingProduct(null)
  }

  const handleCategorySubmit = (e) => {
    e.preventDefault()
    const newCategory = {
      ...categoryForm,
      id: editingCategory ? categoryForm.id : Date.now().toString()
    }

    const updatedCategories = editingCategory
      ? categories.map(c => c.id === categoryForm.id ? newCategory : c)
      : [...categories, newCategory]

    onUpdateCategories(updatedCategories)
    setCategoryForm({ id: '', name: '', image: '' })
    setEditingCategory(null)
  }

  const deleteProduct = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      onUpdateProducts(products.filter(p => p.id !== id))
    }
  }

  const deleteCategory = (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      onUpdateCategories(categories.filter(c => c.id !== id))
    }
  }

  const editProduct = (product) => {
    setEditingProduct(product)
    setProductForm({
      id: product.id,
      name: product.name,
      price: product.price.toString(),
      description: product.description,
      category: product.category,
      image: product.image,
      rating: product.rating.toString(),
      tags: product.tags.join(', ')
    })
    setActiveTab('products')
  }

  const editCategory = (category) => {
    setEditingCategory(category)
    setCategoryForm({
      id: category.id,
      name: category.name,
      image: category.image
    })
    setActiveTab('categories')
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Panel</h1>
          <Link to="/" className="bg-primary text-white px-4 py-2 rounded hover:bg-pink-600">
            Back to Store
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="flex border-b">
            <button
              className={`px-6 py-3 font-medium ${activeTab === 'products' ? 'text-primary border-b-2 border-primary' : 'text-gray-600'}`}
              onClick={() => setActiveTab('products')}
            >
              Products
            </button>
            <button
              className={`px-6 py-3 font-medium ${activeTab === 'categories' ? 'text-primary border-b-2 border-primary' : 'text-gray-600'}`}
              onClick={() => setActiveTab('categories')}
            >
              Categories
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'products' ? (
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <form onSubmit={handleProductSubmit} className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={productForm.name}
                      onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                      className="w-full px-3 py-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                    <input
                      type="number"
                      value={productForm.price}
                      onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                      className="w-full px-3 py-2 border rounded"
                      step="0.01"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category ID</label>
                    <input
                      type="text"
                      value={productForm.category}
                      onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                      className="w-full px-3 py-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                    <input
                      type="text"
                      value={productForm.image}
                      onChange={(e) => setProductForm({...productForm, image: e.target.value})}
                      className="w-full px-3 py-2 border rounded"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={productForm.description}
                      onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                      className="w-full px-3 py-2 border rounded"
                      rows="3"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rating (0-5)</label>
                    <input
                      type="number"
                      value={productForm.rating}
                      onChange={(e) => setProductForm({...productForm, rating: e.target.value})}
                      className="w-full px-3 py-2 border rounded"
                      min="0"
                      max="5"
                      step="0.1"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
                    <input
                      type="text"
                      value={productForm.tags}
                      onChange={(e) => setProductForm({...productForm, tags: e.target.value})}
                      className="w-full px-3 py-2 border rounded"
                      required
                    />
                  </div>
                  <div className="md:col-span-2 flex justify-end space-x-3">
                    {editingProduct && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingProduct(null)
                          setProductForm({
                            id: '',
                            name: '',
                            price: '',
                            description: '',
                            category: '',
                            image: '',
                            rating: '',
                            tags: ''
                          })
                        }}
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="submit"
                      className="px-4 py-2 bg-primary text-white rounded hover:bg-pink-600"
                    >
                      {editingProduct ? 'Update Product' : 'Add Product'}
                    </button>
                  </div>
                </form>

                <h2 className="text-xl font-semibold mb-4">All Products</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white">
                    <thead>
                      <tr>
                        <th className="py-2 px-4 border-b">Name</th>
                        <th className="py-2 px-4 border-b">Price</th>
                        <th className="py-2 px-4 border-b">Category</th>
                        <th className="py-2 px-4 border-b">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map(product => (
                        <tr key={product.id}>
                          <td className="py-2 px-4 border-b">{product.name}</td>
                          <td className="py-2 px-4 border-b">${product.price.toFixed(2)}</td>
                          <td className="py-2 px-4 border-b">{product.category}</td>
                          <td className="py-2 px-4 border-b space-x-2">
                            <button
                              onClick={() => editProduct(product)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteProduct(product.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  {editingCategory ? 'Edit Category' : 'Add New Category'}
                </h2>
                <form onSubmit={handleCategorySubmit} className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={categoryForm.name}
                      onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
                      className="w-full px-3 py-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                    <input
                      type="text"
                      value={categoryForm.image}
                      onChange={(e) => setCategoryForm({...categoryForm, image: e.target.value})}
                      className="w-full px-3 py-2 border rounded"
                      required
                    />
                  </div>
                  <div className="md:col-span-2 flex justify-end space-x-3">
                    {editingCategory && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCategory(null)
                          setCategoryForm({ id: '', name: '', image: '' })
                        }}
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="submit"
                      className="px-4 py-2 bg-primary text-white rounded hover:bg-pink-600"
                    >
                      {editingCategory ? 'Update Category' : 'Add Category'}
                    </button>
                  </div>
                </form>

                <h2 className="text-xl font-semibold mb-4">All Categories</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white">
                    <thead>
                      <tr>
                        <th className="py-2 px-4 border-b">Name</th>
                        <th className="py-2 px-4 border-b">Image</th>
                        <th className="py-2 px-4 border-b">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map(category => (
                        <tr key={category.id}>
                          <td className="py-2 px-4 border-b">{category.name}</td>
                          <td className="py-2 px-4 border-b">
                            {category.image && (
                              <img src={category.image} alt={category.name} className="h-10 object-cover" />
                            )}
                          </td>
                          <td className="py-2 px-4 border-b space-x-2">
                            <button
                              onClick={() => editCategory(category)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteCategory(category.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}