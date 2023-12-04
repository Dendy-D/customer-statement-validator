const fileLoader = document.getElementById('fileLoader');
const uploadedFileContainer = document.getElementById('uploadedFileContainer')
const uploadedFileCsvIcon = document.getElementById('uploadedFileCsvIcon');
const uploadedFileXmlIcon = document.getElementById('uploadedFileXmlIcon');
const uploadedFileName = document.getElementById('uploadedFileName');
const errorMessage = document.getElementById('errorMessage');
const closeIcon = document.getElementById('closeIcon');
const generateReportButton = document.getElementById('generateReportButton');
const downloadReports = document.getElementById('downloadReports');
const downloadingFileCsvIcon = document.getElementById('downloadingFileCsvIcon');
const downloadingFileXmlIcon = document.getElementById('downloadingFileXmlIcon');
const downloadingFileName = document.getElementById('downloadingFileName');
const downloadedFile = document.getElementById('downloadedFile');

const baseUrl = 'http://79.174.83.84:5000/api';

let file;
let url;
let link;

closeIcon.addEventListener('click', () => {
  uploadedFileContainer.style.display = 'none';
  file = null;
});

uploadedFileName.addEventListener('focusout', function() {
  const actualFile = file;

  const initialType = actualFile.type.split('/').slice(-1)[0];
  let currentType = this.textContent.split('.').slice(-1)[0];

  if (
    this.textContent === '' ||
    this.textContent === '.' + initialType ||
    this.textContent === initialType
  ) {
    this.textContent = actualFile.name;
  } else if (initialType !== currentType) {
    this.textContent = this.textContent + '.' + initialType;
  }
});

fileLoader.addEventListener('change', handleFileUpload);

function handleFileUpload(event) {
  if (typeof event.target.files[0] === 'undefined') return;

  const { type, name } = event.target.files[0];
  let timeoutId;

  if (['text/xml', 'text/csv'].includes(type)) {
    file = event.target.files[0];
    clearTimeout(timeoutId);

    downloadedFile.removeEventListener('click', downloadFileHandler)
    URL.revokeObjectURL(url);

    errorMessage.classList.remove('error-message-show');

    uploadedFileContainer.style.display = 'flex';
    downloadReports.style.display = 'none';

    if (type === 'text/csv') {
      uploadedFileCsvIcon.style.display = 'block';
      uploadedFileXmlIcon.style.display = 'none';
    }

    if (type === 'text/xml') {
      uploadedFileXmlIcon.style.display = 'block';
      uploadedFileCsvIcon.style.display = 'none';
    }

    uploadedFileName.textContent = name;
  } else {
    errorMessage.classList.add('error-message-show');

    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      errorMessage.classList.remove('error-message-show');
    }, 5000);

    return;
  }
}

function showLoader() {
  const loader = document.getElementById('loader');
  loader.style.display = 'inline-block';
}

function hideLoader() {
  const loader = document.getElementById('loader');
  loader.style.display = 'none';
}

generateReportButton.addEventListener('click', async function() {
  uploadedFileContainer.style.display = 'none';
  let loading = true;

  try {
    if (loading) {
      showLoader();
    }

    file = new File([file], uploadedFileName.textContent, {
      type: file.type,
      lastModified: file.lastModified,
    });

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(baseUrl + '/statement', {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.message);
    }

    const blob = await response.blob();
    
    let fileType = blob.type.split('/')[1];
    let fileTypeInHeaderFormat = fileType[0].toUpperCase() + fileType.slice(1);
    
    const fileName = response.headers.get(`${fileTypeInHeaderFormat}-File-Name`);

    downloadReports.style.display = 'flex';

    if (fileType === 'csv') {
      downloadingFileCsvIcon.style.display = 'block';
      downloadingFileXmlIcon.style.display = 'none';
    }

    if (fileType === 'xml') {
      downloadingFileXmlIcon.style.display = 'block';
      downloadingFileCsvIcon.style.display = 'none';
    }
    
    downloadingFileName.textContent = fileName;

    hideLoader();

    downloadedFile.addEventListener('click', downloadFileHandler);

    url = URL.createObjectURL(blob);

    link = document.createElement('a');
    link.href = url;
    link.download = fileName;
  } catch (error) {
    console.log('Error: ', error);
    hideLoader();
  }
});

function downloadFileHandler() {
  link.click();
}
