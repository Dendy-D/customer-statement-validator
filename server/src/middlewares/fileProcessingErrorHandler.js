import { FileProcessingError, FileErrorCodes } from '../errors/FileProcessingError/index.js';

function fileProcessingErrorHandler(err, req, res, next) {
  if (err instanceof FileProcessingError) {
    if (err.errorCode === FileErrorCodes.FILE_UNDEFINED) {
      res.status(400).json({ error: 'File is undefined' });
    } else if (err.errorCode === FileErrorCodes.INVALID_FILE_TYPE) {
      res.status(400).json({ error: 'Invalid file type' });
    } else if (err.errorCode === FileErrorCodes.FILE_PROCESSING_FAILED) {
      res.status(500).json({ error: 'File processing failed' });
    } else {
      res.status(500).json({ error: 'Unknown file processing error' });
    }
  } else {
    console.error('Unexpected error occurred:', err);
    res.status(500).json({ error: 'Unexpected error occurred' });
  }
}

export default fileProcessingErrorHandler;
