import PropTypes from "prop-types";
import { filterPDFs, validatePDF } from "../../utils/fileValidation";

/**
 * ResumeUpload component handles file upload with PDF validation
 * @param {Object} props - Component props
 * @param {Function} props.onFilesUploaded - Callback function when files are uploaded
 * @param {Object} props.fileInputRef - Ref to the file input element
 */
const ResumeUpload = ({ onFilesUploaded, fileInputRef }) => {
  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    
    if (selectedFiles.length === 0) {
      return;
    }

    // Filter only PDF files
    const pdfFiles = filterPDFs(selectedFiles);
    
    // Show error for non-PDF files
    selectedFiles.forEach((file) => {
      const error = validatePDF(file);
      if (error) {
        alert(error);
      }
    });

    // Only upload valid PDF files
    if (pdfFiles.length > 0) {
      onFilesUploaded(pdfFiles);
    }
  };

  return (
    <div className="mb-4">
      <label
        htmlFor="resume-upload"
        className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors duration-200 font-medium"
      >
        Choose PDF Files
      </label>
      <input
        id="resume-upload"
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple
        accept=".pdf,application/pdf"
        className="hidden"
      />
      <p className="mt-2 text-sm text-gray-500">
        Only PDF files are allowed
      </p>
    </div>
  );
};

ResumeUpload.propTypes = {
  onFilesUploaded: PropTypes.func.isRequired,
  fileInputRef: PropTypes.object.isRequired,
};

export default ResumeUpload;

