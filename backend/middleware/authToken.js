const { auth } = require('express-oauth2-jwt-bearer');

const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE, // e.g. https://mern-secure-api
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`,
});

module.exports = checkJwt;
