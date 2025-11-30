import PropTypes from "prop-types";
import { filterPDFs, validatePDF } from "../../utils/fileValidation";
import Button from "../Button/Button";

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
      <label htmlFor="resume-upload" className="cursor-pointer inline-block">
        <Button as="span">
          Choose PDF Files
        </Button>
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

