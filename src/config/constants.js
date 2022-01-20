module.exports.PORT = 3030;

module.exports.httpStatus = {
  Ok: 200,
  Created: 201,
  NoContent: 204,
  BadRequest: 400,
  Unauthorized: 401,
  Forbidden: 403,
  NotFound: 404,
  NotAcceptable: 406,
  UnprocessableEntity: 422,
  InternalServerError: 500,
};

module.exports.MIN_PASSWORD_LENGTH = 6;

module.exports.ROLES = ['Admin', 'Operator'];

module.exports.ADMIN = 'Admin';

module.exports.OPERATOR = 'Operator';

module.exports.TOKEN_EXPIRATION = '4h';

module.exports.API_URL =
  'https://fakerapi.it/api/v1/companies?_locale=pt_BR&_quantity=1000';
