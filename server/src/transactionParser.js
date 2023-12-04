import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';
import parser from 'xml2json';
import xmlFormatter from 'xml-formatter';

import { FileProcessingError, FileErrorCodes } from './errors/FileProcessingError/index.js';
import transactionValidation from './utils/transactionValidation.js';
import preprocessData from './utils/preprocessData.js'

function statementParser(req, res) {
  const file = req.file;

  if (!file) {
    throw new FileProcessingError('File is undefined', FileErrorCodes.FILE_UNDEFINED);
  }

  const { originalname, buffer, mimetype } = file;

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

      const validatedTransanctions = transactionValidation(preprocessData(transactions, 'csv'), 'csv');

      const headers = ['Reference', 'Description'];
      const csvData = validatedTransanctions.map(({ reference, description }) => [reference, description]);

      const csvString = stringify([headers, ...csvData]);

      const reportName = originalname.split('.')[0] + 'Report';

      res.setHeader('Content-Disposition', `attachment; filename=${reportName}.csv"`);
      res.setHeader('Content-Type', 'application/csv');
      res.setHeader('Csv-File-Name', `${reportName}.${fileType}`)

      setTimeout(() => res.send(csvString), 1000);
    }

    if (fileType === 'xml') {
      const xmlInStringRepresentation = buffer.toString('utf8');

      const transactions = parser.toJson(xmlInStringRepresentation, { object: true }).records.record;

      const validatedTransanctions = transactionValidation(preprocessData(transactions, 'xml'), 'xml');

      const xmlOfValidatedTransactions = `<records>${validatedTransanctions.map(record =>
        `<record reference="${record.reference}">
          <description>${record.description.trim()}</description>
        </record>`
      ).join('')}</records>`;

      const xmlString = xmlFormatter(xmlOfValidatedTransactions, { indentation: '  ' });

      const reportName = originalname.split('.')[0] + 'Report';

      res.setHeader('Content-Disposition', `attachment; filename=${reportName}.xml"`);
      res.setHeader('Content-Type', 'application/xml');
      res.setHeader('Xml-File-Name', `${reportName}.${fileType}`);

      setTimeout(() => res.send(xmlString), 1000);
    }
  } catch(e) {
    throw new FileProcessingError('File processing failed', FileErrorCodes.FILE_PROCESSING_FAILED);
  }
}

export default statementParser;
