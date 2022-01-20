const jwt = require('jsonwebtoken');
const { httpStatus } = require('../config/constants');
const { customError } = require('../utils/customError');

module.exports = function validateToken(req, res, next) {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      console.log('no auth header');
      req.authorized = false;
      req.customError = customError(
        httpStatus.Unauthorized,
        'Missing authorization header'
      );

      return next();
    }

    const [bearer, token] =
      req.headers.authorization.split(' ');

    if (!token || bearer !== 'Bearer') {
      req.authorized = false;
      req.customError = customError(
        httpStatus.Unauthorized,
        'Invalid authorization header'
      );
    }

    jwt.verify(
      token,
      process.env.TOKEN_SECRET,
      (err, payload) => {
        if (err) {
          req.authorized = false;
          req.customError = customError(
            httpStatus.BadRequest,
            'Invalid token'
          );
        }

        const { email, role } = payload;
        req.authorized = true;
        req.user = { email, role };
      }
    );
  } catch (e) {
    req.authorized = false;
    req.customError = customError(
      httpStatus.InternalServerError,
      'Error while parsing token'
    );
  }

  next();
};
