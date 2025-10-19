require('dotenv').config();
const axios = require('axios');

const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN; // e.g. dev-xxxx.us.auth0.com (no protocol)
const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID;
const AUTH0_CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET;
const AUTH0_AUDIENCE = process.env.AUTH0_AUDIENCE; // e.g. https://mern-secure-api
const AUTH0_CONNECTION = process.env.AUTH0_CONNECTION || 'Username-Password-Authentication';

/**
 * Get Auth0 Management API token
 * Used for creating users, updating profiles, etc.
 */
async function getManagementToken() {
  try {
    const response = await axios.post(`https://${AUTH0_DOMAIN}/oauth/token`, {
      client_id: AUTH0_CLIENT_ID,
      client_secret: AUTH0_CLIENT_SECRET,
      audience: `https://${AUTH0_DOMAIN}/api/v2/`,
      grant_type: 'client_credentials',
    });

    return response.data.access_token;
  } catch (err) {
    console.error('Error fetching Auth0 Management Token:', err.response?.data || err.message);
    throw new Error('Failed to get Auth0 Management Token');
  }
}

module.exports = {
  AUTH0_DOMAIN,
  AUTH0_CLIENT_ID,
  AUTH0_CLIENT_SECRET,
  AUTH0_AUDIENCE,
  AUTH0_CONNECTION,
  getManagementToken,
};
