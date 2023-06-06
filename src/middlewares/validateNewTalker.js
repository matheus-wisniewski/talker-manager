const HTTP_BAD_REQUEST = 400;
const HTTP_UNAUTHORIZED_RESPONSE = 401;

const validateToken = (req, res, next) => {
  const { authorization } = req.headers;
  const verifyString = typeof authorization === 'string';
  const maxLength = 16;

  if (!authorization) {
    return res.status(HTTP_UNAUTHORIZED_RESPONSE).json({ message: 'Token não encontrado' });
  }

  if (authorization.length !== maxLength || !verifyString) {
    return res.status(HTTP_UNAUTHORIZED_RESPONSE).json({ message: 'Token inválido' });
  }

  return next();
};

const valideAgeFormat = (date) => {
  const regex = /^(0[1-9]|[1-2]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
  return regex.test(date);
};

const validateNameInput = (req, res, next) => {
  const { name } = req.body;
  const nameError = 'O campo "name" é obrigatório';
  const nameLengthError = 'O "name" deve ter pelo menos 3 caracteres';
   
  if (!name) {
    res.status(HTTP_BAD_REQUEST).json({ message: nameError });
  } else if (name.length < 3) {
    res.status(HTTP_BAD_REQUEST).json({ message: nameLengthError });
  } else { 
  return next();
}
};

const validateAgeInput = (req, res, next) => {
  const { age } = req.body;
  const ageToNumber = Number(age);
  const ageToInteger = Number.isInteger(ageToNumber);
  const ageError = 'O campo "age" é obrigatório';
  const typeOfAge = 'O campo "age" deve ser um número inteiro igual ou maior que 18';
   
  if (!age) {
    res.status(HTTP_BAD_REQUEST).json({ message: ageError });
  } else if (typeof ageToNumber !== 'number' || age < 18 || !ageToInteger) { 
    res.status(HTTP_BAD_REQUEST).json({ message: typeOfAge });
  } else {
    return next();
  }
};

const validateTalkInput = (req, res, next) => {
  const { talk } = req.body;
  const talkError = 'O campo "talk" é obrigatório';

  if (!talk) {
    res.status(HTTP_BAD_REQUEST).json({ message: talkError });
  }
  next();
};

const validateWatchedAt = (req, res, next) => {
  const { talk: { watchedAt } } = req.body;
  const watchedAtDateFormatError = 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"';
  const watchedAtError = 'O campo "watchedAt" é obrigatório';
  const verifyDateFormat = valideAgeFormat(watchedAt);
  if (!watchedAt) {
    return res.status(HTTP_BAD_REQUEST).json({ message: watchedAtError });
  }

  if (!verifyDateFormat) {
    res.status(HTTP_BAD_REQUEST).json({ message: watchedAtDateFormatError });
  } else {
    next();
  }
};

const qualquerNome = (rate, res) => {
  const rateError = 'O campo "rate" é obrigatório';
  
  if (!rate && rate !== 0) {
    res.status(HTTP_BAD_REQUEST).json({ message: rateError });
  }
};

const validateRate = (req, res, next) => {
  const { talk: { rate } } = req.body;
  const rateToInteger = Number.isInteger(rate);
  const rateMinAndMax = (rate > 0 && rate <= 5);
  const rateNumberError = 'O campo "rate" deve ser um número inteiro entre 1 e 5';
  qualquerNome(rate, res);
  if (!rateToInteger || !rateMinAndMax) {
    res.status(HTTP_BAD_REQUEST).json({ message: rateNumberError });
  } else {
    next();
  }
};

module.exports = {
  validateAgeInput,
  validateNameInput,
  validateTalkInput,
  validateToken,
  validateWatchedAt,
  validateRate,
};