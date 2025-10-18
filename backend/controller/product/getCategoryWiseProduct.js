const productModel = require('../../models/productModel');

const getCategoryWiseProduct = async (req, res) => {
  try {
    const category = (req.query && req.query.category) || (req.body && req.body.category);
    if (!category) {
      return res.status(400).json({
        message: 'Missing category',
        error: true,
        success: false,
      });
    }
    const product = await productModel.find({ category });

    res.json({
      data: product,
      message: 'Product',
      success: true,
      error: false,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message || err,
      error: true,
      success: false,
    });
  }
};

module.exports = getCategoryWiseProduct;
