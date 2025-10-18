function getCookieOptions() {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    sameSite: isProd ? 'none' : 'lax',
    secure: isProd, // only secure in production with HTTPS
    path: '/',
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  };
}

function setAuthCookies(res, token) {
  const options = getCookieOptions();
  // Set both names for backward compatibility
  res.cookie('auth_token', token, options);
  res.cookie('token', token, options);
}

function clearAuthCookies(res) {
  const options = { path: '/' };
  res.clearCookie('auth_token', options);
  res.clearCookie('token', options);
}

module.exports = { setAuthCookies, clearAuthCookies };
