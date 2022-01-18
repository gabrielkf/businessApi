const {
  httpStatus,
  MIN_PASSWORD_LENGTH,
  ROLES,
} = require('../config/constants');

module.exports.validationErrorCreation = (
  validationErrors,
  body
) => {
  const missingParams = validationErrors.map(er => {
    return er.param;
  });

  if (missingParams.includes('role') && !!body.role) {
    return customError(
      httpStatus.BadRequest,
      `Role must be either ${ROLES.join(' or ')}`
    );
  }

  if (
    missingParams.includes('password') &&
    !!body.password
  ) {
    return customError(
      httpStatus.BadRequest,
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

function customError(status, message) {
  return {
    status,
    body: { message },
  };
}
