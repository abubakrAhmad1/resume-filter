import { FileWithMetadata } from "../../hooks/useFileUpload";
import FileItem from "../FileItem/FileItem";

/**
 * FileList component props
 */
interface FileListProps {
  files: FileWithMetadata[];
  onRemoveFile: (id: string) => void;
  isVisible: boolean;
}

/**
 * FileList component displays a list of uploaded files
 */
const FileList = ({ files, onRemoveFile, isVisible }: FileListProps) => {
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
      <h3 className="text-lg font-medium text-gray-300 mb-3">
        Uploaded Files <span className="text-yellow-400">({files.length})</span>
      </h3>
      <div className="space-y-2">
        {files.map((file) => (
          <FileItem key={file.id} file={file} onRemove={onRemoveFile} />
        ))}
      </div>
    </div>
  );
};

export default FileList;

