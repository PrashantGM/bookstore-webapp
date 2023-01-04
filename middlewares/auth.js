const { verifyToken } = require('./jwt');

const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token;
  if (!token) {
    return res.status(401).json('Invalid Authentication');
  }
  try {
    const { email, id, role } = verifyToken({ token });
    req.user = { email, id, role };
  } catch (error) {
    return res.status(401).json('Invalid Authentication');
  }
  next();
};

const authorizePermissions = (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json('Unauthorized to access this route');
  }
  next();
};

module.exports = { authenticateUser, authorizePermissions };
