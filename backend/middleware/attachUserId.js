const userModel = require('../models/userModel');

// Middleware to set req.userId (MongoDB _id) from Auth0 JWT
// Assumes Auth0 JWT middleware has already validated and set req.auth
module.exports = async function attachUserId(req, res, next) {
  try {
    const auth0Id = req.auth?.payload?.sub;
    if (!auth0Id) return res.status(401).json({ error: true, message: 'No Auth0 user ID in token', success: false });
    const user = await userModel.findOne({ auth0Id });
    if (!user) return res.status(401).json({ error: true, message: 'User not found in DB', success: false });
    req.userId = user._id;
    req.user = user; // Optionally attach full user
    next();
  } catch (err) {
    res.status(500).json({ error: true, message: err.message || err, success: false });
  }
};
