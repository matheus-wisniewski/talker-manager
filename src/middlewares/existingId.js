const dataPath = '../talker.json';
const fs = require('fs').promises;
const path = require('path');

const readData = async () => {
  try {
    const read = await fs.readFile(path.resolve(__dirname, dataPath), 'utf-8');
    return JSON.parse(read);
  } catch (err) {
    console.error(err);
  }
};

const existingId = async (req, res, next) => {
  const talker = await readData();
  const id = Number(req.params.id);
  if (!talker.some((t) => t.id === id)) {
    return res.status(404).json({ 
      message: 'Pessoa palestrante não encontrada', 
    });
  }
  next();
};

module.exports = {
  readData,
  existingId,
};