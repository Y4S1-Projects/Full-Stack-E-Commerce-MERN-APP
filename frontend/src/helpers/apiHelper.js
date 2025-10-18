import { getJwtSession, isJwtSessionExpired } from './jwtSession';

/**
 * Get access token from Auth0 or JWT session
 * @param {Object} auth0 - Auth0 instance with { getAccessTokenSilently, isAuthenticated }
 * @returns {Promise<string|null>} - Access token or null if not available
 */
export const getAccessToken = async (auth0) => {
  const { getAccessTokenSilently, isAuthenticated } = auth0;

  if (isAuthenticated) {
    try {
      return await getAccessTokenSilently();
    } catch (error) {
      console.error('Error getting Auth0 token:', error);
      return null;
    }
  }

  // Fallback to JWT session
  const jwt = getJwtSession();
  if (!jwt || isJwtSessionExpired()) {
    return null;
  }

  return jwt;
};

/**
 * Create headers with authorization token
 * @param {string} accessToken - The access token to include in headers
 * @param {Object} additionalHeaders - Additional headers to merge
 * @returns {Object} - Headers object
 */
export const createAuthHeaders = (accessToken, additionalHeaders = {}) => {
  return {
    'content-type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
    ...additionalHeaders,
  };
};

/**
 * Make an authenticated API call
 * @param {string} url - The API endpoint URL
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE, etc.)
 * @param {Object} auth0 - Auth0 instance with { getAccessTokenSilently, isAuthenticated }
 * @param {Object} options - Additional fetch options
 * @returns {Promise<Object>} - Response data
 */
export const authenticatedFetch = async (url, method, auth0, options = {}) => {
  const accessToken = await getAccessToken(auth0);

  if (!accessToken) {
    throw new Error('No valid access token available');
  }

  const { body, headers: customHeaders = {}, ...restOptions } = options;

  const fetchOptions = {
    method,
    credentials: 'include',
    headers: createAuthHeaders(accessToken, customHeaders),
    ...restOptions,
  };

  if (body) {
    fetchOptions.body = JSON.stringify(body);
  }

  const response = await fetch(url, fetchOptions);
  const data = await response.json();

  return data;
};

/**
 * Make an authenticated GET request
 * @param {string} url - The API endpoint URL
 * @param {Object} auth0 - Auth0 instance
 * @param {Object} options - Additional fetch options
 * @returns {Promise<Object>} - Response data
 */
export const authenticatedGet = async (url, auth0, options = {}) => {
  return authenticatedFetch(url, 'GET', auth0, options);
};

/**
 * Make an authenticated POST request
 * @param {string} url - The API endpoint URL
 * @param {Object} auth0 - Auth0 instance
 * @param {Object} body - Request body
 * @param {Object} options - Additional fetch options
 * @returns {Promise<Object>} - Response data
 */
export const authenticatedPost = async (url, auth0, body, options = {}) => {
  return authenticatedFetch(url, 'POST', auth0, { body, ...options });
};

/**
 * Make an authenticated PUT request
 * @param {string} url - The API endpoint URL
 * @param {Object} auth0 - Auth0 instance
 * @param {Object} body - Request body
 * @param {Object} options - Additional fetch options
 * @returns {Promise<Object>} - Response data
 */
export const authenticatedPut = async (url, auth0, body, options = {}) => {
  return authenticatedFetch(url, 'PUT', auth0, { body, ...options });
};

/**
 * Make an authenticated DELETE request
 * @param {string} url - The API endpoint URL
 * @param {Object} auth0 - Auth0 instance
 * @param {Object} body - Request body (optional)
 * @param {Object} options - Additional fetch options
 * @returns {Promise<Object>} - Response data
 */
export const authenticatedDelete = async (url, auth0, body = null, options = {}) => {
  return authenticatedFetch(url, 'DELETE', auth0, { body, ...options });
};
