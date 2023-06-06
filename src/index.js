const express = require('express');
const { readData, existingId } = require('./middlewares/existingId');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = process.env.PORT || '3001';

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