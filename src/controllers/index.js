const { Router } = require('express');
const userRoutes = require('./userController');
const sessionRoutes = require('./sessionController');
const reportRoutes = require('./reportController');

const routes = Router();
routes
  .use('/users', userRoutes)
  .use('/session', sessionRoutes)
  .use('/reports', reportRoutes);

module.exports = routes;
