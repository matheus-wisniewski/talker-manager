const { readData } = require('./existingId');

const getRateFromURL = (req, res, next) => {
  const { rate, q } = req.query;

  const rateToNumber = Number(rate);
  const rateToInteger = Number.isInteger(rateToNumber);
  const rateMinAndMax = (rate > 0 && rate < 6);
  const errorMessage = 'O campo "rate" deve ser um número inteiro entre 1 e 5';

  if ((!rateToInteger || !rateMinAndMax) && !q) {
    res.status(400).json({ message: errorMessage });
  } else {
    next();
  }
};

const getQFromURL = async (req, res, next) => {
  const talker = await readData();
  const { q, rate } = req.query;

  if ((!q || q.length === 0) && !rate) {
    res.status(200).json(talker);
  } else {
    next();
  }
};

module.exports = {
  getRateFromURL,
  getQFromURL,
};