import { memo } from "react";
import { FileWithMetadata } from "../../hooks/useFileUpload";
import Button from "../Button/Button";

/**
 * FileItem component props
 */
interface FileItemProps {
  file: FileWithMetadata;
  onRemove: (id: string) => void;
}

/**
 * FileItem component displays a single uploaded file with delete functionality
 */
const FileItem = memo(({ file, onRemove }: FileItemProps) => {
  return (
    <div className="flex items-center justify-between bg-gray-900 border border-gray-700 rounded-lg p-3 hover:bg-gray-800 hover:border-gray-600 transition-colors">
      <span className="text-gray-200 font-medium flex-1 truncate mr-3">
        {file.name}
      </span>
      <Button
        onClick={() => onRemove(file.id)}
        iconOnly
        className="flex-shrink-0 text-gray-400 hover:text-yellow-400 hover:bg-gray-800"
        aria-label={`Remove ${file.name}`}
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
      </Button>
    </div>
  );
});

FileItem.displayName = "FileItem";

export default FileItem;

