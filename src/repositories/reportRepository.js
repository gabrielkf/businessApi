const { Schema, model } = require('mongoose');

const reportSchema = new Schema({
  country: String,
  companies: [
    {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      website: {
        type: String,
        required: true,
      },
      image: {
        type: String,
        required: true,
      },
      contact: {
        firstname: String,
        lastname: String,
        email: String,
        phone: String,
      },
    },
  ],
  createdAt: Date,
});

const reportRepository = model(
  'report',
  reportSchema,
  'reports'
);

module.exports = reportRepository;
