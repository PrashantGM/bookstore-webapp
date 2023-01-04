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
  next();
};

module.exports = { authenticateUser, authorizePermissions };
