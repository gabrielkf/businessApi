const { resolve } = require('path');

exports.HOST = 'http://localhost';
exports.PORT = 3030;

exports.httpStatus = {
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

exports.MIN_PASSWORD_LENGTH = 6;

exports.TOKEN_EXPIRATION = '4h';

exports.API_URL =
  'https://fakerapi.it/api/v1/companies?_locale=pt_BR&_quantity=500';

exports.MIN_COMPANIES = 2;

const admin = 'Admin';
const op = 'Operator';
exports.ROLES = [admin, op];
exports.ADMIN = admin;
exports.OPERATOR = op;

exports.TEMPORARY = resolve(__dirname, '..', '..', 'tmp');
exports.FONTS = resolve(__dirname, '..', '..', 'fonts');

exports.FONT = {
  REGULAR: 'Roboto-Regular.ttf',
  BOLD: 'Roboto-Bold.ttf',
};

exports.SMTP_SERVER = 'smtp.gmail.com';
exports.SMTP_PORT = 587;

exports.ACTIVATION_LIMIT_MINUTES = 30;
