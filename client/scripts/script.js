const fileLoader = document.getElementById('fileLoader');
const uploadedFile = document.getElementById('uploadedFile');
const csvIcon = document.getElementById('csvIcon');
const xmlIcon = document.getElementById('xmlIcon');
const uploadedFileName = document.getElementById('uploadedFileName');
const errorMessage = document.getElementById('errorMessage');
const closeIcon = document.getElementById('closeIcon');
const generateReport = document.getElementById('generateReport');
const generateReportButton = document.getElementById('generateReportButton');

const baseUrl = 'http://localhost:5000/api';

let file;

closeIcon.addEventListener('click', () => {
  uploadedFile.style.display = 'none';
  generateReport.style.display = 'none';
  file = null;
});

uploadedFileName.addEventListener('focusout', function() {
  const actualFile = file;

  const initialType = actualFile.type.split('/').slice(-1)[0];
  let currentType = this.textContent.split('.').slice(-1)[0];

  if (this.textContent === '' || this.textContent === '.' + initialType || this.textContent === initialType) {
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

    errorMessage.classList.remove('error-message-show');

    uploadedFile.style.display = 'flex';
    generateReport.style.display = 'flex';

    if (type === 'text/csv') {
      csvIcon.style.display = 'block';
      xmlIcon.style.display = 'none';
    }

    if (type === 'text/xml') {
      xmlIcon.style.display = 'block';
      csvIcon.style.display = 'none';
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

generateReportButton.addEventListener('click', async function() {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(baseUrl + '/statement', {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();

  console.log(data);
});
