const PDFDocument = require('pdfkit');
const fs = require('fs');
const {
  TEMPORARY,
  FONTS,
  FONT,
} = require('../config/constants');

const TEXT_COLOR = '#303030';
const OFFSET = 10;

const FONT_TITLE = 25;
const FONT_BIG = 21;
const FONT_REGULAR = 16;
const HEADER_Y = 100;
const HEADER_X = 250;
const LINE = 25;

const BAR_COLOR = '#7E7E7E';
const BAR_X = 100;
const BAR_Y = 350;
const BAR_WIDTH = 420;
const BAR_THICKNESS = 2;

const CONTACT_TITLE =
  'Informações do Contato'.toUpperCase();

function generatePdf({ _id, companies }) {
  const cmp = companies[0];

  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(`${TEMPORARY}/guid.pdf`));

  doc.image(
    `${TEMPORARY}/sampleImage.png`,
    BAR_X,
    HEADER_Y - OFFSET,
    { scale: 0.25 }
  );

  doc
    .fillColor(TEXT_COLOR)
    .font(`${FONTS}/${FONT.BOLD}`)
    .fontSize(FONT_TITLE)
    .text(cmp.name, HEADER_X, HEADER_Y + OFFSET)
    .font(`${FONTS}/${FONT.REGULAR}`)
    .fontSize(FONT_REGULAR)
    .text(cmp.website, HEADER_X, HEADER_Y + LINE * 2)
    .text(cmp.email, HEADER_X, HEADER_Y + LINE * 3)
    .text(cmp.phone, HEADER_X, HEADER_Y + LINE * 4);

  doc
    .save()
    .moveTo(BAR_X, BAR_Y)
    .lineTo(BAR_X, BAR_Y + BAR_THICKNESS)
    .lineTo(BAR_X + BAR_WIDTH, BAR_Y + BAR_THICKNESS)
    .lineTo(BAR_X + BAR_WIDTH, BAR_Y)
    .fill(BAR_COLOR);

  doc
    .fontSize(FONT_BIG)
    .fillColor(TEXT_COLOR)
    .text(CONTACT_TITLE, BAR_X, BAR_Y - LINE - OFFSET)
    .fontSize(FONT_REGULAR)
    .text('NOME', BAR_X, BAR_Y + LINE * 1)
    .text('SOBRENOME', BAR_X, BAR_Y + LINE * 2)
    .text('EMAIL', BAR_X, BAR_Y + LINE * 3)
    .text('TELEFONE', BAR_X, BAR_Y + LINE * 4)
    .text(cmp.contact.firstname, HEADER_X, BAR_Y + LINE * 1)
    .text(cmp.contact.lastname, HEADER_X, BAR_Y + LINE * 2)
    .text(cmp.contact.email, HEADER_X, BAR_Y + LINE * 3)
    .text(cmp.contact.phone, HEADER_X, BAR_Y + LINE * 4);

  // Add some text with annotations
  // doc
  //   .addPage()
  //   .fillColor('blue')
  //   .text('Here is a link!', 100, 100)
  //   .underline(100, 100, 160, 27, { color: '#0000FF' })
  //   .link(100, 100, 160, 27, 'http://google.com/');

  doc.end();
}

const report = {
  _id: '61e8e7f54e15d060d4e149eb',
  createdBy: 'iuri@email.com',
  country: 'argentina',
  companies: [
    {
      contact: {
        firstname: 'Demian',
        lastname: 'Zambrano',
        email: 'qmendes@valdez.com',
        phone: '+2779982961414',
      },
      name: 'Rezende e Sanches S.A.',
      email: 'pablo.marques@solano.org',
      phone: '+7737224870361',
      website: 'http://pena.br',
      image: 'http://placeimg.com/640/480/people',
      _id: '61e8e7f54e15d060d4e149ec',
    },
    {
      contact: {
        firstname: 'Josefina',
        lastname: 'Lozano',
        email: 'sverdara@burgos.com',
        phone: '+7234675283223',
      },
      name: 'Mendes-Tamoio',
      email: 'alonso.deoliveira@beltrao.org',
      phone: '+2784799262919',
      website: 'http://salas.com.br',
      image: 'http://placeimg.com/640/480/people',
      _id: '61e8e7f54e15d060d4e149ed',
    },
    {
      contact: {
        firstname: 'Paula',
        lastname: 'Bittencourt',
        email: 'tessalia51@sepulveda.net',
        phone: '+2625555474816',
      },
      name: 'Furtado-Rivera',
      email: 'fidalgo.luzia@serna.org',
      phone: '+4174845671064',
      website: 'http://salas.com.br',
      image: 'http://placeimg.com/640/480/people',
      _id: '61e8e7f54e15d060d4e149ee',
    },
    {
      contact: {
        firstname: 'Felipe',
        lastname: 'Escobar',
        email: 'kcortes@terra.com.br',
        phone: '+4410805683618',
      },
      name: 'Ortega Comercial Ltda.',
      email: 'maia.violeta@terra.com.br',
      phone: '+7873386776016',
      website: 'http://matias.com.br',
      image: 'http://placeimg.com/640/480/people',
      _id: '61e8e7f54e15d060d4e149ef',
    },
  ],
  createdAt: '2022-01-20T04:41:25.169Z',
  __v: 0,
};

generatePdf(report);
