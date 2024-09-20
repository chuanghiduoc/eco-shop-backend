const userService = require('../services/user.service');
const jwt = require('jsonwebtoken');
const redisClient = require('../databases/init.redis'); 

const createAccessToken = (user) => {
  return jwt.sign({ userId: user._id, role: user.role }, process.env.SECRET, { expiresIn: '15m' });
};

const createRefreshToken = (user) => {
  return jwt.sign({ userId: user._id, role: user.role }, process.env.SECRET_REFRESH, { expiresIn: '7d' });
};

const saveRefreshTokenInRedis = async (userId, refreshToken) => {
  await redisClient.set(userId.toString(), refreshToken, 'EX', 7 * 24 * 60 * 60);
};

const createUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const newUser = await userService.createUser(name, email, password);

    res.status(201).json({
      message: 'success',
      data: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });

  } catch (error) {
    if (error.message === 'User already exists') {
      return res.status(409).json({ 
        message: "failed",
        details: error.message });
    }
    res.status(400).json({ 
      message: 'failed',
      details: 'Failed to create user: ' + error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userService.loginUser(email, password);

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    saveRefreshTokenInRedis(user._id, refreshToken);

    res.status(200).json({
      message: 'success',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        accessToken,
        refreshToken,
      },
    });

  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({ 
        message: 'failed',
        details: error.message });
    }
    if (error.message === 'Invalid credentials') {
      return res.status(401).json({ 
        message: 'failed',
        details: error.message });
    }
    res.status(400).json({ 
      message: 'failed',
      details: 'Failed to login: ' + error.message });
  }
}

const logoutUser = async (req, res) => {
  const userId = req.user.userId;

  try {
    const result = await redisClient.del(userId.toString());

    if (result === 1) {
      return res.status(200).json({
        message: 'success',
        details: 'Logged out successfully',
      });
    } else {
      return res.status(404).json({
        message: 'failed',
        details: 'No refresh token found for user',
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: 'failed',
      details: 'Failed to logout: ' + error.message,
    });
  }
};

const refreshToken = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(401).json({
      message: 'failed',
      details: 'Refresh token is required',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_REFRESH);
    const userId = decoded.userId;

    const storedRefreshToken = await redisClient.get(userId.toString());
    
    if (storedRefreshToken !== token) {
      return res.status(403).json({
        message: 'failed',
        details: 'Invalid refresh token',
      });
    }

    const accessToken = createAccessToken({ userId });

    res.status(200).json({
      message: 'success',
      data: {
        accessToken,
      },
    });
  } catch (error) {
    console.error('Error refreshing token:', error);
    res.status(500).json({
      message: 'failed',
      details: 'Failed to refresh token',
    });
  }
};

//information about the user
const getUserInfo = async (req, res) => {
  const userId = req.user.userId;

  try {
    const userInfo = await userService.getUserInfo(userId);

    res.status(200).json({
      message: 'success',
      data: userInfo,
    });
  } catch (error) {
    res.status(400).json({
      message: 'failed',
      details: error.message,
    });
  }
};

const updateUserInfo = async (req, res) => {
  const userId = req.user.userId;
  const updateData = req.body;

  try {
    const updatedUser = await userService.updateUserInfo(userId, updateData);

    res.status(200).json({
      message: 'success',
      data: updatedUser,
    });
  } catch (error) {
    res.status(400).json({
      message: 'failed',
      details: error.message,
    });
  }
};

const updatePassword = async (req, res) => {
  const userId = req.user.userId; 
  const { currentPassword, newPassword } = req.body; 
  try {
    const response = await userService.updatePassword(userId, currentPassword, newPassword);
    res.status(200).json({
      message: 'success',
      data: response,
    });
  } catch (error) {
    res.status(400).json({
      message: 'failed',
      details: error.message,
    });
  }
};

const updateAddress = async (req, res) => {
  const userId = req.user.userId;
  const { address } = req.body; 

  try {
    const response = await userService.updateAddress(userId, address);
    res.status(200).json({
      message: 'success',
      data: response,
    });
  } catch (error) {
    res.status(400).json({
      message: 'failed',
      details: error.message,
    });
  }
};

const deleteAddress = async (req, res) => {
  const userId = req.user.userId;
  try {
    const response = await userService.deleteAddress(userId);
    res.status(200).json({
      message: 'success',
      data: response,
    });
  } catch (error) {
    res.status(400).json({
      message: 'failed',
      details: error.message,
    });
  }
};


//shopping cart

const addCart = async (req, res) => {
  const userId = req.user.userId;
  const { productId, quantity, selectedColor, selectedSize } = req.body;

  try {
    const updatedCart = await userService.addCart(userId, productId, quantity, selectedColor, selectedSize);

    res.status(200).json({
      message: 'success',
      data: updatedCart,
    });
  } catch (error) {
    res.status(400).json({
      message: 'failed',
      details: error.message,
    });
  }
};

const removeItemCart = async (req, res) => {
  const userId = req.user.userId;
  const { productId } = req.body;

  try {
    const updatedCart = await userService.removeItemCart(userId, productId);

    res.status(200).json({
      message: 'success',
      data: updatedCart,
    });
  } catch (error) {
    res.status(400).json({
      message: 'failed',
      details: error.message,
    });
  }
};

const changeQuantityItemCart = async (req, res) => {
  const userId = req.user.userId;
  const { productId, quantity } = req.body;

  try {
    const updatedCart = await userService.changeQuantityItemCart(userId, productId, quantity);

    res.status(200).json({
      message: 'success',
      data: updatedCart,
    });
  } catch (error) {
    res.status(400).json({
      message: 'failed',
      details: error.message,
    });
  }
};

//wishList

const addWishlist = async (req, res) => {
  const userId = req.user.userId; 
  const { productId } = req.body; 

  try {
    const response = await userService.addWishlist(userId, productId);
    res.status(200).json({
      message: 'success',
      data: response,
    });
  } catch (error) {
    res.status(400).json({
      message: 'failed',
      details: error.message,
    });
  }
};

const removeWishlist = async (req, res) => {
  const userId = req.user.userId; 
  const { productId } = req.body; 

  try {
    const response = await userService.removeWishlist(userId, productId);
    res.status(200).json({
      message: 'success',
      data: response,
    });
  } catch (error) {
    res.status(400).json({
      message: 'failed',
      details: error.message,
    });
  }
};
module.exports = { createUser, loginUser, logoutUser, refreshToken, addCart, removeItemCart, getUserInfo, updateUserInfo, changeQuantityItemCart, updatePassword, updateAddress, deleteAddress, addWishlist, removeWishlist };