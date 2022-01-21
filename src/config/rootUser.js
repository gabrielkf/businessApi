const userRepository = require('../repositories/userRepository');
const {
  encryptPassword,
} = require('../services/userServices');
const { ADMIN } = require('./constants');

(async function setRootUser() {
  const rootUserExists = await userRepository.findOne({
    email: process.env.ROOT_EMAIL,
  });

  const hash = await encryptPassword(
    process.env.ROOT_PASSWORD
  );

  if (!rootUserExists) {
    const user = new userRepository({
      name: process.env.ROOT_USERNAME,
      role: ADMIN,
      email: process.env.ROOT_EMAIL,
      password: hash,
      confirmed: true,
      createdAt: new Date(),
    });

    try {
      await user.save();
    } catch (e) {
      console.error(e);
    }
  }
})();
