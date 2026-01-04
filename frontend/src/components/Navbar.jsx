import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAppSelector } from '../store/hooks'
import { selectCartItemCount, selectUser, selectIsAuthenticated } from '../store'
import AuthModal from './AuthModal'
import SearchBar from './SearchBar'
import NotificationBell from './NotificationBell'

export default function Navbar({ onSearch, user, setShowAuthModal, onLogout, isAdmin, onOrderUpdate }) {
  const cartCount = useAppSelector(selectCartItemCount);
  const currentUser = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [showUserDropdown, setShowUserDropdown] = useState(false)

  const navLinks = [
    { path: '/', name: 'Home' },
    { path: '/shop', name: 'Shop' },
    { path: '/categories', name: 'Categories' },
    { path: '/about', name: 'About' },
    ...(isAdmin ? [{ path: '/adminPanel', name: 'Dashboard' }] : [])
  ]

  const handleSearch = (e) => {
    e.preventDefault()
    onSearch(searchQuery)
    setSearchQuery('')
    setSearchOpen(false)
    navigate('/search')
  }

  const handleLogout = async () => {
    setShowUserDropdown(false)
    if (onLogout) {
      await onLogout()
    }
    navigate('/')
  }

  // Check if profile is complete
  const isProfileComplete = currentUser && currentUser.username && currentUser.firstname && currentUser.lastname && currentUser.address && currentUser.phone

  return (
    <nav className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          {/* Desktop Navbar */}
          <div className="hidden md:flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold font-anime hover:text-primary transition">
              Anime<span className="text-primary">Merch</span>
            </Link>
          
          <div className="flex space-x-6 items-center">
            {navLinks.map((link) => (
              <Link 
                key={link.path}
                to={link.path}
                className={`hover:text-primary transition ${
                  location.pathname === link.path ? 'text-primary font-medium' : ''
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
          
          <div className="flex items-center space-x-4">
            {searchOpen ? (
              <div className="relative">
                <SearchBar 
                  onSearch={onSearch}
                  onClose={() => setSearchOpen(false)}
                />
              </div>
            ) : (
              <button 
                onClick={() => setSearchOpen(true)}
                className="p-2 rounded-full hover:bg-gray-700 transition"
                aria-label="Search"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            )}
            
            {currentUser ? (
              <div className="relative">
                <button 
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center space-x-1 hover:text-primary transition"
                  aria-haspopup="true"
                  aria-expanded={showUserDropdown}
                >
                  <span className="hidden sm:inline">{currentUser.username || 'User'}</span>
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center relative">
                    <span className="text-sm font-medium">
                      {currentUser.username ? currentUser.username.charAt(0).toUpperCase() : 'U'}
                    </span>
                    {!isProfileComplete && (
                      <span className="absolute -top-1 -right-1 bg-red-500 h-3 w-3 rounded-full" title="Complete your profile"></span>
                    )}
                  </div>
                </button>
                {showUserDropdown && (
                  <div 
                    className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-50"
                    onMouseLeave={() => setShowUserDropdown(false)}
                  >
                    {!isProfileComplete && (
                      <div className="px-4 py-2 text-sm text-yellow-300">
                        Complete your profile
                      </div>
                    )}
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm hover:bg-gray-700"
                      onClick={() => setShowUserDropdown(false)}
                    >
                      Edit Profile
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/adminPanel"
                        className="block px-4 py-2 text-sm hover:bg-gray-700"
                        onClick={() => setShowUserDropdown(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-700"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button 
                onClick={() => setShowAuthModal(true)}
                className="hover:text-primary transition flex items-center space-x-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                <span className="hidden sm:inline">Login</span>
              </button>
            )}
            
            <NotificationBell onOrderUpdate={onOrderUpdate} />
            
            <Link 
              to="/cart" 
              className="p-2 rounded-full hover:bg-gray-700 transition relative"
              aria-label="Cart"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

{/* Mobile Navbar */}
        <div className="md:hidden flex justify-between items-center">
          <div>
<Link to="/" className="hover:text-primary transition">
                  <span className="logo-a">A</span>
                  <span className="logo-m">M</span>
                  <span className="logo-text">nime Merch</span>
                </Link>
            </div>
            
            <div className="flex items-center space-x-1">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full hover:bg-gray-700 transition"
              aria-label="Menu"
              aria-expanded={mobileMenuOpen}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
            
            {/* Mobile Search */}
            {/* Mobile Search */}
            {searchOpen ? (
              <div className="absolute top-full left-0 right-0 z-50 p-2 bg-gray-900 border-t border-gray-800">
                <SearchBar 
                  onSearch={onSearch}
                  onClose={() => setSearchOpen(false)}
                />
              </div>
            ) : (
              <button 
                onClick={() => setSearchOpen(true)}
                className="p-2 rounded-full hover:bg-gray-700 transition"
                aria-label="Search"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
)}
            
            <NotificationBell onOrderUpdate={onOrderUpdate} />
            
            <Link 
              to="/cart" 
              className="p-2 rounded-full hover:bg-gray-700 transition relative"
              aria-label="Cart"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-gray-700">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link 
                  key={link.path}
                  to={link.path}
                  className={`hover:text-primary transition px-2 py-1 rounded ${
                    location.pathname === link.path ? 'text-primary font-medium bg-gray-800' : ''
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              
              <div className="border-t border-gray-700 pt-3 mt-3">
                {currentUser ? (
                  <>
                    <div className="flex items-center space-x-2 px-2 py-2 bg-gray-800 rounded">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                        <span className="text-sm font-medium">
                          {currentUser.username ? currentUser.username.charAt(0).toUpperCase() : 'U'}
                        </span>
                      </div>
                      <span className="text-sm">{currentUser.username || 'User'}</span>
                      {!isProfileComplete && (
                        <span className="bg-red-500 h-2 w-2 rounded-full" title="Complete your profile"></span>
                      )}
                    </div>
                    
                    <Link
                      to="/profile"
                      className="hover:text-primary transition px-2 py-1 rounded"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Edit Profile
                    </Link>
                    
                    {isAdmin && (
                      <Link
                        to="/adminPanel"
                        className="hover:text-primary transition px-2 py-1 rounded"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    
                    <button
                      onClick={() => {
                        handleLogout()
                        setMobileMenuOpen(false)
                      }}
                      className="text-left hover:text-primary transition px-2 py-1 rounded w-full"
                    >
                      Sign out
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => {
                      setShowAuthModal(true)
                      setMobileMenuOpen(false)
                    }}
                    className="hover:text-primary transition px-2 py-1 rounded flex items-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    <span>Login</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Mobile Search Bar - Handled in mobile section above */}
        </div>
      </nav>
  )
}