const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;
const AUTH0_AUDIENCE = process.env.AUTH0_AUDIENCE;
const AUTH0_ISSUER = `https://${AUTH0_DOMAIN}/`;
const JWT_SECRET = process.env.JWT_SECRET;

const client = jwksClient({
  jwksUri: `${AUTH0_ISSUER}.well-known/jwks.json`,
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, function (err, key) {
    if (err) return callback(err);
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
}

module.exports = async function unifiedJwt(req, res, next) {
  let token = null;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token && req.cookies && req.cookies.auth_token) {
    token = req.cookies.auth_token;
  }
  if (!token) {
    return res.status(401).json({ error: true, message: 'No auth token found', success: false });
  }
  // Decode header to check alg
  let decodedHeader;
  try {
    decodedHeader = jwt.decode(token, { complete: true });
  } catch (e) {
    return res.status(401).json({ error: true, message: 'Invalid token', success: false });
  }
  if (!decodedHeader || !decodedHeader.header || !decodedHeader.header.alg) {
    return res.status(401).json({ error: true, message: 'Invalid token header', success: false });
  }
  const alg = decodedHeader.header.alg;
  if (alg === 'RS256') {
    // Auth0 token
    jwt.verify(
      token,
      getKey,
      {
        audience: AUTH0_AUDIENCE,
        issuer: AUTH0_ISSUER,
        algorithms: ['RS256'],
      },
      (err, payload) => {
        if (err) {
          return res
            .status(401)
            .json({ error: true, message: 'Auth0 JWT invalid', details: err.message, success: false });
        }
        req.jwtPayload = payload;
        next();
      }
    );
  } else if (alg === 'HS256') {
    // Local JWT (Google login)
    try {
      const payload = jwt.verify(token, JWT_SECRET);
      req.jwtPayload = payload;
      next();
    } catch (err) {
      return res.status(401).json({ error: true, message: 'Local JWT invalid', details: err.message, success: false });
    }
  } else {
    return res.status(401).json({ error: true, message: 'Unsupported JWT alg', alg, success: false });
  }
};
