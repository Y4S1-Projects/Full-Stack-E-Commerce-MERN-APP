const mongoose = require('mongoose');

const addToCart = mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'product',
    },
    quantity: Number,
    userId: String,
  },
  {
    timestamps: true,
  }
);

const addToCartModel = mongoose.model('addToCart', addToCart);

module.exports = addToCartModel;
