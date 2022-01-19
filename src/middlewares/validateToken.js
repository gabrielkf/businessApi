const jwt = require('jsonwebtoken');
const {
  httpStatus,
  ADMIN,
} = require('../config/constants');

module.exports = function validateToken(req, res, next) {
  if (!req.headers.authorization) {
    return res
      .status(httpStatus.Unauthorized)
      .json({ message: 'Missing authorization header' });
  }

  const [bearer, token] =
    req.headers.authorization.split(' ');

  if (!token || bearer !== 'Bearer') {
    return res
      .status(httpStatus.Unauthorized)
      .json({ message: 'Invalid authorization header' });
  }

  jwt.verify(
    token,
    process.env.TOKEN_SECRET,
    (err, payload) => {
      if (err) {
        return res
          .status(httpStatus.InternalServerError)
          .json({ message: 'Failed to parse token' });
      }

      if (payload.role !== ADMIN) {
        return res.status(httpStatus.Forbidden).json({
          message: 'Only Administrators can create users',
        });
      }

      req.user = payload;
    }
  );

  next();
};
