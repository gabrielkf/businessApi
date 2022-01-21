const { Router } = require('express');
const fs = require('fs');
const { resolve } = require('path');
const {
  body,
  validationResult,
} = require('express-validator');
const {
  httpStatus,
  OPERATOR,
  MIN_COMPANIES,
} = require('../config/constants');
const validateToken = require('../middlewares/validateToken');
const {
  removeSpecialCharsLower,
  getCompaniesByCountry,
} = require('../services/reportServices');
const reportRepository = require('../repositories/reportRepository');

const reportRoutes = Router();

// * CREATE
reportRoutes.post(
  '/',
  validateToken,
  body('country').isString(),
  async (req, res) => {
    // * CHECK AUTHORIZATION
    if (req.authorized === false) {
      return res
        .status(req.customError.status)
        .json(req.customError.body);
    }

    if (req.user.role !== OPERATOR) {
      return res.status(httpStatus.Forbidden).json({
        message:
          'Only Operators are allowed to generate reports',
      });
    }

    // * CHECK REQUIRED FIELDS
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      return res.status(httpStatus.BadRequest).json({
        message: 'Missing property in body: country',
      });
    }

    // * FETCH COMPANIES
    const { country } = req.body;
    const companies = await getCompaniesByCountry(country);

    if (companies.length < MIN_COMPANIES) {
      return res.json({
        message:
          companies.length < 1
            ? `No companies from ${country} were found`
            : `Insufficient companies from ${country} to build a report`,
      });
    }

    // * INSERT TO DB
    try {
      const report = new reportRepository({
        createdBy: req.user.email,
        country: removeSpecialCharsLower(
          companies[0].country
        ),
        companies: companies,
        createdAt: new Date(),
      });

      report
        .save()
        .then(() => {
          return res
            .status(httpStatus.Created)
            .json(report);
        })
        .catch(e => {
          return res
            .status(httpStatus.InternalServerError)
            .json({ message: e.message });
        });
    } catch (e) {
      return res
        .status(httpStatus.InternalServerError)
        .json({ message: e.message });
    }
  }
);

// * READ
reportRoutes.get('/', validateToken, async (req, res) => {
  // * CHECK AUTHORIZATION
  if (req.authorized === false) {
    return res
      .status(req.customError.status)
      .json(req.customError.body);
  }

  const filter = req.body.country
    ? {
        country: {
          $regex: removeSpecialCharsLower(req.body.country),
        },
      }
    : {};

  // * OPERATORS GET THEIR OWN REPORTS
  if (req.user.role === OPERATOR) {
    filter.createdBy = req.user.email;
  }

  const reports = await reportRepository.find(filter);

  if (!reports || reports.length === 0) {
    return res
      .status(httpStatus.NotFound)
      .json({ message: 'No reports found' });
  }

  return res.json(reports);
});

module.exports = reportRoutes;
