// middleware/auth0Token.js

const { auth } = require('express-oauth2-jwt-bearer');
const logger = require('../utils/logger');

// Custom middleware to log Auth0 JWT validation
const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_DOMAIN,
  tokenSigningAlg: 'RS256',
});

function logAuth0(req, res, next) {
  const authHeader = req.headers['authorization'];
  logger.info(`[Auth0] Incoming request: ${req.method} ${req.originalUrl}`);
  if (authHeader) {
    logger.info(`[Auth0] Authorization header: ${authHeader}`);
  } else {
    logger.warn(`[Auth0] No Authorization header present.`);
  }
  next();
}

function logAuth0Error(err, req, res, next) {
  logger.error(`[Auth0] JWT validation error: ${err.message}`);
  if (err.inner) {
    logger.error(`[Auth0] Inner error: ${JSON.stringify(err.inner)}`);
  }
  next(err);
}

module.exports = [logAuth0, checkJwt, logAuth0Error];
