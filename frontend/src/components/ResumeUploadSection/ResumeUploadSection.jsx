import PropTypes from "prop-types";
import ResumeUpload from "../ResumeUpload/ResumeUpload";
import FileList from "../FileList/FileList";

/**
 * ResumeUploadSection component combines upload and file list
 * @param {Object} props - Component props
 * @param {Array} props.files - Array of uploaded files
 * @param {Function} props.onFilesUploaded - Callback when files are uploaded
 * @param {Function} props.onRemoveFile - Callback when a file is removed
 * @param {Object} props.fileInputRef - Ref to the file input element
 * @param {boolean} props.isVisible - Whether the section should be visible
 */
const ResumeUploadSection = ({
  files,
  onFilesUploaded,
  onRemoveFile,
  fileInputRef,
  isVisible,
}) => {
  return (
    <div
      className={`bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-6 transition-all duration-500 ease-in-out ${
        isVisible
          ? "opacity-100 translate-x-0"
          : "opacity-0 -translate-x-full pointer-events-none"
      }`}
    >
      <h2 className="text-2xl font-semibold text-yellow-400 mb-4">
        Upload Resumes
      </h2>
      <ResumeUpload
        onFilesUploaded={onFilesUploaded}
        fileInputRef={fileInputRef}
      />
      <FileList files={files} onRemoveFile={onRemoveFile} isVisible={isVisible} />
    </div>
  );
};

ResumeUploadSection.propTypes = {
  files: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  onFilesUploaded: PropTypes.func.isRequired,
  onRemoveFile: PropTypes.func.isRequired,
  fileInputRef: PropTypes.object.isRequired,
  isVisible: PropTypes.bool.isRequired,
};

export default ResumeUploadSection;

