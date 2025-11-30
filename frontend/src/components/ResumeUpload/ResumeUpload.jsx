import PropTypes from "prop-types";
import toast from "react-hot-toast";
import { filterPDFs, validatePDF } from "../../utils/fileValidation";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../constants";
import { logger } from "../../utils/logger";
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
    
    // Show error for non-PDF files using toast
    selectedFiles.forEach((file) => {
      const error = validatePDF(file);
      if (error) {
        toast.error(ERROR_MESSAGES.INVALID_PDF(file.name));
        logger.warn("Invalid file type attempted", { fileName: file.name, fileType: file.type });
      }
    });

    // Only upload valid PDF files
    if (pdfFiles.length > 0) {
      onFilesUploaded(pdfFiles);
      toast.success(SUCCESS_MESSAGES.FILES_UPLOADED(pdfFiles.length));
      logger.info("Files uploaded successfully", { count: pdfFiles.length });
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
      <p className="mt-2 text-sm text-gray-400">
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

