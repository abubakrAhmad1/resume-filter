import PropTypes from "prop-types";
import FileItem from "../FileItem/FileItem";

/**
 * FileList component displays a list of uploaded files
 * @param {Object} props - Component props
 * @param {Array} props.files - Array of file objects
 * @param {Function} props.onRemoveFile - Callback function when a file is removed
 * @param {boolean} props.isVisible - Whether the list should be visible
 */
const FileList = ({ files, onRemoveFile, isVisible }) => {
  if (files.length === 0) {
    return null;
  }

  return (
    <div
      className={`mt-6 transition-all duration-500 ease-in-out ${
        isVisible
          ? "opacity-100 translate-x-0"
          : "opacity-0 -translate-x-full pointer-events-none"
      }`}
    >
      <h3 className="text-lg font-medium text-gray-700 mb-3">
        Uploaded Files ({files.length})
      </h3>
      <div className="space-y-2">
        {files.map((file) => (
          <FileItem key={file.id} file={file} onRemove={onRemoveFile} />
        ))}
      </div>
    </div>
  );
};

FileList.propTypes = {
  files: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  onRemoveFile: PropTypes.func.isRequired,
  isVisible: PropTypes.bool.isRequired,
};

export default FileList;

