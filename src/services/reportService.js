function removeSpecialChars(text) {
  return text
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

module.exports.compareCountries = (text1, text2) => {
  return (
    removeSpecialChars(text1.toLowerCase()) ===
    removeSpecialChars(text2.toLowerCase())
  );
};
