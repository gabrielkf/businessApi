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
  ACTIVATION_LIMIT_MINUTES,
} = require('../config/constants');

const {
  validationErrorOnCreation,
  encryptPassword,
  sendActivationEmail,
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

      await sendActivationEmail(
        user,
        `users/confirm/${user._id}`
      );

      return res.status(httpStatus.Created).json(user);
    } catch (e) {
      return res
        .status(httpStatus.InternalServerError)
        .json({ message: 'Error while creating user' });
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
    console.log(e.message);
    return res
      .status(httpStatus.InternalServerError)
      .json({ message: 'Failed to delete user' });
  }
});

userRoutes.get('/email', async (req, res) => {
  try {
    const user = await userRepository
      .findOne({
        email: 'gabrielkf@gmail.com',
      })
      .exec();

    await sendActivationEmail(
      user,
      `users/confirm/${user._id}`
    );

    return res.status(httpStatus.NoContent).send();
  } catch (e) {
    return res
      .status(httpStatus.InternalServerError)
      .json({ message: e.message });
  }
});

userRoutes.get('/confirm/:id', async (req, res) => {
  const { id } = req.params;
  const user = await userRepository.findById(id).exec();

  if (!user) {
    return res
      .status(httpStatus.NotFound)
      .send(`No user with id ${id}`);
  }

  const timeCreatedMinutes =
    (new Date().getTime() -
      new Date(user.createdAt).getTime()) /
    (1000 * 60);

  if (timeCreatedMinutes > ACTIVATION_LIMIT_MINUTES) {
    return res
      .status(httpStatus.Forbidden)
      .send('Confirmation email has expired');
  }

  try {
    await userRepository.findByIdAndUpdate(id, {
      confirmed: true,
    });

    return res.send('Sua conta foi confirmada');
  } catch (e) {
    return res
      .status(httpStatus.InternalServerError)
      .send('Failed to confirm account');
  }
});

module.exports = userRoutes;
