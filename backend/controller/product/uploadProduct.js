const { uploadProductPermission } = require('../../helpers/permission');
const productModel = require('../../models/productModel');
const { sanitizeObject } = require('../../helpers/sanitize');

async function UploadProductController(req, res) {
  try {
    const sessionUserId = req.userId;

    // Safely resolve auth0Id from possible sources (req.user, req.auth, req.jwtPayload)
    // Try to resolve auth0Id if provided; allow upload without identity
    const auth0Id = (req.user && req.user.auth0Id) || (req.auth && req.auth.payload && req.auth.payload.sub) || (req.jwtPayload && req.jwtPayload.sub);

    if (auth0Id) {
      const hasPerm = await uploadProductPermission(auth0Id);
      if (!hasPerm) {
        throw new Error('Permission denied');
      }
    }

    // Sanitize all input data before saving
    const sanitizedProductData = sanitizeObject(req.body);

    // If we have a known user, attach uploader reference; otherwise allow anonymous
    if (req.userId) sanitizedProductData.uploader = req.userId;

    const uploadProduct = new productModel(sanitizedProductData);
    const saveProduct = await uploadProduct.save();

    res.status(201).json({
      message: 'Product upload successfully',
      error: false,
      success: true,
      data: saveProduct,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message || err,
      error: true,
      success: false,
    });
  }
}

module.exports = UploadProductController;
