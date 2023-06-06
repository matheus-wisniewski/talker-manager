const INVALID_REQUEST = 400;

function verifyInputs(req, res, next) {
  const { email, password } = req.body;
  const errorEmail = 'O campo "email" é obrigatório';
  const errorPassword = 'O campo "password" é obrigatório';

  if (email && password) {
    next();
  } else {
    return res.status(INVALID_REQUEST).json({
      message: !email ? errorEmail : errorPassword,
    });
  }
}

function validateEmailFormat(email) {
  const regex = /\S+@\S+\.\S+/;
  return regex.test(email);
}

function validateEmailInput(req, res, next) {
  const { email } = req.body;
  const errorEmail = 'O "email" deve ter o formato "email@email.com"';
  const validateEmail = validateEmailFormat(email);

  if (validateEmail) {
    next();
  } else {
    res.status(INVALID_REQUEST).json({ message: errorEmail });
  }
}

function validatePasswordInput(req, res, next) {
  const { password } = req.body;
  const minLength = 5;
  const errorPassword = 'O "password" deve ter pelo menos 6 caracteres';

  if (password.length > minLength) {
    next();
  } else {
    res.status(INVALID_REQUEST).json({ message: errorPassword });
  }
}

module.exports = {
  verifyInputs,
  validatePasswordInput,
  validateEmailInput,
};