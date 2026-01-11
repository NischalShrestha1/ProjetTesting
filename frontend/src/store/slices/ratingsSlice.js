import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../../config/api';

// Async thunks
export const createRating = createAsyncThunk(
  'ratings/createRating',
  async ({ productId, rating, review }, { rejectWithValue, getState }) => {
    try {
      const token = getState().user.token;
      const response = await axios.post(`${API_URL}/ratings`, {
        productId,
        rating,
        review
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create rating');
    }
  }
);

export const getProductRatings = createAsyncThunk(
  'ratings/getProductRatings',
  async ({ productId, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/ratings/product/${productId}?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch ratings');
    }
  }
);

export const getUserRating = createAsyncThunk(
  'ratings/getUserRating',
  async (productId, { rejectWithValue, getState }) => {
    try {
      const token = getState().user.token;
      const response = await axios.get(`${API_URL}/ratings/user/${productId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return null; // No rating found
      }
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user rating');
    }
  }
);

export const updateRating = createAsyncThunk(
  'ratings/updateRating',
  async ({ ratingId, rating, review }, { rejectWithValue, getState }) => {
    try {
      const token = getState().user.token;
      const response = await axios.put(`${API_URL}/ratings/${ratingId}`, {
        rating,
        review
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update rating');
    }
  }
);

export const deleteRating = createAsyncThunk(
  'ratings/deleteRating',
  async (ratingId, { rejectWithValue, getState }) => {
    try {
      const token = getState().user.token;
      await axios.delete(`${API_URL}/ratings/${ratingId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return ratingId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete rating');
    }
  }
);

const initialState = {
  ratings: [],
  userRating: null,
  distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  },
  isLoading: false,
  error: null,
  isCreating: false,
  isUpdating: false,
  isDeleting: false
};

const ratingsSlice = createSlice({
  name: 'ratings',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearUserRating: (state) => {
      state.userRating = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create rating
      .addCase(createRating.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createRating.fulfilled, (state, action) => {
        state.isCreating = false;
        state.userRating = action.payload;
        state.ratings.unshift(action.payload);
      })
      .addCase(createRating.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload;
      })
      
      // Get product ratings
      .addCase(getProductRatings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProductRatings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ratings = action.payload.ratings;
        state.pagination = action.payload.pagination;
        state.distribution = action.payload.distribution;
      })
      .addCase(getProductRatings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Get user rating
      .addCase(getUserRating.fulfilled, (state, action) => {
        state.userRating = action.payload;
      })
      
      // Update rating
      .addCase(updateRating.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateRating.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.userRating = action.payload;
        const index = state.ratings.findIndex(r => r._id === action.payload._id);
        if (index !== -1) {
          state.ratings[index] = action.payload;
        }
      })
      .addCase(updateRating.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload;
      })
      
      // Delete rating
      .addCase(deleteRating.pending, (state) => {
        state.isDeleting = true;
        state.error = null;
      })
      .addCase(deleteRating.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.userRating = null;
        state.ratings = state.ratings.filter(r => r._id !== action.payload);
      })
      .addCase(deleteRating.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearUserRating } = ratingsSlice.actions;

// Selectors
export const selectRatings = (state) => state.ratings.ratings;
export const selectUserRating = (state) => state.ratings.userRating;
export const selectRatingsDistribution = (state) => state.ratings.distribution;
export const selectRatingsPagination = (state) => state.ratings.pagination;
export const selectRatingsLoading = (state) => state.ratings.isLoading;
export const selectRatingCreating = (state) => state.ratings.isCreating;
export const selectRatingUpdating = (state) => state.ratings.isUpdating;
export const selectRatingDeleting = (state) => state.ratings.isDeleting;
export const selectRatingsError = (state) => state.ratings.error;

export default ratingsSlice.reducer;