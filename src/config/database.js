const mongoose = require('mongoose');

mongoose.connect(process.env.CONNECTION_STRING);

const db = mongoose.connection;
db.on('error', () => {
  console.error.bind(console, 'CONNECTION ERROR');
});
db.on('open', () => {
  console.log(`CONNECTED TO DATABASE`);
});
