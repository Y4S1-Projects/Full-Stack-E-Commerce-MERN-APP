const userModel = require('../models/userModel');

// Middleware to set req.userId (MongoDB _id) from Auth0 JWT
// Assumes Auth0 JWT middleware has already validated and set req.auth
module.exports = async function attachUserId(req, res, next) {
  try {
    // Support both Auth0 and Google JWTs
    let user = null;
    let payload = req.jwtPayload || (req.auth && req.auth.payload);
    if (!payload) return res.status(401).json({ error: true, message: 'No JWT payload found', success: false });

    if (payload.sub) {
      // Auth0 login
      user = await userModel.findOne({ auth0Id: payload.sub });
    } else if (payload.email) {
      // Google login
      user = await userModel.findOne({ email: payload.email });
    }
    if (!user) return res.status(401).json({ error: true, message: 'User not found in DB', success: false });
    req.userId = user._id;
    req.user = user; // Optionally attach full user
    next();
  } catch (err) {
    res.status(500).json({ error: true, message: err.message || err, success: false });
  }
};
