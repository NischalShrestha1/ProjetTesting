import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import productsReducer from './slices/productsSlice';
import userReducer from './slices/userSlice';
import categoriesReducer from './slices/categoriesSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    products: productsReducer,
    user: userReducer,
    categories: categoriesReducer,
  },
});



// Re-export all cart selectors and actions for easier imports
export {
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  loadCartFromStorageAction,
  setCartLoading,
  setCartError,
  clearCartError,
} from './slices/cartSlice';

export {
  selectCartItems,
  selectCartItemCount,
  selectCartTotal,
  selectCartLoading,
  selectCartError,
  selectIsInCart,
  selectCartItemQuantity,
} from './slices/cartSlice';

// Re-export all products selectors and actions
export {
  fetchProducts,
  fetchProductById,
  fetchProductsByCategory,
  searchProducts,
  clearCurrentProduct,
  clearSearchResults,
  setFeaturedProducts,
  clearError,
  updateProductInList,
} from './slices/productsSlice';

export {
  selectAllProducts,
  selectCurrentProduct,
  selectFeaturedProducts,
  selectSearchResults,
  selectProductsLoading,
  selectSearchLoading,
  selectProductsError,
  selectSearchError,
  selectProductById,
} from './slices/productsSlice';

// Re-export all user selectors and actions
export {
  loginUser,
  registerUser,
  loadUser,
  updateUserProfile,
  logout,
  clearError as clearUserError,
  clearRegistrationSuccess,
  setLoading,
  fetchOrders,
} from './slices/userSlice';

export {
  selectUser,
  selectToken,
  selectIsAuthenticated,
  selectUserLoading,
  selectUserError,
  selectRegistrationSuccess,
  selectOrders,
} from './slices/userSlice';

// Re-export all categories selectors and actions
export {
  fetchCategories,
} from './slices/categoriesSlice';

export {
  selectCategories,
  selectCategoriesLoading,
  selectCategoriesError,
} from './slices/categoriesSlice';