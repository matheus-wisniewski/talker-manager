const fs = require('fs').promises;
const path = require('path');
const express = require('express');
const crypto = require('crypto');
const { readData, existingId } = require('./middlewares/existingId');
const { 
  verifyInputs, 
  validateEmailInput, 
  validatePasswordInput } = require('./middlewares/validateLogin');
const { 
  validateToken, 
  validateNameInput, 
  validateAgeInput, 
  validateTalkInput, 
  validateWatchedAt, 
  validateRate } = require('./middlewares/validateNewTalker');

const dataPath = '../talker.json';

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const HTTP_CREATED_STATUS = 201;
const PORT = process.env.PORT || '3001';

const token = () => {
  const number = crypto.randomBytes(8);
  const hex = number.toString('hex');
  return hex;
};

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});

app.get('/talker', async (req, res) => {
  const talkerData = await readData();
  if (talkerData) {
    res.status(HTTP_OK_STATUS).json(talkerData);
  } else {
    return [];
  }
});

app.get('/talker/:id', existingId, async (req, res) => {
  const talker = await readData();
  res.json(talker.find((t) => t.id === Number(req.params.id))); 
});

app.post('/login', verifyInputs, validateEmailInput, validatePasswordInput, (req, res) => {
  const { email, password } = req.body;
  const getToken = token();
  const loginBody = {
    email,
    password,
  };

  if (loginBody) {
    res.status(HTTP_OK_STATUS).json({ token: getToken });
  }
});

app.post('/talker', 
validateToken, validateNameInput, 
validateAgeInput, validateTalkInput,
validateWatchedAt, validateRate,

async (req, res) => {
  const { name, age, talk: { watchedAt, rate } } = req.body;
  const talker = await readData();

  const newTalker = {
    id: talker.length + 1,
    name,
    age,
    talk: {
      watchedAt,
      rate,
    },
  };
  talker.push(newTalker);
  fs.writeFile(path.resolve(__dirname, dataPath),
  JSON.stringify(talker));

  return res.status(HTTP_CREATED_STATUS).json(newTalker);
});