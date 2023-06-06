const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = process.env.PORT || '3001';
const dataPath = './talker.json';

const readData = async () => {
  try {
    const read = await fs.readFile(path.resolve(__dirname, dataPath), 'utf-8');
    return JSON.parse(read);
  } catch (err) {
    console.error(err);
  }
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