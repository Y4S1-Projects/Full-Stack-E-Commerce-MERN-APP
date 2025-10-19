const { uploadProductPermission } = require('../../helpers/permission');
const productModel = require('../../models/productModel');

async function updateProductController(req, res) {
  try {
    const auth0Id = (req.user && req.user.auth0Id) || (req.auth && req.auth.payload && req.auth.payload.sub) || (req.jwtPayload && req.jwtPayload.sub);
    if (!auth0Id) {
      return res.status(401).json({ error: true, message: 'Unauthorized: missing user identity', success: false });
    }

    const hasPerm = await uploadProductPermission(auth0Id);
    if (!hasPerm) {
      throw new Error('Permission denied');
    }

    const { _id, ...resBody } = req.body;

    const updateProduct = await productModel.findByIdAndUpdate(_id, resBody);

    res.json({
      message: 'Product update successfully',
      data: updateProduct,
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
}

module.exports = updateProductController;
