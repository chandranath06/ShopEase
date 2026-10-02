// Must run AFTER authMiddleware, since it relies on req.user being set.
// Blocks any request from a logged-in user who is not an admin.
const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Admin access required' });
};

module.exports = adminMiddleware;
