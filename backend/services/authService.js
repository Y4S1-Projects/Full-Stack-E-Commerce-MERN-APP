const axios = require('axios');
const logger = require('../utils/logger');

const {
  getManagementToken,
  AUTH0_DOMAIN,
  AUTH0_AUDIENCE,
  AUTH0_CLIENT_ID,
  AUTH0_CLIENT_SECRET,
  AUTH0_CONNECTION,
} = require('../config/auth0');

/**
 * Register user in Auth0
 */
async function registerUser(email, password, name) {
  logger.info(`[Auth0] Registering user: ${email}`);
  const mgmtToken = await getManagementToken();
  logger.info(`[Auth0] Management token: ${mgmtToken ? 'RECEIVED' : 'MISSING'}`);

  try {
    const response = await axios.post(
      `${AUTH0_DOMAIN}/api/v2/users`,
      {
        email,
        password,
        name,
        connection: AUTH0_CONNECTION,
      },
      {
        headers: { Authorization: `Bearer ${mgmtToken}` },
      }
    );
    logger.info(`[Auth0] User registered: ${response.data.user_id}`);
    return response.data; // returns Auth0 user object
  } catch (err) {
    logger.error(`[Auth0] Registration error: ${err.response?.data || err.message}`);
    throw err;
  }
}

/**
 * Login user with Auth0 (Resource Owner Password Grant)
 */
async function loginUser(email, password) {
  logger.info(`[Auth0] Login attempt: ${email}`);
  try {
    const response = await axios.post(`${AUTH0_DOMAIN}/oauth/token`, {
      grant_type: 'password',
      username: email,
      password: password,
      audience: AUTH0_AUDIENCE,
      client_id: AUTH0_CLIENT_ID,
      client_secret: AUTH0_CLIENT_SECRET,
    });
    logger.info(`[Auth0] Login success: ${email}`);
    return response.data; // contains access_token, id_token, etc.
  } catch (err) {
    logger.error(`[Auth0] Login error: ${err.response?.data || err.message}`);
    throw err;
  }
}

/**
 * Decode ID token manually if needed
 */
function decodeIdToken(idToken) {
  logger.info(`[Auth0] Decoding ID token.`);
  const parts = idToken.split('.');
  if (parts.length !== 3) throw new Error('Invalid JWT');

  const payload = Buffer.from(parts[1], 'base64').toString('utf8');
  logger.info(`[Auth0] Decoded payload: ${payload}`);
  return JSON.parse(payload);
}

module.exports = {
  registerUser,
  loginUser,
  decodeIdToken,
};
