const { httpStatus } = require('../config/constants');
const { customError } = require('../utils/customError');

module.exports.validationErrorOnCreation = (
  validationErrors,
  body
) => {
  const missingParams = validationErrors.map(er => {
    return er.param;
  });

  return customError(
    httpStatus.UnprocessableEntity,
    `Invalid or missing properties in body: ${missingParams.join(
      ', '
    )}`
  );
};
