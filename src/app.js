require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./controllers');
const { PORT } = require('./config/constants');

require('./config/database');

const server = express();
server
  .use(bodyParser.urlencoded({ extended: false }))
  .use(bodyParser.json())
  .use(routes);

server.listen(PORT, () => {
  console.log(`> Running on port ${PORT}`);
});
