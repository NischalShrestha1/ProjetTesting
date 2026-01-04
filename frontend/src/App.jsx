import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { 
  fetchProducts, 
  selectAllProducts, 
  selectProductsLoading,
  loadUser,
  selectUser,
  selectIsAuthenticated,
  logout as userLogout,
  fetchCategories,
  selectCategories
} from './store';
import { SocketProvider } from './contexts/SocketContext';

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
import Profile from './pages/Profile';
import OrdersPage from './pages/OrdersPage';
import ContactPage from './pages/ContactPage';
import FAQPage from './pages/FAQPage';
import ShippingPage from './pages/ShippingPage';
import ReturnsPage from './pages/ReturnsPage';
import AllProductsPage from './pages/AllProductsPage';
import OrderTrackingPage from './pages/OrderTrackingPage';


const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://animerch-gjcd.onrender.com/api';

function App() {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectAllProducts);
  const isLoading = useAppSelector(selectProductsLoading);
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const categories = useAppSelector(selectCategories);

  // Debug Redux state
  useEffect(() => {
    console.log('🏠 App Component - Redux State:', {
      isAuthenticated,
      user,
      productsCount: products.length,
      categoriesCount: categories.length
    });
  }, [isAuthenticated, user, products, categories]);

  const [searchResults, setSearchResults] = useState([]);
  const [sortOption, setSortOption] = useState('default');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Fetch products on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        await dispatch(fetchProducts()).unwrap();
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    
    fetchInitialData();
  }, [dispatch]);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        await dispatch(fetchCategories()).unwrap();
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    
    fetchCategoriesData();
  }, [dispatch]);

  

  // Check user session when authenticated
  useEffect(() => {
    if (isAuthenticated && !user) {
      const loadUserData = async () => {
        try {
          await dispatch(loadUser()).unwrap();
        } catch (error) {
          console.error('Failed to load user:', error);
        }
      };
      
      loadUserData();
    }
  }, [isAuthenticated, user, dispatch]);

  // Update admin status when user changes
  useEffect(() => {
    setIsAdmin(user?.isAdmin || false);
  }, [user]);

  // Search functionality
  const handleSearch = (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const results = products.filter(product => {
      // Check product name and description
      if (product.name?.toLowerCase().includes(query.toLowerCase()) ||
          product.description?.toLowerCase().includes(query.toLowerCase())) {
        return true;
      }
      
      // Check tags
      if (product.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))) {
        return true;
      }
      
      // Check category name
      let productCategory = null;
      if (typeof product.category === 'object' && product.category !== null) {
        productCategory = product.category;
      } else if (product.category) {
        productCategory = categories.find(c => 
          c._id === product.category || 
          String(c._id) === String(product.category) ||
          c.id === product.category
        );
      }
      
      if (productCategory?.name?.toLowerCase().includes(query.toLowerCase())) {
        return true;
      }
      
      return false;
    });

    setSearchResults(results);
    setSortOption('default');
  };

  const handleSort = (option) => {
    setSortOption(option);
    let sortedResults = [...searchResults];
    switch(option) {
      case 'price-low':
        sortedResults.sort((a,b) => a.price - b.price);
        break;
      case 'price-high':
        sortedResults.sort((a,b) => b.price - a.price);
        break;
      case 'rating':
        sortedResults.sort((a,b) => b.rating - a.rating);
        break;
      case 'name':
        sortedResults.sort((a,b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }
    setSearchResults(sortedResults);
  };

const handleLogout = async () => {
    try {
      await fetch(`${backendUrl}/api/users/logout`, {
        method: 'GET',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    dispatch(userLogout());
    setIsAdmin(false);
  };

  const handleOrderUpdate = (orders) => {
    // Handle order updates from notifications
    console.log('Orders updated:', orders);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <SocketProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar 
          onSearch={handleSearch}
          user={user}
          setShowAuthModal={setShowAuthModal}
          onLogout={handleLogout}
          isAdmin={isAdmin}
          onOrderUpdate={handleOrderUpdate}
        />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={
              <>
                <Hero />
                <FeaturedProducts products={products.slice(0, 4)} />
                <Categories />
              </>
            } />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/category/:id" element={<CategoryPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/product/:id" element={<ProductPage products={products} />} />
            <Route path="/cart" element={<CartPage user={user} setShowAuthModal={setShowAuthModal} />} />
            <Route path="/search" element={<SearchResultsPage results={searchResults} sortOption={sortOption} onSort={handleSort} />} />
            <Route path="/profile" element={user ? <Profile user={user} onLogout={handleLogout} /> : <Navigate to="/" />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/orders/:id" element={<OrderTrackingPage />} />
            
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/shipping" element={<ShippingPage />} />
            <Route path="/returns" element={<ReturnsPage />} />
            <Route path="/products/all" element={<AllProductsPage />} />
             <Route path="/adminPanel" element={isAdmin ? <AdminPanel user={user} products={products} categories={categories} /> : <Navigate to="/" />} />
          </Routes>
        </main>

        <Footer />

        {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
        </div>
      </Router>
    </SocketProvider>
  );
}

export default App;
