const { Router } = require('express');
const bcrypt = require('bcrypt');
const userRepository = require('../repositories/userRepository');
const validateToken = require('../middlewares/validateToken');

const {
  body,
  validationResult,
} = require('express-validator');

const {
  httpStatus,
  MIN_PASSWORD_LENGTH,
  ROLES,
} = require('../config/constants');

const {
  validationErrorOnCreation,
} = require('../services/userServices');

const userRoutes = Router();

// * CREATE
userRoutes.post(
  '/',
  validateToken,
  body('name').isLength({ max: 30 }).isString(),
  body('role').isIn(ROLES),
  body('email').isEmail(),
  body('password').isLength({ min: MIN_PASSWORD_LENGTH }),
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

    const { name, role, email, password } = req.body;

    const existingUser = await userRepository
      .findOne({ email })
      .exec();

    if (!!existingUser) {
      return res.status(httpStatus.Forbidden).json({
        message: `Email ${email} is already used.`,
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = new userRepository({
      name,
      role,
      email,
      password: hash,
      createdAt: new Date(),
    });

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
userRoutes.get('/', async (req, res) => {
  try {
    const users = await userRepository.find({});

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

// * DELETE
userRoutes.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await userRepository.findByIdAndDelete(id);
    return res.status(httpStatus.NoContent).send();
  } catch (e) {
    return res
      .status(httpStatus.InternalServerError)
      .json({ message: 'Failed to delete user' });
  }
});

module.exports = userRoutes;
