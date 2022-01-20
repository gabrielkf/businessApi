const https = require('https');
const { Router } = require('express');
const {
  body,
  validationResult,
} = require('express-validator');
const {
  httpStatus,
  API_URL,
  OPERATOR,
} = require('../config/constants');
const validateToken = require('../middlewares/validateToken');
const {
  compareCountries,
} = require('../services/reportService');
const { compare } = require('bcrypt');

const reportRoutes = Router();

// * CREATE
reportRoutes.post(
  '/',
  validateToken,
  body('country').isString(),
  (req, res) => {
    // * CHECK AUTHORIZATION
    if (req.authorized === false) {
      return res
        .status(req.customError.status)
        .json(req.customError.body);
    }

    if (req.user.role !== OPERATOR) {
      return res.status(httpStatus.Forbidden).json({
        message: 'Only Operators can generate reports',
      });
    }

    // * CHECK REQUIRED FIELDS
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      return res.status(httpStatus.BadRequest).json({
        message: 'Missing property in body: country',
      });
    }

    const { country } = req.body;

    https
      .get(API_URL, apiResponse => {
        const buffer = [];

        apiResponse.on('data', chunk => {
          buffer.push(chunk);
        });

        apiResponse.on('end', () => {
          const companies = JSON.parse(
            Buffer.concat(buffer).toString()
          );

          const filteredCompanies = companies.data.filter(
            c => {
              return compareCountries(c.country, country);
            }
          );

          return res.json(filteredCompanies);
        });
      })
      .on('error', err => {
        return res
          .status(httpStatus.InternalServerError)
          .json({ message: err.message });
      });
  }
);

module.exports = reportRoutes;
