const mongoose = require('mongoose');
const addToCartModel = require('../../models/cartProduct');

const addToCartController = async (req, res) => {
  try {
    const { productId } = req?.body;
    const currentUser = req.userId;

    // Convert productId to ObjectId
    let productObjId;
    try {
      productObjId = new mongoose.Types.ObjectId(productId);
    } catch (e) {
      return res.json({
        message: 'Invalid productId',
        success: false,
        error: true,
      });
    }

    const isProductAvailable = await addToCartModel.findOne({ productId: productObjId, userId: currentUser });

    if (isProductAvailable) {
      return res.json({
        message: 'Already exits in Add to cart',
        success: false,
        error: true,
      });
    }

    const payload = {
      productId: productObjId,
      quantity: 1,
      userId: currentUser,
    };

    const newAddToCart = new addToCartModel(payload);
    const saveProduct = await newAddToCart.save();

    return res.json({
      data: saveProduct,
      message: 'Product Added in Cart',
      success: true,
      error: false,
    });
  } catch (err) {
    res.json({
      message: err?.message || err,
      error: true,
      success: false,
    });
  }
};

module.exports = addToCartController;
