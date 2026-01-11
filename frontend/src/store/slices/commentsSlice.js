import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../../config/api';

// Async thunks
export const createComment = createAsyncThunk(
  'comments/createComment',
  async ({ productId, content }, { rejectWithValue, getState }) => {
    try {
      const token = getState().user.token;
      const response = await axios.post(`${API_URL}/comments`, {
        productId,
        content
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create comment');
    }
  }
);

export const getProductComments = createAsyncThunk(
  'comments/getProductComments',
  async ({ productId, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/comments/product/${productId}?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch comments');
    }
  }
);

export const updateComment = createAsyncThunk(
  'comments/updateComment',
  async ({ commentId, content }, { rejectWithValue, getState }) => {
    try {
      const token = getState().user.token;
      const response = await axios.put(`${API_URL}/comments/${commentId}`, {
        content
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update comment');
    }
  }
);

export const deleteComment = createAsyncThunk(
  'comments/deleteComment',
  async (commentId, { rejectWithValue, getState }) => {
    try {
      const token = getState().user.token;
      await axios.delete(`${API_URL}/comments/${commentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return commentId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete comment');
    }
  }
);

export const addReply = createAsyncThunk(
  'comments/addReply',
  async ({ commentId, content }, { rejectWithValue, getState }) => {
    try {
      const token = getState().user.token;
      const response = await axios.post(`${API_URL}/comments/${commentId}/replies`, {
        content
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add reply');
    }
  }
);

export const updateReply = createAsyncThunk(
  'comments/updateReply',
  async ({ commentId, replyId, content }, { rejectWithValue, getState }) => {
    try {
      const token = getState().user.token;
      const response = await axios.put(`${API_URL}/comments/${commentId}/replies/${replyId}`, {
        content
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update reply');
    }
  }
);

export const deleteReply = createAsyncThunk(
  'comments/deleteReply',
  async ({ commentId, replyId }, { rejectWithValue, getState }) => {
    try {
      const token = getState().user.token;
      await axios.delete(`${API_URL}/comments/${commentId}/replies/${replyId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return { commentId, replyId };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete reply');
    }
  }
);

const initialState = {
  comments: [],
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

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create comment
      .addCase(createComment.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.isCreating = false;
        state.comments.unshift(action.payload);
      })
      .addCase(createComment.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload;
      })
      
      // Get product comments
      .addCase(getProductComments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProductComments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.comments = action.payload.comments;
        state.pagination = action.payload.pagination;
      })
      .addCase(getProductComments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Update comment
      .addCase(updateComment.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        state.isUpdating = false;
        const index = state.comments.findIndex(c => c._id === action.payload._id);
        if (index !== -1) {
          state.comments[index] = action.payload;
        }
      })
      .addCase(updateComment.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload;
      })
      
      // Delete comment
      .addCase(deleteComment.pending, (state) => {
        state.isDeleting = true;
        state.error = null;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.comments = state.comments.filter(c => c._id !== action.payload);
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.payload;
      })
      
      // Add reply
      .addCase(addReply.fulfilled, (state, action) => {
        const index = state.comments.findIndex(c => c._id === action.payload._id);
        if (index !== -1) {
          state.comments[index] = action.payload;
        }
      })
      .addCase(addReply.rejected, (state, action) => {
        state.error = action.payload;
      })
      
      // Update reply
      .addCase(updateReply.fulfilled, (state, action) => {
        const index = state.comments.findIndex(c => c._id === action.payload._id);
        if (index !== -1) {
          state.comments[index] = action.payload;
        }
      })
      .addCase(updateReply.rejected, (state, action) => {
        state.error = action.payload;
      })
      
      // Delete reply
      .addCase(deleteReply.fulfilled, (state, action) => {
        const index = state.comments.findIndex(c => c._id === action.payload._id);
        if (index !== -1) {
          state.comments[index] = action.payload;
        }
      })
      .addCase(deleteReply.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearError } = commentsSlice.actions;

// Selectors
export const selectComments = (state) => state.comments.comments;
export const selectCommentsPagination = (state) => state.comments.pagination;
export const selectCommentsLoading = (state) => state.comments.isLoading;
export const selectCommentCreating = (state) => state.comments.isCreating;
export const selectCommentUpdating = (state) => state.comments.isUpdating;
export const selectCommentDeleting = (state) => state.comments.isDeleting;
export const selectCommentsError = (state) => state.comments.error;

export default commentsSlice.reducer;