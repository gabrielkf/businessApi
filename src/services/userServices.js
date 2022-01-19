const {
  httpStatus,
  MIN_PASSWORD_LENGTH,
  ROLES,
} = require('../config/constants');
const { customError } = require('../utils/customError');

module.exports.validationErrorOnCreation = (
  validationErrors,
  body
) => {
  const missingParams = validationErrors.map(er => {
    return er.param;
  });

  if (missingParams.includes('role') && !!body.role) {
    return customError(
      httpStatus.NotAcceptable,
      `Role must be either ${ROLES.join(' or ')}`
    );
  }

  if (
    missingParams.includes('password') &&
    !!body.password
  ) {
    return customError(
      httpStatus.NotAcceptable,
      `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`
    );
  }

  return customError(
    httpStatus.UnprocessableEntity,
    `Invalid or missing properties in body: ${missingParams.join(
      ', '
    )}`
  );
};
