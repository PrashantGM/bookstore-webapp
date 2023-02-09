const { verifyToken } = require('../utils/jwt');

const { UnauthorizedError } = require('../errors/index');

const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token;
  if (!token) {
    return res.status(404).render('./pages/notFound');
  }
  try {
    const { email, id, role } = verifyToken({ token });

    if (req.params.userId) {
      if (role !== 'ADMIN') {
        if (Number(req.params.userId) !== id) {
          return res.status(404).render('./pages/notFound');
        }
      }
    }
    req.user = { email, id, role };
    next();
  } catch (error) {
    next();
  }
};

const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new UnauthorizedError('Unauthorized to access this route');
    }
    next();
  };
};

module.exports = { authenticateUser, authorizePermissions };
