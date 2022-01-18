module.exports.PORT = 3030;

module.exports.CONNECTION_STRING =
  'mongodb://mongodb:27017/BusinessApi';

module.exports.httpStatus = {
  Ok: 200,
  Created: 201,
  NoContent: 204,
  BadRequest: 400,
  Unauthorized: 401,
  Forbidden: 403,
  UnprocessableEntity: 422,
  InternalServerError: 500,
};

module.exports.MIN_PASSWORD_LENGTH = 6;
module.exports.ROLES = ['Admin', 'Operator'];
