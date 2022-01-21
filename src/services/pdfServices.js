const pdf = require('pdfkit');
const fs = require('fs');
const {
  TEMPORARY,
  FONTS,
  FONT,
} = require('../config/constants');

const LEFT_MARGIN = 100;

const TEXT_COLOR = '#303030';
const OFFSET = 10;

const FONT_TITLE = 25;
const FONT_BIG = 21;
const FONT_REGULAR = 16;
const HEADER_Y = 100;
const LINE = 25;

const BAR_COLOR = '#7E7E7E';
const BAR_Y = 350;
const BAR_WIDTH = 420;
const BAR_THICKNESS = 2;
const PROP_X = 250;

const CONTACT_TITLE =
  'Informações do Contato'.toUpperCase();

exports.generatePdf = ({ _id, companies }) => {
  const cmp = companies[0];
  const filePath = `${TEMPORARY}/${_id}.pdf`;

  const doc = new pdf();
  doc.pipe(fs.createWriteStream(filePath));

  doc
    .fillColor(TEXT_COLOR)
    .font(`${FONTS}/${FONT.BOLD}`)
    .fontSize(FONT_TITLE)
    .text(cmp.name, LEFT_MARGIN, HEADER_Y + OFFSET)
    .font(`${FONTS}/${FONT.REGULAR}`)
    .fontSize(FONT_REGULAR)
    .text(cmp.website, LEFT_MARGIN, HEADER_Y + LINE * 2)
    .text(cmp.email, LEFT_MARGIN, HEADER_Y + LINE * 3)
    .text(cmp.phone, LEFT_MARGIN, HEADER_Y + LINE * 4);

  doc
    .save()
    .moveTo(LEFT_MARGIN, BAR_Y)
    .lineTo(LEFT_MARGIN, BAR_Y + BAR_THICKNESS)
    .lineTo(LEFT_MARGIN + BAR_WIDTH, BAR_Y + BAR_THICKNESS)
    .lineTo(LEFT_MARGIN + BAR_WIDTH, BAR_Y)
    .fill(BAR_COLOR);

  doc
    .fontSize(FONT_BIG)
    .fillColor(TEXT_COLOR)
    .text(CONTACT_TITLE, LEFT_MARGIN, BAR_Y - LINE - OFFSET)
    .fontSize(FONT_REGULAR)
    .text('NOME', LEFT_MARGIN, BAR_Y + LINE * 1)
    .text('SOBRENOME', LEFT_MARGIN, BAR_Y + LINE * 2)
    .text('EMAIL', LEFT_MARGIN, BAR_Y + LINE * 3)
    .text('TELEFONE', LEFT_MARGIN, BAR_Y + LINE * 4)
    .text(cmp.contact.firstname, PROP_X, BAR_Y + LINE * 1)
    .text(cmp.contact.lastname, PROP_X, BAR_Y + LINE * 2)
    .text(cmp.contact.email, PROP_X, BAR_Y + LINE * 3)
    .text(cmp.contact.phone, PROP_X, BAR_Y + LINE * 4);

  doc.end();

  return filePath;
};
