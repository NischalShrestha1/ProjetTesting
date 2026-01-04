import { createSlice } from '@reduxjs/toolkit';

const loadCartFromStorage = () => {
  try {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
    return [];
  }
};

const saveCartToStorage = (cart) => {
  try {
    localStorage.setItem('cart', JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

const initialState = {
  items: loadCartFromStorage(),
  isLoading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const productId = product._id || product.id;
      const existingItem = state.items.find(item => (item._id || item.id) === productId);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({
          ...product,
          quantity: 1,
          addedAt: new Date().toISOString(),
        });
      }
      
      saveCartToStorage(state.items);
    },
    
    updateCartItem: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => (item._id || item.id) === id);
      
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(item => (item._id || item.id) !== id);
        } else {
          item.quantity = quantity;
        }
        saveCartToStorage(state.items);
      }
    },
    
    removeFromCart: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter(item => (item._id || item.id) !== id);
      saveCartToStorage(state.items);
    },
    
    clearCart: (state) => {
      state.items = [];
      saveCartToStorage(state.items);
    },
    
    loadCartFromStorage: (state) => {
      state.items = loadCartFromStorage();
    },
    
    setCartLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    
    setCartError: (state, action) => {
      state.error = action.payload;
    },
    
    clearCartError: (state) => {
      state.error = null;
    },
  },
});

export const {
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  loadCartFromStorage: loadCartFromStorageAction,
  setCartLoading,
  setCartError,
  clearCartError,
} = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartItemCount = (state) => 
  state.cart.items.reduce((total, item) => total + item.quantity, 0);
export const selectCartTotal = (state) =>
  state.cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
export const selectCartLoading = (state) => state.cart.isLoading;
export const selectCartError = (state) => state.cart.error;
export const selectIsInCart = (state, productId) =>
  state.cart.items.some(item => (item._id || item.id) === productId);
export const selectCartItemQuantity = (state, productId) => {
  const item = state.cart.items.find(item => (item._id || item.id) === productId);
  return item ? item.quantity : 0;
};

export default cartSlice.reducer;