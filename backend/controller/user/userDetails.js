// Unified user details controller: relies on unifiedJwt + attachUserId
// attachUserId guarantees req.userId and req.user (upserted if missing)
async function userDetailsController(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: true, success: false, message: 'Unauthorized' });
    }
    return res.status(200).json({
      data: req.user,
      error: false,
      success: true,
      message: 'User details',
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message || err,
      error: true,
      success: false,
    });
  }
}

module.exports = userDetailsController;
