module.exports.customError = (status, message) => {
  return {
    status,
    body: { message },
  };
};
