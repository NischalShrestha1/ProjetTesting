import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);
  
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  });

  res.status(statusCode).json({
    success: true,
    token, // Also send token in response for localStorage storage
    user: {
      id: user._id,
      firstname: user.firstname || '',
      lastname: user.lastname || '',
      username: user.username || '',
      email: user.email,
      address: user.address || '',
      phone: user.phone || '',
      isAdmin: user.isAdmin || false,
    },
  });
};

export const register = async (req, res, next) => {
  try {
    const { email, password, firstname, lastname, username } = req.body;
    
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists',
      });
    }
    
    const userData = { email, password };
    if (firstname) userData.firstname = firstname;
    if (lastname) userData.lastname = lastname;
    // Only add username if it's provided and not empty
    if (username && username.trim()) userData.username = username;
    
    const user = await User.create(userData);
    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    console.log('Login request received:', req.body);
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('Password mismatch for user:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }
    console.log('Login successful for user:', email);
    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.log('Login error:', error);
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        firstname: user.firstname || '',
        lastname: user.lastname || '',
        username: user.username || '',
        email: user.email,
        address: user.address || '',
        phone: user.phone || '',
        isAdmin: user.isAdmin || false,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const fieldsToUpdate = {};
    if (req.body.firstname !== undefined) fieldsToUpdate.firstname = req.body.firstname;
    if (req.body.lastname !== undefined) fieldsToUpdate.lastname = req.body.lastname;
    if (req.body.username !== undefined) fieldsToUpdate.username = req.body.username;
    if (req.body.email !== undefined) fieldsToUpdate.email = req.body.email;
    if (req.body.password !== undefined) fieldsToUpdate.password = req.body.password;
    if (req.body.address !== undefined) fieldsToUpdate.address = req.body.address;
    if (req.body.phone !== undefined) fieldsToUpdate.phone = req.body.phone;

    if (req.body.email) {
      const emailExists = await User.findOne({
        email: req.body.email,
        _id: { $ne: req.user.id },
      });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: 'Email already exists',
        });
      }
    }

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        firstname: user.firstname || '',
        lastname: user.lastname || '',
        username: user.username || '',
        email: user.email,
        address: user.address || '',
        phone: user.phone || '',
        isAdmin: user.isAdmin || false,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    res.cookie('token', 'none', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: new Date(Date.now())
    });

    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select('-password');
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { email, username, firstname, lastname, address, phone, isAdmin } = req.body;
    
    const fieldsToUpdate = {};
    if (email !== undefined) fieldsToUpdate.email = email;
    if (username !== undefined) fieldsToUpdate.username = username;
    if (firstname !== undefined) fieldsToUpdate.firstname = firstname;
    if (lastname !== undefined) fieldsToUpdate.lastname = lastname;
    if (address !== undefined) fieldsToUpdate.address = address;
    if (phone !== undefined) fieldsToUpdate.phone = phone;
    if (isAdmin !== undefined) fieldsToUpdate.isAdmin = isAdmin;

    const user = await User.findByIdAndUpdate(id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const user = await User.findByIdAndDelete(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
