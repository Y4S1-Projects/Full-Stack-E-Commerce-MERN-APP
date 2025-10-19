const axios = require('axios');
const {
  AUTH0_DOMAIN,
  AUTH0_CLIENT_ID,
  AUTH0_CLIENT_SECRET,
  AUTH0_AUDIENCE,
  AUTH0_CONNECTION,
} = require('../../config/auth0');

async function userSignInController(req, res) {
  try {
    const { email, password } = req.body;

    if (!email) {
      throw new Error('Please provide email');
    }
    if (!password) {
      throw new Error('Please provide password');
    }

    // Auth0 ROPC flow
    const tokenUrl = `https://${AUTH0_DOMAIN}/oauth/token`;
    const payload = {
      grant_type: 'password',
      username: email,
      password: password,
      audience: AUTH0_AUDIENCE,
      client_id: AUTH0_CLIENT_ID,
      client_secret: AUTH0_CLIENT_SECRET,
      scope: 'openid profile email',
      realm: AUTH0_CONNECTION,
    };

    try {
      const response = await axios.post(tokenUrl, payload, {
        headers: { 'content-type': 'application/json' },
      });
      const token = response.data.access_token;
      // Set token in HTTP-only cookie (24h)
      res.cookie('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000, // 24h
        sameSite: 'lax',
      });
      // Return token to frontend for initial fetches
      res.status(200).json({
        message: 'Login successfully',
        data: token,
        success: true,
        error: false,
      });
    } catch (err) {
      // Auth0 error
      res.status(401).json({
        message: err.response?.data?.error_description || err.message,
        error: true,
        success: false,
      });
    }
  } catch (err) {
    res.status(400).json({
      message: err.message || err,
      error: true,
      success: false,
    });
  }
}

module.exports = userSignInController;
