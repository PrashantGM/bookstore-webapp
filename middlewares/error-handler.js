const { UnauthorizedError, UnauthenticatedError } = require('../errors');
const CustomAPIError = require('../errors/custom-error');

const errorHandler = (err, req, res, next) => {
  // if (!process.env.NODE_ENV === 'production') {
  //   return res.status(err.statusCode).json({
  //      success: false,
  //      error: err,
  //      errMessage: err.message,
  //      stack: err.stack,
  //    });
  // }

  if (err instanceof CustomAPIError) {
    return res
      .status(err.statusCode)
      .json({ success: false, msg: err.message });
  }
  next();
  return res
    .status(500)
    .json({ success: false, msg: 'Something went wrong! Please Try Again.' });
};

module.exports = errorHandler;
