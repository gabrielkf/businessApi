const mongoose = require('mongoose');
const { CONNECTION_STRING } = require('./constants');

mongoose.connect(CONNECTION_STRING);

const db = mongoose.connection;
db.on('error', () => {
  console.error.bind(console, 'CONNECTION ERROR');
});
db.on('open', () => {
  console.log(`CONNECTED TO DATABASE`);
});
