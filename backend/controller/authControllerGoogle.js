const { OAuth2Client } = require('google-auth-library');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// POST /api/auth/google
exports.googleLogin = async (req, res) => {
  const { credential } = req.body;
  if (!credential) return res.status(400).json({ error: 'Missing Google credential' });

  try {
    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload?.email) return res.status(400).json({ error: 'Invalid Google token' });

    // Find or create user
    let user = await User.findOne({ email: payload.email });
    if (!user) {
      // Do NOT set auth0Id for Google users to avoid duplicate nulls
      user = await User.create({
        email: payload.email,
        name: payload.name,
        profilePic: payload.picture,
      });
    }

    // Issue your app's JWT
    const token = jwt.sign({ _id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });

    res.json({ success: true, data: token });
  } catch (err) {
    res.status(401).json({ error: 'Google login failed', details: err.message });
  }
};
