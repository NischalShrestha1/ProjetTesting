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
      const { selectedSize = 'M', quantity = 1 } = product;
      
      // Create a unique key for this item (product + size combination)
      const itemKey = `${productId}_${selectedSize}`;
      const existingItem = state.items.find(item => {
        const itemId = item._id || item.id;
        const itemSize = item.selectedSize || 'M';
        return `${itemId}_${itemSize}` === itemKey;
      });
      
      const availableStock = product.stock || 0;
      const totalRequestedQuantity = existingItem ? existingItem.quantity + quantity : quantity;
      
      console.log('🛒 Cart Debug:', {
        productName: product.name,
        selectedSize,
        quantity,
        availableStock,
        totalRequestedQuantity,
        existingItem: existingItem ? 'found' : 'not found'
      });
      
      if (existingItem) {
        // Check if adding quantity would exceed stock
        if (totalRequestedQuantity > availableStock) {
          console.log('❌ Stock exceeded:', totalRequestedQuantity, '>', availableStock);
          state.error = `Cannot add more ${product.name} (${selectedSize}). Only ${availableStock} available in stock.`;
          return;
        }
        existingItem.quantity = totalRequestedQuantity;
        // Update stock info in case it changed
        existingItem.stock = availableStock;
        existingItem.lowStockThreshold = product.lowStockThreshold;
        console.log('✅ Updated existing item quantity to:', existingItem.quantity);
      } else {
        // Check if product is in stock
        if (availableStock < quantity) {
          console.log('❌ Insufficient stock:', availableStock, '<', quantity);
          state.error = `Cannot add ${product.name} (${selectedSize}). Only ${availableStock} available in stock.`;
          return;
        }
        state.items.push({
          ...product,
          selectedSize,
          quantity,
          addedAt: new Date().toISOString(),
        });
        console.log('✅ Added new item to cart');
      }
      
      state.error = null; // Clear any previous errors
      saveCartToStorage(state.items);
      console.log('💾 Cart updated, total items:', state.items.length);
    },
    
updateCartItem: (state, action) => {
      const { id, quantity, selectedSize } = action.payload;
      // Create the same unique key used in addToCart
      const itemKey = `${id}_${selectedSize || 'M'}`;
      const item = state.items.find(item => {
        const itemId = item._id || item.id;
        const itemSize = item.selectedSize || 'M';
        return `${itemId}_${itemSize}` === itemKey;
      });
      
      if (item) {
        const availableStock = item.stock || 0;
        if (quantity > availableStock) {
          state.error = `Cannot update ${item.name} (${selectedSize || 'M'}). Only ${availableStock} available in stock.`;
          return;
        }
        if (quantity <= 0) {
          state.error = `Quantity must be at least 1.`;
          return;
        }
        item.quantity = Math.max(1, quantity);
      }
      
      state.error = null; // Clear any previous errors
      saveCartToStorage(state.items);
    },
    
    removeFromCart: (state, action) => {
      const { id, selectedSize } = action.payload;
      const itemKey = `${id}_${selectedSize || 'M'}`;
      state.items = state.items.filter(item => {
        const itemId = item._id || item.id;
        const itemSize = item.selectedSize || 'M';
        return `${itemId}_${itemSize}` !== itemKey;
      });
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

    updateCartItemStock: (state, action) => {
      const { productId, newStock, newThreshold } = action.payload;
      const item = state.items.find(item => (item._id || item.id) === productId);
      
      if (item) {
        item.stock = newStock;
        if (newThreshold !== undefined) {
          item.lowStockThreshold = newThreshold;
        }
        
        // If cart quantity exceeds new stock, reduce it
        if (item.quantity > newStock) {
          item.quantity = newStock;
          state.error = `Cart quantity for ${item.name} reduced to ${newStock} due to stock limitations.`;
        }
      }
      
      saveCartToStorage(state.items);
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
  updateCartItemStock,
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
export const checkStockAvailability = (state, productId, quantity = 1) => {
  const item = state.cart.items.find(item => (item._id || item.id) === productId);
  if (!item) return true; // Item not in cart, can add
  const availableStock = item.stock || 0;
  const currentQuantity = item.quantity || 0;
  return (currentQuantity + quantity) <= availableStock;
};
export const getItemAvailableStock = (state, productId) => {
  const item = state.cart.items.find(item => (item._id || item.id) === productId);
  return item ? (item.stock || 0) : null;
};

export default cartSlice.reducer;