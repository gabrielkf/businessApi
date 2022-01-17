const express = require('express');
const routes = require('./controllers');
const { PORT } = require('./config/constants');

const server = express();
server.use(express.json()).use(routes);

server.listen(PORT, () => {
  console.log(`> Running on port ${PORT}`);
});
