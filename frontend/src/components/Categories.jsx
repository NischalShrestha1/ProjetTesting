import { Link } from 'react-router-dom'
import { useAppSelector } from '../store/hooks'
import { selectCategories, selectCategoriesLoading } from '../store'

export default function Categories() {
  const categories = useAppSelector(selectCategories);
  const isLoading = useAppSelector(selectCategoriesLoading);

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold font-anime text-center mb-12">
            Shop by <span className="text-primary">Category</span>
          </h2>
          <div className="text-center">
            <p>No categories available</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold font-anime text-center mb-12">
          Shop by <span className="text-primary">Category</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((category) => (
            <Link 
              to={`/category/${category.id}`} 
              key={category.id}
              className="relative rounded-lg overflow-hidden group"
            >
              <img 
                src={category.image} 
                alt={category.name} 
                className="w-full h-48 object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center">
                <h3 className="text-white text-xl font-bold mb-1">{category.name}</h3>
                <p className="text-white text-sm">
                  {category.count} items
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}