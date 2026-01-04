import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://animerch-gjcd.onrender.com/api';

// Async thunks
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { getState, rejectWithValue }) => {
    try {
      // Check if we already have fresh data (cached for 5 minutes)
      const state = getState();
      const cachedProducts = state.products.products;
      const lastFetched = state.products.lastFetched;
      
      if (cachedProducts.length > 0 && lastFetched) {
        const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
        if (new Date(lastFetched).getTime() > fiveMinutesAgo) {
          return cachedProducts; // Return cached data
        }
      }
      
      // Fetch products
      const response = await axios.get(`${API_URL}/products`);
      const products = response.data;
      
      return products;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/products/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch product');
    }
  }
);

export const fetchProductsByCategory = createAsyncThunk(
  'products/fetchProductsByCategory',
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/products/category/${categoryId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products by category');
    }
  }
);

export const searchProducts = createAsyncThunk(
  'products/searchProducts',
  async (query, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/products/search?q=${query}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to search products');
    }
  }
);

const initialState = {
  products: [],
  currentProduct: null,
  featuredProducts: [],
  categories: [],
  searchResults: [],
  isLoading: false,
  error: null,
  searchLoading: false,
  searchError: null,
  lastFetched: null, // Add timestamp for caching
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
    
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.searchError = null;
    },
    
    setFeaturedProducts: (state, action) => {
      state.featuredProducts = action.payload;
    },
    
    clearError: (state) => {
      state.error = null;
      state.searchError = null;
    },
    
    updateProductInList: (state, action) => {
      const updatedProduct = action.payload;
      const index = state.products.findIndex(p => p._id === updatedProduct._id);
      if (index !== -1) {
        state.products[index] = updatedProduct;
      }
      if (state.currentProduct?._id === updatedProduct._id) {
        state.currentProduct = updatedProduct;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all products
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload;
        state.error = null;
        state.lastFetched = new Date().toISOString();
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch product by ID
      .addCase(fetchProductById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProduct = action.payload;
        state.error = null;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.currentProduct = null;
      })
      
      // Fetch products by category
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload;
        state.error = null;
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Search products
      .addCase(searchProducts.pending, (state) => {
        state.searchLoading = true;
        state.searchError = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload;
        state.searchError = null;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.searchLoading = false;
        state.searchError = action.payload;
        state.searchResults = [];
      });
  },
});

export const {
  clearCurrentProduct,
  clearSearchResults,
  setFeaturedProducts,
  clearError,
  updateProductInList,
} = productsSlice.actions;

// Selectors
export const selectAllProducts = (state) => state.products.products;
export const selectCurrentProduct = (state) => state.products.currentProduct;
export const selectFeaturedProducts = (state) => state.products.featuredProducts;
export const selectSearchResults = (state) => state.products.searchResults;
export const selectProductsLoading = (state) => state.products.isLoading;
export const selectSearchLoading = (state) => state.products.searchLoading;
export const selectProductsError = (state) => state.products.error;
export const selectSearchError = (state) => state.products.searchError;
export const selectProductById = (state, productId) =>
  state.products.products.find(p => p._id === productId);

export default productsSlice.reducer;
