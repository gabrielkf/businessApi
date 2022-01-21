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
const { reset } = require('nodemon');

const pdfRoutes = Router();

pdfRoutes.get('/', async (req, res) => {
  const filePath = TEMPORARY + '/notaMemoriaKabum.pdf';
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
});

pdfRoutes.get('/:id', async (req, res) => {
  const report = await reportRepository.findById(
    req.params.id
  );

  const filePath = generatePdf(report);
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
});

module.exports = pdfRoutes;
