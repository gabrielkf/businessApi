const { Router } = require('express');
const fs = require('fs');
const { resolve } = require('path');

const validateToken = require('../middlewares/validateToken');
const reportRepository = require('../repositories/reportRepository');
const {
  httpStatus,
  OPERATOR,
} = require('../config/constants');

const pdfRoutes = Router();

pdfRoutes.get('/', async (req, res) => {
  const filePath = resolve(
    __dirname,
    '..',
    '..',
    'tmp',
    'notaMemoriaKabum.pdf'
  );

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
