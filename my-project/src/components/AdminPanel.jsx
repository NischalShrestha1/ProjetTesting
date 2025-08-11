import { useState } from 'react';
import AdminProductForm from '../components/AdminProductForm';
import AdminCategoryForm from '../components/AdminCategoryForm';

export default function AdminPanel({ products, setProducts, categories, setCategories }) {
  const [tab, setTab] = useState('products');

  const deleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const deleteCategory = (id) => {
    setCategories(categories.filter(c => c.id !== id));
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setTab('products')}
          className={`px-4 py-2 rounded ${tab === 'products' ? 'bg-primary text-white' : 'bg-gray-300'}`}
        >
          Products
        </button>
        <button
          onClick={() => setTab('categories')}
          className={`px-4 py-2 rounded ${tab === 'categories' ? 'bg-primary text-white' : 'bg-gray-300'}`}
        >
          Categories
        </button>
      </div>

      {tab === 'products' ? (
        <>
          <AdminProductForm products={products} setProducts={setProducts} categories={categories} />
          <ul className="mt-4 space-y-2">
            {products.map(product => (
              <li key={product.id} className="bg-white p-4 border rounded shadow-sm">
                <div className="flex justify-between">
                  <div>
                    <strong>{product.name}</strong> - ${product.price}
                  </div>
                  <button onClick={() => deleteProduct(product.id)} className="text-red-500 hover:underline">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <>
          <AdminCategoryForm categories={categories} setCategories={setCategories} />
          <ul className="mt-4 space-y-2">
            {categories.map(category => (
              <li key={category.id} className="bg-white p-4 border rounded shadow-sm">
                <div className="flex justify-between">
                  <div>{category.name}</div>
                  <button onClick={() => deleteCategory(category.id)} className="text-red-500 hover:underline">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
