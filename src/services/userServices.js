const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const {
  httpStatus,
  MIN_PASSWORD_LENGTH,
  ROLES,
  HOST,
  PORT,
  SMTP_SERVER,
  SMTP_PORT,
} = require('../config/constants');
const { customError } = require('../utils/customError');

exports.validationErrorOnCreation = (
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

exports.encryptPassword = async password =>
  await bcrypt.hash(password, 10);

exports.sendActivationEmail = async (
  { _id, name, role, email },
  confirmationRoute
) => {
  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_SERVER,
      port: SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: { rejectUnauthorized: false },
    });

    const confirmationUrl = `${HOST}:${PORT}/${confirmationRoute}`;

    const mailBody = `
      <p>Caro ${name}</p>
      <br>
      <p>Você foi adicionado como <b>${role}</b> na plataforma Business Api.</p>
      <p>Para confirmar sua conta, clique no link abaixo.</p>
      <br>
      <br>
      <p><a href="${confirmationUrl}">Confirmar minha conta</a></p>
    `;

    const message = {
      from: process.env.ROOT_EMAIL,
      to: email,
      subject: 'Business Api - confirmação de acesso',
      html: mailBody,
    };

    await transporter.sendMail(message);
  } catch (e) {
    console.log(`email error: ${e.message}`);
    throw `Error while sending email: ${e.message}`;
  }
};
