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
  validateRate, 
  verifyJustDate, 
  newCheckRate, 
  newCheckDecimalRate } = require('./middlewares/validateNewTalker');
const { getRateFromURL, getQFromURL } = require('./middlewares/searchURL');
const connection = require('./db/connection');

const dataPath = './talker.json';

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const HTTP_CREATED_STATUS = 201;
const HTTP_NO_CONTENT_SUCCESS = 204;
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

app.get('/talker/db', async (req, res) => {
  const [result] = await connection.execute('SELECT * FROM TalkerDB.talkers');

  const talkerList = result.map((t) => ({
      age: t.age,
      id: t.id,
      name: t.name,
      talk: {
        rate: t.talk_rate,
        watchedAt: t.talk_watched_at,
      },
    }));

  res.status(HTTP_OK_STATUS).json(talkerList);
});

app.get('/talker/search', 
validateToken, verifyJustDate, 
getQFromURL, getRateFromURL, async (req, res) => {
  const talker = await readData();
  const { q, rate, date } = req.query;
  let toReturn = talker;

  if (rate) {
    toReturn = toReturn.filter((t) => t.talk.rate === Number(rate));
  } if (q) {
    toReturn = toReturn.filter((t) => t.name.includes(q));
  } if (date) {
   toReturn = toReturn.filter((t) => t.talk.watchedAt === date);
  }

  return res.status(HTTP_OK_STATUS).json(toReturn);
});

app.get('/talker', async (req, res) => {
  const talkerData = await readData();

  if (talkerData) {
    res.status(HTTP_OK_STATUS).json(talkerData);
  } else {
    return [];
  }
});

app.patch('/talker/rate/:id', validateToken, 
newCheckRate, newCheckDecimalRate, async (req, res) => {
  const talker = await readData(); 
  const { rate } = req.body;
  const { id } = req.params;

  const newTalkersList = talker.map((t) => {
    if (t.id === +id) {
      return { 
        ...t,
        talk: {
          ...t.talk,
          rate } }; 
    } return t;
  });
  fs.writeFile(path.resolve(__dirname, dataPath), JSON.stringify(newTalkersList));

  return res.status(HTTP_NO_CONTENT_SUCCESS).json({});
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
  fs.writeFile(path.resolve(__dirname, dataPath), JSON.stringify(talker));

  return res.status(HTTP_CREATED_STATUS).json(newTalker);
});

app.put('/talker/:id', 
validateToken, validateNameInput, 
validateAgeInput, validateTalkInput,
validateWatchedAt, validateRate, existingId,
async (req, res) => {
  const { name, age, talk: { watchedAt, rate } } = req.body;
  const talker = await readData();
  const { id } = req.params;
  const updateTalker = talker.map((t) => {
    if (t.id === +id) {
      return {
        ...t,
        name,
        age,
        talk: {
          watchedAt,
          rate },
        };
      } return t; 
  }); fs.writeFile(path.resolve(__dirname, dataPath), JSON.stringify(updateTalker));
    const newTalkerList = updateTalker.find((t) => t.id === +id);

    return res.status(HTTP_OK_STATUS).json(newTalkerList);
});

app.delete('/talker/:id', validateToken, async (req, res) => {
  const talker = await readData();
  const { id } = req.params;
  const deleteTalker = talker.filter((t) => t.id !== +id);

  fs.writeFile(path.resolve(__dirname, dataPath), JSON.stringify(deleteTalker));
  
  res.status(HTTP_NO_CONTENT_SUCCESS).json(deleteTalker);
});