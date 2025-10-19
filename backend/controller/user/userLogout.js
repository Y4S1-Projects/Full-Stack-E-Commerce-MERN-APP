const { clearAuthCookies } = require('../../utils/authCookie');

async function userLogout(req, res) {
  try {
    clearAuthCookies(res);

    res.json({
      message: 'Logged out successfully',
      error: false,
      success: true,
      data: [],
    });
  } catch (err) {
    res.json({
      message: err.message || err,
      error: true,
      success: false,
    });
  }
}

module.exports = userLogout;
