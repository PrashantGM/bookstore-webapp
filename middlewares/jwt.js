const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;
const lifeTime = process.env.JWT_LIFE_TIME;
const createToken = ({ payload }) => {
  const token = jwt.sign(payload, secret, {
    expiresIn: lifeTime,
  });
  return token;
};
const attachCookiesToRes = ({ res, user }) => {
  const token = createToken({ payload: user });
  const oneday = 1000 * 60 * 60 * 24;
  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneday),
    secure: process.env.NODE_ENV === 'production',
    signed: true,
  });
};

const verifyToken = ({ token }) => jwt.verify(token, secret);

module.exports = { createToken, verifyToken, attachCookiesToRes };
