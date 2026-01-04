import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://animerch-rvt0.onrender.com/api';

// Load user from localStorage
const loadUserFromStorage = () => {
  try {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      return {
        token,
        user: JSON.parse(user),
        isAuthenticated: true,
      };
    }
  } catch (error) {
    console.error('Error loading user from localStorage:', error);
  }
  return {
    token: null,
    user: null,
    isAuthenticated: false,
  };
};

// Save user to localStorage
const saveUserToStorage = (token, user) => {
  try {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  } catch (error) {
    console.error('Error saving user to localStorage:', error);
  }
};

// Clear user from localStorage
const clearUserFromStorage = () => {
  try {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  } catch (error) {
    console.error('Error clearing user from localStorage:', error);
  }
};

// Async thunks
export const loginUser = createAsyncThunk(
  'user/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/users/login`, {
        email,
        password,
      });
      
      const { token, user } = response.data;
      saveUserToStorage(token, user);
      
      return { token, user };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'user/register',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/users/register`, {
        email,
        password,
      });
      
      const { token, user } = response.data;
      saveUserToStorage(token, user);
      
      return { token, user };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

export const loadUser = createAsyncThunk(
  'user/loadUser',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { token, user, isLoading } = getState().user;
      if (!token) {
        return rejectWithValue('No token found');
      }
      
      // Don't refetch if we already have user data and not loading
      if (user && !isLoading) {
        return user;
      }
      
      const response = await axios.get(`${API_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      return response.data;
    } catch (error) {
      clearUserFromStorage();
      return rejectWithValue(error.response?.data?.message || 'Failed to load user');
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (userData, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().user;
      const response = await axios.put(`${API_URL}/users/profile`, userData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const updatedUser = response.data;
      const { token: currentToken } = getState().user;
      saveUserToStorage(currentToken, updatedUser);
      
      return updatedUser;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
    }
  }
);

const initialState = {
  ...loadUserFromStorage(),
  isLoading: false,
  error: null,
  registrationSuccess: false,
  orders: [],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      state.registrationSuccess = false;
      clearUserFromStorage();
    },
    
    clearError: (state) => {
      state.error = null;
    },
    
    clearRegistrationSuccess: (state) => {
      state.registrationSuccess = false;
    },
    
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
      })
      
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.registrationSuccess = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.registrationSuccess = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.registrationSuccess = false;
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
      })
      
      // Load user
      .addCase(loadUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loadUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
      })
      
      // Update profile
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch orders
      .addCase(fetchOrders.pending, (state) => {
        console.log('⏳ fetchOrders pending');
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        console.log('✅ fetchOrders fulfilled:', action.payload?.length || 0, 'orders');
        state.isLoading = false;
        state.orders = action.payload;
        state.error = null;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        console.error('🚨 fetchOrders rejected:', action.payload);
        state.isLoading = false;
        state.error = action.payload;
        state.orders = [];
      });
  },
});

// Fetch orders action
export const fetchOrders = createAsyncThunk(
  'orders/fetch',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().user;
      if (!token) {
        return rejectWithValue('No token found');
      }
      
      const response = await axios.get(`${API_URL}/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      console.log('📞 fetchOrders API response:', response.data);
      return response.data.orders || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
    }
  }
);

export const logout = userSlice.actions.logout;
export const clearError = userSlice.actions.clearError;
export const clearUserError = userSlice.actions.clearError;
export const clearRegistrationSuccess = userSlice.actions.clearRegistrationSuccess;
export const setLoading = userSlice.actions.setLoading;

// Selectors
export const selectUser = (state) => state.user.user;
export const selectToken = (state) => state.user.token;
export const selectIsAuthenticated = (state) => state.user.isAuthenticated;
export const selectUserLoading = (state) => state.user.isLoading;
export const selectUserError = (state) => state.user.error;
export const selectRegistrationSuccess = (state) => state.user.registrationSuccess;
export const selectOrders = (state) => state.user.orders;

export default userSlice.reducer;
