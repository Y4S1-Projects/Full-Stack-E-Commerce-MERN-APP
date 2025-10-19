module.exports = function requireRole(...roles) {
  return (req, res, next) => {
    try {
      const user = req.user;
      if (!user || !user.role) {
        return res.status(401).json({ error: true, success: false, message: 'Unauthorized' });
      }
      if (!roles.includes(user.role)) {
        return res.status(403).json({ error: true, success: false, message: 'Forbidden' });
      }
      next();
    } catch (err) {
      return res.status(500).json({ error: true, success: false, message: err.message || 'Server error' });
    }
  };
};
