const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
      type: String,
      required: true,
      trim: true,
  },
  email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
  },
  password: {
      type: String,
      required: true,
  },
  role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
  },
  isVerified: {
      type: Boolean,
      default: false,
  },
  address: {
      type: String,
      default: '',
  },
  phoneNumber: {
      type: String,
      default: '',
  },
  cart: [
      {
          productId: {
              type: Schema.Types.ObjectId,
              ref: 'Product',
          },
          quantity: {
              type: Number,
              default: 1,
          },
          selectedColor: String,
          selectedSize: String,
      },
  ],
  wishlist: [
      {
          type: Schema.Types.ObjectId,
          ref: 'Product',
      },
  ],
  orders: [
      {
          type: Schema.Types.ObjectId,
          ref: 'Order',
      },
  ],
  createdAt: {
      type: Date,
      default: Date.now,
  },
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        return next(error);
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;