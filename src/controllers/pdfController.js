const { Router } = require('express');
const fs = require('fs');

const { generatePdf } = require('../services/pdfServices');
const validateToken = require('../middlewares/validateToken');
const reportRepository = require('../repositories/reportRepository');
const {
  httpStatus,
  OPERATOR,
  TEMPORARY,
} = require('../config/constants');

const pdfRoutes = Router();

pdfRoutes.get('/:id', validateToken, async (req, res) => {
  if (!req.params.id) {
    return res
      .status(httpStatus.BadRequest)
      .json({ message: 'Missing parameter in route: id' });
  }

  if (req.authorized === false) {
    return res
      .status(req.customError.status)
      .json(req.customError.body);
  }

  const report = await reportRepository.findById(
    req.params.id
  );

  if (!report) {
    return res
      .status(httpStatus.NotFound)
      .json({ message: 'No report found for id given' });
  }

  if (
    req.user.role === OPERATOR &&
    req.user.email !== report.createdBy
  ) {
    return res.status(httpStatus.Unauthorized).json({
      message:
        'Operators can only access their own reports',
    });
  }

  try {
    const filePath = await generatePdf(report);

    const file = fs.createReadStream(filePath);
    const stat = fs.statSync(filePath);

    res
      .setHeader('Content-Length', stat.size)
      .setHeader('Content-Type', 'application/pdf')
      .setHeader(
        'Content-Disposition',
        'attachment; filename=report.pdf'
      );

    file.pipe(res);
  } catch (e) {
    return res
      .status(httpStatus.InternalServerError)
      .json({ message: e.message });
  }
});

module.exports = pdfRoutes;
