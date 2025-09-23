const { auth } = require('express-oauth2-jwt-bearer');

const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE, // e.g. https://mern-secure-api
  issuerBaseURL: process.env.AUTH0_DOMAIN, // e.g. https://dev-xxxx.us.auth0.com
});

module.exports = checkJwt;
