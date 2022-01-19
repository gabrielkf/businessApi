const { Router } = require('express');
const userRoutes = require('./userController');
const sessionRoutes = require('./sessionController');

const routes = Router();
routes
  .use('/users', userRoutes)
  .use('/session', sessionRoutes);

module.exports = routes;
