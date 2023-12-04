import express from 'express';
import cors from 'cors';
import multer from 'multer';

import statementParser from './transactionParser.js';
import fileProcessingErrorHandler from './middlewares/fileProcessingErrorHandler.js'

const app = express();

const PORT = process.env.PORT || 5000;
const SERVER_IP = process.env.SERVER_IP || 'localhost';

const corsOptions = {
  origin: 'http://79.174.83.84:80',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
  allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Xml-File-Name, Csv-File-Name',
  exposedHeaders: 'Xml-File-Name, Csv-File-Name',
};

app.use(cors(corsOptions));
app.use(express.json());

app.use(fileProcessingErrorHandler);

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
};

start();
