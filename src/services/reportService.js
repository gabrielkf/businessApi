const superagent = require('superagent');
const { API_URL } = require('../config/constants');

function removeSpecialCharsLower(text) {
  return text
    .toLowerCase()
    .replace('á', 'a')
    .replace('à', 'a')
    .replace('â', 'a')
    .replace('ã', 'a')
    .replace('é', 'e')
    .replace('ê', 'e')
    .replace('í', 'i')
    .replace('ó', 'o')
    .replace('ô', 'o')
    .replace('õ', 'o')
    .replace('ú', 'u')
    .replace('ü', 'u')
    .replace('ç', 'c');
}

function filterByCountry(companyCountry, searchCountry) {
  return removeSpecialCharsLower(companyCountry).includes(
    removeSpecialCharsLower(searchCountry)
  );
}

async function getCompaniesByCountry(country) {
  const { text } = await superagent.get(API_URL);
  const { data: companies } = JSON.parse(text);

  const filteredCompanies = companies.filter(c => {
    return filterByCountry(c.country, country);
  });

  return filteredCompanies;
}

module.exports = {
  removeSpecialCharsLower,
  getCompaniesByCountry,
};
