class FileProcessingError extends Error {
  constructor(message, errorCode) {
    super(message)
    this.name = 'FileProcessingError';
    this.errorCode = errorCode;
  }
}

export default FileProcessingError;
