import { useState } from 'react';

export default function AdminCategoryForm({ categories, setCategories }) {
  const [name, setName] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    const newCategory = {
      id: Date.now().toString(),
      name
    };
    setCategories([...categories, newCategory]);
    setName('');
  };

  return (
    <form onSubmit={handleAdd} className="bg-gray-100 p-4 rounded mb-4">
      <h3 className="font-bold mb-2">Add New Category</h3>
      <div className="flex gap-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Category name"
          className="p-2 border rounded flex-grow"
        />
        <button type="submit" className="px-4 py-2 bg-primary text-white rounded">Add</button>
      </div>
    </form>
  );
}
