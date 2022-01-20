const { Router } = require('express');
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
  ADMIN,
} = require('../config/constants');

const {
  validationErrorOnCreation,
  encryptPassword,
} = require('../services/userServices');

const userRoutes = Router();

// * CREATE
userRoutes.post(
  '/',
  validateToken,
  body('name').isString(),
  body('role').isIn(ROLES),
  body('email').isEmail(),
  body('password').isLength({ min: MIN_PASSWORD_LENGTH }),
  async (req, res) => {
    // * CHECK AUTHORIZATION
    if (req.authorized === false) {
      return res
        .status(req.customError.status)
        .json(req.customError.body);
    }

    if (req.user.role !== ADMIN) {
      return res.status(httpStatus.Forbidden).json({
        message:
          'Only Administrators are allowed to create users',
      });
    }

    // * CHECK REQUIRED FIELDS
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

    // * INSERT TO DB
    const { name, role, email, password } = req.body;

    const existingUser = await userRepository
      .findOne({ email })
      .exec();

    if (!!existingUser) {
      return res.status(httpStatus.Forbidden).json({
        message: `Email ${email} is already used.`,
      });
    }

    const hash = await encryptPassword(password);

    const user = new userRepository({
      name,
      role,
      email,
      password: hash,
      createdAt: new Date(),
    });

    try {
      await user.save();
      return res.status(httpStatus.Created).json(user);
    } catch (e) {
      return res
        .status(httpStatus.InternalServerError)
        .json({ message: 'Database failed' });
    }
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
