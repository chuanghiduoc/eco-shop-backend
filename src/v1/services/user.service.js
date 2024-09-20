const User = require('../models/user.model');
const Product = require('../models/product.model');
const Order = require('../models/order.model');

const bcrypt = require('bcrypt');

const createUser = async (name, email, password) => {

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists');
  }

  const newUser = new User({
    name,
    email,
    password,
  });
  await newUser.save();

  return newUser;
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('User not found');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  return user;
}

//information about user

const getUserInfo = async (userId) => {
  const user = await User.findById(userId)
    .populate('cart.productId', 'name price') // Nếu cần lấy thêm thông tin sản phẩm trong giỏ hàng
    .populate('wishlist', 'name price') // Nếu cần lấy thông tin sản phẩm trong wishlist
    .populate('orders'); // Nếu cần lấy thông tin đơn hàng

  if (!user) {
    throw new Error('User not found');
  }

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    cart: user.cart,
    wishlist: user.wishlist,
    orders: user.orders,
  };
};

const updateUserInfo = async (userId, updateData) => {
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: updateData },
    { new: true, runValidators: true }
  );

  if (!updatedUser) {
    throw new Error('User not found');
  }

  return {
    id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    address: updatedUser.address,
    phoneNumber: updatedUser.phoneNumber,
  };
};

const updatePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    throw new Error('Current password is incorrect');
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);

  await user.save();

  return { message: 'Password updated successfully' };
};

const updateAddress = async (userId, newAddress) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  user.address = newAddress;
  
  await user.save(); 

  return { message: 'Address updated successfully', address: user.address };
};

const deleteAddress = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  user.address = '';

  await user.save();

  return { message: 'Address deleted successfully' };
};

//shopping cart

const addCart = async (userId, productId, quantity, selectedColor, selectedSize) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new Error('Product not found');
  }

  const cartItemIndex = user.cart.findIndex(item => item.productId.equals(productId));

  if (cartItemIndex >= 0) {
    user.cart[cartItemIndex].quantity += quantity;
    if (selectedColor) user.cart[cartItemIndex].selectedColor = selectedColor;
    if (selectedSize) user.cart[cartItemIndex].selectedSize = selectedSize;
  } else {
    user.cart.push({
      productId,
      quantity,
      selectedColor,
      selectedSize
    });
  }

  await user.save();
  return user.cart;
};

const removeItemCart = async (userId, productId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  const updatedCart = user.cart.filter(item => !item.productId.equals(productId));

  if (updatedCart.length === user.cart.length) {
    throw new Error('Product not found in cart');
  }

  user.cart = updatedCart;

  await user.save();
  return user.cart;
};

const changeQuantityItemCart = async (userId, productId, newQuantity) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  const itemIndex = user.cart.findIndex(item => item.productId.equals(productId));
  
  if (itemIndex === -1) {
    throw new Error('Product not found in cart');
  }

  if (newQuantity <= 0) {
    throw new Error('Quantity must be greater than 0');
  }

  user.cart[itemIndex].quantity = newQuantity;

  await user.save();
  return user.cart;
};

//wishList

const addWishlist = async (userId, productId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  if (user.wishlist.includes(productId)) {
    throw new Error('Product already in wishlist');
  }

  user.wishlist.push(productId);
  
  await user.save();

  return { message: 'Product added to wishlist successfully' };
};


const removeWishlist = async (userId, productId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  const updatedWishlist = user.wishlist.filter(id => !id.equals(productId));

  if (updatedWishlist.length === user.wishlist.length) {
    throw new Error('Product not found in wishlist');
  }

  user.wishlist = updatedWishlist;

  await user.save();
  return { message: 'Product removed from wishlist successfully' };
};

module.exports = { createUser, loginUser, getUserInfo, updateUserInfo, addCart, removeItemCart, changeQuantityItemCart, updatePassword, updateAddress, deleteAddress, addWishlist, removeWishlist };