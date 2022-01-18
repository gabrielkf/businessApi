const { Router } = require('express');
const {
  body,
  validationResult,
} = require('express-validator');
const {
  httpStatus,
  MIN_PASSWORD_LENGTH,
  ROLES,
} = require('../config/constants');
const usersRepository = require('../repositories/userRepository');
const {
  validationErrorCreation,
} = require('../services/userServices');

const usersRoutes = Router();

// * CREATE
usersRoutes.post(
  '/',
  body('name').isLength({ max: 30 }).isString(),
  body('role').isIn(ROLES),
  body('email').isEmail(),
  body('password').isLength({ min: MIN_PASSWORD_LENGTH }),
  async (req, res) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      const customError = validationErrorCreation(
        validationErrors.array(),
        req.body
      );

      return res
        .status(customError.status)
        .json(customError.body);
    }

    const user = new usersRepository(req.body);

    try {
      await user.save();
      res.status(httpStatus.Created).json(user);
    } catch (e) {
      return res
        .status(httpStatus.InternalServerError)
        .json({ message: 'Database failed' });
    }

    return res.status(httpStatus.Created).send();
  }
);

// * READ
usersRoutes.get('/', async (req, res) => {
  try {
    const users = await usersRepository.find({});

    if (users == null) {
      return res
        .status(httpStatus.NotFound)
        .json({ message: 'No users found' });
    }

    return res.json(users);
  } catch (e) {
    console.error(e);
    return res
      .status(httpStatus.InternalServerError)
      .json({ message: 'Database failed' });
  }
});

module.exports = usersRoutes;
