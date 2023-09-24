import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import mammoth from 'mammoth';

export const generateDocx = async (decodedFile, data) => {
  const templateBase64 = decodedFile;
  const templateContent = atob(templateBase64);
  const zip = new PizZip(templateContent);
  const doc = new Docxtemplater().loadZip(zip);

  doc.setData(data);
  try {
    doc.render();
  } catch (error) {
    console.error(error);
    return;
  }

  const generatedDocx = doc.getZip().generate({
    type: 'blob',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  });

  const reader = new FileReader();
  reader.onload = async function (event) {
    const arrayBuffer = event.target.result;
    try {
      const htmlOutput = await mammoth.convertToHtml({ arrayBuffer: arrayBuffer });
      const htmlContent = htmlOutput.value;

      const iframe = document.createElement('iframe');
      iframe.style.visibility = 'hidden';
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      document.body.appendChild(iframe);

      iframe.contentDocument.open();
      iframe.contentDocument.write(htmlContent);
      iframe.contentDocument.close();

      iframe.contentWindow.print();

    } catch (error) {
      console.error('Error during conversion:', error);
    }
  };

  reader.onerror = function (error) {
    console.error('Error reading DOCX blob:', error);
  };

  reader.readAsArrayBuffer(generatedDocx);
};
