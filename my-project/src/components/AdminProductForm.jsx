import { useState } from 'react';

export default function AdminProductForm({ products, setProducts, categories }) {
  const [form, setForm] = useState({ name: '', price: '', category: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = (e) => {
    e.preventDefault();
    const newProduct = {
      id: Date.now(),
      name: form.name,
      price: parseFloat(form.price),
      category: form.category
    };
    setProducts([...products, newProduct]);
    setForm({ name: '', price: '', category: '' });
  };

  return (
    <form onSubmit={handleAdd} className="bg-gray-100 p-4 rounded mb-4">
      <h3 className="font-bold mb-2">Add New Product</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input name="name" placeholder="Product name" value={form.name} onChange={handleChange} className="p-2 border rounded" />
        <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} className="p-2 border rounded" />
        <select name="category" value={form.category} onChange={handleChange} className="p-2 border rounded">
          <option value="">Select category</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>
      <button type="submit" className="mt-3 px-4 py-2 bg-primary text-white rounded">Add Product</button>
    </form>
  );
}
