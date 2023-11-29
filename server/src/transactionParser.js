import { parse } from 'csv-parse/sync';
import parser from 'xml2json';

import { FileProcessingError, FileErrorCodes } from './errors/FileProcessingError/index.js';

function statementParser(req, res) {
  const file = req.file;

  if (!file) {
    throw new FileProcessingError('File is undefined', FileErrorCodes.FILE_UNDEFINED);
  }

  const { originalName, buffer, mimetype } = file;

  const fileType = mimetype.split('/').slice(-1)[0];

  if (!['xml', 'csv'].includes(fileType)) {
    throw new FileProcessingError('Invalid file type', FileErrorCodes.INVALID_FILE_TYPE);
  }

  try {
    if (fileType === 'csv') {
      const csvInStringRepresentation = buffer.toString('utf8');

      const transactions = parse(csvInStringRepresentation, {
        columns: true,
        skip_empty_lines: true,
      });

      console.log(transactions);
    }

    if (fileType === 'xml') {
      const xmlInStringRepresentation = buffer.toString('utf8');

      const transactions = parser.toJson(xmlInStringRepresentation, { object: true }).records.record;

      console.log(transactions);
    }
  } catch(e) {
    throw new FileProcessingError('File processing failed', FileErrorCodes.FILE_PROCESSING_FAILED);
  }
}

export default statementParser;
