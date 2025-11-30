import PropTypes from "prop-types";

/**
 * FileItem component displays a single uploaded file with delete functionality
 * @param {Object} props - Component props
 * @param {Object} props.file - File object with id and name
 * @param {Function} props.onRemove - Callback function when file is removed
 */
const FileItem = ({ file, onRemove }) => {
  return (
    <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-3 hover:bg-gray-100 transition-colors">
      <span className="text-gray-800 font-medium flex-1 truncate mr-3">
        {file.name}
      </span>
      <button
        onClick={() => onRemove(file.id)}
        className="flex-shrink-0 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full p-1 transition-colors"
        aria-label={`Remove ${file.name}`}
        type="button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
};

FileItem.propTypes = {
  file: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default FileItem;

