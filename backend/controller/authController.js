const { registerUser, loginUser, decodeIdToken } = require('../services/authService');
const { findByAuth0Id, saveUser } = require('../repositories/userRepository');
const logger = require('../utils/logger');
const { successResponse, errorResponse } = require('../utils/responseUtil');
const { AUTH0_DOMAIN, AUTH0_CLIENT_ID } = require('../config/auth0');

/**
 * Register new user (Auth0 + MongoDB)
 */
exports.register = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) throw new Error('Missing fields');

    // 1. Register in Auth0
    const auth0User = await registerUser(email, password, name);

    // 2. Save user in MongoDB
    const newUser = await saveUser({
      auth0Id: auth0User.user_id,
      email,
      name,
      role: 'CUSTOMER',
    });

    logger.info(`User registered: ${email} (${auth0User.user_id})`);
    return successResponse(res, newUser, 'User registered successfully');
  } catch (err) {
    logger.error('Register error: ' + (err.response?.data || err.message));
    return errorResponse(res, err.response?.data || err.message, 400);
  }
};

/**
 * Login (Auth0 verifies credentials)
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) throw new Error('Missing credentials');

    // 1. Login via Auth0
    const tokenSet = await loginUser(email, password); // { access_token, id_token }

    // 2. Decode ID token to get Auth0 ID
    const decoded = decodeIdToken(tokenSet.id_token);

    // 3. Fetch user from MongoDB
    const user = await findByAuth0Id(decoded.sub);

    if (!user) throw new Error('User not found in local DB');

    // 4. Store token in cookie
    res.cookie('token', tokenSet.id_token, {
      httpOnly: true,
      secure: false, // ⚠️ set true in production
    });

    logger.info(`User logged in: ${email} (${decoded.sub})`);
    return successResponse(res, { user, tokens: tokenSet }, 'Login successful');
  } catch (err) {
    logger.error('Login error: ' + (err.response?.data || err.message));
    return errorResponse(res, err.response?.data || err.message, 401);
  }
};

/**
 * Profile (requires middleware/auth0Token.js)
 */
exports.profile = async (req, res) => {
  try {
    // Auth0 middleware validated token and added claims
    const auth0Id = req.auth.payload.sub;

    const user = await findByAuth0Id(auth0Id);
    if (!user) throw new Error('User not found in DB');

    return successResponse(res, user, 'User profile fetched');
  } catch (err) {
    return errorResponse(res, err.message, 404);
  }
};

/**
 * Logout
 */
exports.logout = async (req, res) => {
  try {
    res.clearCookie('token');

    const returnTo = process.env.FRONTEND_URL || 'http://localhost:3000';
    const logoutUrl = `${AUTH0_DOMAIN}/v2/logout?client_id=${AUTH0_CLIENT_ID}&returnTo=${encodeURIComponent(returnTo)}`;

    logger.info('User logged out');
    return successResponse(res, { logoutUrl }, 'Logged out successfully');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};
