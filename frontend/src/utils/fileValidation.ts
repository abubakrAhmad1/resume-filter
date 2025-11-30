/**
 * Validates if a file is a PDF
 * @param file - The file to validate
 * @returns True if file is a PDF, false otherwise
 */
export const isPDF = (file: File): boolean => {
  return (
    file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")
  );
};

/**
 * Validates multiple files and returns only PDFs
 * @param files - Array of files to validate
 * @returns Array of valid PDF files
 */
export const filterPDFs = (files: File[] | FileList): File[] => {
  return Array.from(files).filter(isPDF);
};

/**
 * Validates and returns error message if file is not PDF
 * @param file - The file to validate
 * @returns Error message or null if valid
 */
export const validatePDF = (file: File): string | null => {
  if (!isPDF(file)) {
    return `${file.name} is not a PDF file. Only PDF files are allowed.`;
  }
  return null;
};

