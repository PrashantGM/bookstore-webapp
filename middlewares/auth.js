const { verifyToken } = require('../utils/jwt');

const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token;
  if (!token) {
    res.render('./pages/login');
  }
  try {
    const { email, id, role } = verifyToken({ token });
    req.user = { email, id, role };
    next();
  } catch (error) {
    res.render('./pages/login');
  }
};

const authorizePermissions = (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    res.render('./pages/login');
  }
  next();
};

module.exports = { authenticateUser, authorizePermissions };
