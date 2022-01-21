const { Router } = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
  body,
  validationResult,
} = require('express-validator');
const userRepository = require('../repositories/userRepository');
const {
  validationErrorOnCreation,
} = require('../services/sessionServices');
const {
  httpStatus,
  TOKEN_EXPIRATION,
} = require('../config/constants');

const sessionRoutes = Router();

// * CREATE
sessionRoutes.post(
  '/',
  body('email').isEmail(),
  body('password'),
  async (req, res) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      const customError = validationErrorOnCreation(
        validationErrors.array(),
        req.body
      );

      return res
        .status(customError.status)
        .json(customError.body);
    }

    const { email, password } = req.body;

    const existingUser = await userRepository
      .findOne({ email })
      .exec();

    if (!existingUser) {
      return res
        .status(httpStatus.NotFound)
        .json({ message: 'Email not found' });
    }

    if (existingUser.confirmed === false) {
      return res
        .status(httpStatus.Forbidden)
        .json({ message: 'Account is not confirmed' });
    }

    try {
      const passwordMatches = await bcrypt.compare(
        password,
        existingUser.password
      );

      const payload = {
        email,
        role: existingUser.role,
      };

      if (!passwordMatches) {
        return res
          .status(httpStatus.Unauthorized)
          .json({ message: 'Incorrect password' });
      }

      const token = jwt.sign(
        payload,
        process.env.TOKEN_SECRET,
        { expiresIn: TOKEN_EXPIRATION }
      );

      return res.json({ token });
    } catch (e) {
      return res
        .status(httpStatus.InternalServerError)
        .json({ message: 'Failed to generate token' });
    }
  }
);

module.exports = sessionRoutes;
