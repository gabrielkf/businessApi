const { Router } = require('express');
const usersRoutes = require('./usersController');

const routes = Router();
routes.use('/users', usersRoutes);

module.exports = routes;
