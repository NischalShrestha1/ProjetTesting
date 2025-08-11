import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FeaturedProducts from './components/FeaturedProducts';
import Categories from './components/Categories';
import Footer from './components/Footer';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import ShopPage from './pages/ShopPage';
import AboutPage from './pages/AboutPage';
import SearchResultsPage from './pages/SearchResultsPage';
import CategoryPage from './pages/CategoryPage';
import AdminPanel from './pages/AdminPanel';
import AuthModal from './components/AuthModal';
import productsData from './data/products.json';
import categoriesData from './data/categories.json';

function App() {
  // State management
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [searchResults, setSearchResults] = useState([]);
  const [sortOption, setSortOption] = useState('default');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState(null);

  // Initialize data and check auth status
  useEffect(() => {
    // Simulate API call
    const loadData = async () => {
      try {
        // In a real app, these would be fetch calls
        setProducts(productsData);
        
        const updatedCategories = categoriesData.map(category => ({
          ...category,
          count: productsData.filter(p => p.category === category.id).length
        }));
        
        setCategories(updatedCategories);
        
        // Check for existing session
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setIsAdmin(userData.role === 'admin');
        }
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Persist cart to localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Cart operations
  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const updateCartItem = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (id) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Search functionality
  const handleSearch = (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    const results = products.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase()) ||
      (categories.find(c => c.id === product.category)?.name.toLowerCase().includes(query.toLowerCase())) ||
      product.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
    
    setSearchResults(results);
    setSortOption('default');
  };

  // Sorting
  const handleSort = (option) => {
    setSortOption(option);
    let sortedResults = [...searchResults];
    
    switch(option) {
      case 'price-low':
        sortedResults.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sortedResults.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        sortedResults.sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
        sortedResults.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // Default sorting (relevance or original order)
        break;
    }
    
    setSearchResults(sortedResults);
  };

  // Authentication
  const handleLogin = (username, password) => {
    // In a real app, this would be an API call
    if (username === 'admin' && password === 'admin123') {
      const userData = { username, role: 'admin' };
      setUser(userData);
      setIsAdmin(true);
      localStorage.setItem('user', JSON.stringify(userData));
      setShowAuthModal(false);
      return true;
    } else if (username && password) {
      // Regular user login
      const userData = { username, role: 'user' };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      setShowAuthModal(false);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem('user');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar 
          cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)} 
          onSearch={handleSearch}
          isAdmin={isAdmin}
          user={user}
          setShowAuthModal={setShowAuthModal}
          onLogout={handleLogout}
        />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={
              <>
                <Hero />
                <FeaturedProducts addToCart={addToCart} products={products.slice(0, 4)} />
                <Categories categories={categories} />
              </>
            } />
            <Route path="/shop" element={
              <ShopPage 
                addToCart={addToCart} 
                products={products} 
                categories={categories}
              />
            } />
            <Route path="/categories" element={
              <Categories categories={categories} />
            } />
            <Route path="/category/:id" element={
              <CategoryPage 
                addToCart={addToCart} 
                products={products} 
                categories={categories} 
              />
            } />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/product/:id" element={
              <ProductPage 
                addToCart={addToCart} 
                products={products} 
              />
            } />
            <Route path="/cart" element={
              <CartPage 
                cart={cart} 
                updateCartItem={updateCartItem}
                removeFromCart={removeFromCart}
                clearCart={clearCart}
              />
            } />
            <Route path="/search" element={
              <SearchResultsPage 
                results={searchResults} 
                addToCart={addToCart} 
                sortOption={sortOption}
                onSort={handleSort}
              />
            } />
            <Route path="/admin" element={
              isAdmin ? (
                <AdminPanel 
                  products={products} 
                  categories={categories} 
                  setProducts={setProducts} 
                  setCategories={setCategories} 
                />
              ) : (
                <Navigate to="/" />
              )
            } />
          </Routes>
        </main>
        
        <Footer />

        {/* Auth Modal */}
        {showAuthModal && (
          <AuthModal 
            onClose={() => setShowAuthModal(false)}
            onLogin={handleLogin}
          />
        )}
      </div>
    </Router>
  );
}

export default App;