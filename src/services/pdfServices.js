const pdfkit = require('pdfkit');
const fs = require('fs');
const { join } = require('path');

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

exports.generatePdf = async ({ _id, companies }) => {
  let page = 1;

  const filePath = `${TEMPORARY}/${_id}.pdf`;
  const lastId = companies[companies.length - 1]._id;
  const doc = new pdfkit().on('end', () => filePath);
  doc.pipe(fs.createWriteStream(filePath));

  companies.forEach(cmp => {
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
      .lineTo(
        LEFT_MARGIN + BAR_WIDTH,
        BAR_Y + BAR_THICKNESS
      )
      .lineTo(LEFT_MARGIN + BAR_WIDTH, BAR_Y)
      .fill(BAR_COLOR);

    doc
      .fontSize(FONT_BIG)
      .fillColor(TEXT_COLOR)
      .text(
        CONTACT_TITLE,
        LEFT_MARGIN,
        BAR_Y - LINE - OFFSET
      )
      .fontSize(FONT_REGULAR)
      .text('NOME', LEFT_MARGIN, BAR_Y + LINE * 1)
      .text('SOBRENOME', LEFT_MARGIN, BAR_Y + LINE * 2)
      .text('EMAIL', LEFT_MARGIN, BAR_Y + LINE * 3)
      .text('TELEFONE', LEFT_MARGIN, BAR_Y + LINE * 4)
      .text(cmp.contact.firstname, PROP_X, BAR_Y + LINE * 1)
      .text(cmp.contact.lastname, PROP_X, BAR_Y + LINE * 2)
      .text(cmp.contact.email, PROP_X, BAR_Y + LINE * 3)
      .text(cmp.contact.phone, PROP_X, BAR_Y + LINE * 4);

    doc.text(
      `Página ${page++} de ${companies.length}`,
      0.5 * (doc.page.width - 100),
      doc.page.height - 100
    );

    if (cmp._id !== lastId) {
      doc.addPage();
    }
  });

  doc.end();

  await waitForFileExists(filePath);
  return filePath;
};

async function waitForFileExists(
  filePath,
  interval = 100,
  currentTime = 0,
  timeout = 5000
) {
  if (fs.existsSync(filePath)) return true;
  if (currentTime === timeout) return false;

  await new Promise((resolve, reject) =>
    setTimeout(() => resolve(true), interval)
  );

  return waitForFileExists(
    filePath,
    currentTime + interval,
    timeout
  );
}

exports.deleteReportAfterSent = (
  filePath,
  delayMinutes = 1
) => {
  return setTimeout(
    () => fs.unlinkSync(filePath),
    delayMinutes * 1000 * 60
  );
};
