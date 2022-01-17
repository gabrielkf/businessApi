const { Router } = require('express');

const usersRoutes = Router();

// * CREATE
usersRoutes.post('/', (req, res) => {
  return res.json({ message: 'OK' });
});

module.exports = usersRoutes;
