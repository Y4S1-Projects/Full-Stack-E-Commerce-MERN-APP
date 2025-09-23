const jwt = require('jsonwebtoken');

function signToken(payload) {
  return jwt.sign(payload, process.env.TOKEN_SECRET_KEY, { expiresIn: '8h' });
}

function verifyToken(token) {
  return jwt.verify(token, process.env.TOKEN_SECRET_KEY);
}

module.exports = { signToken, verifyToken };
