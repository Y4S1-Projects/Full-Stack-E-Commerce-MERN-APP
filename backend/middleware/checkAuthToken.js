module.exports = function checkAuthToken(req, res, next) {
  let token = null;
  // 1. Check Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }
  // 2. Check cookie
  if (!token && req.cookies && req.cookies.auth_token) {
    token = req.cookies.auth_token;
  }
  if (token) {
    req.accessToken = token;
    return next();
  }
  return res.status(401).json({ error: true, message: 'No auth token found', success: false });
};
