import express from 'express';
import cors from 'cors';
import multer from 'multer';

import statementParser from './transactionParser.js';

const app = express();

const PORT = process.env.PORT || 5000;
const SERVER_IP = process.env.SERVER_IP || 'localhost';

app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

const start = () => {
  try {
    app.get('/', (req, res) => {
      res.send('Server is running');
    });

    app.post('/api/statement', upload.single('file'), statementParser);
    
    app.listen(PORT, () => {
      console.log(`Server is running on http://${SERVER_IP}:${PORT}`);
    });
  } catch (e) {
    console.error(e);
  }
}

start();
