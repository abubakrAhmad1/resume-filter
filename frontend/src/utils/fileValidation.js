/**
 * Validates if a file is a PDF
 * @param {File} file - The file to validate
 * @returns {boolean} - True if file is a PDF, false otherwise
 */
export const isPDF = (file) => {
  return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
};

/**
 * Validates multiple files and returns only PDFs
 * @param {File[]} files - Array of files to validate
 * @returns {File[]} - Array of valid PDF files
 */
export const filterPDFs = (files) => {
  return Array.from(files).filter(isPDF);
};

/**
 * Validates and returns error message if file is not PDF
 * @param {File} file - The file to validate
 * @returns {string|null} - Error message or null if valid
 */
export const validatePDF = (file) => {
  if (!isPDF(file)) {
    return `${file.name} is not a PDF file. Only PDF files are allowed.`;
  }
  return null;
};

