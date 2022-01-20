const { Router } = require('express');
const userRoutes = require('./userController');
const sessionRoutes = require('./sessionController');
const reportRoutes = require('./reportController');
const pdfRoutes = require('./pdfController');

const routes = Router();
routes
  .use('/users', userRoutes)
  .use('/session', sessionRoutes)
  .use('/reports', reportRoutes)
  .use('/pdf', pdfRoutes);

module.exports = routes;
