import { RefObject } from "react";
import { FileWithMetadata } from "../../hooks/useFileUpload";
import ResumeUpload from "../ResumeUpload/ResumeUpload";
import FileList from "../FileList/FileList";

/**
 * ResumeUploadSection component props
 */
interface ResumeUploadSectionProps {
  files: FileWithMetadata[];
  onFilesUploaded: (files: File[]) => void;
  onRemoveFile: (id: string) => void;
  fileInputRef: RefObject<HTMLInputElement | null>;
  isVisible: boolean;
}

/**
 * ResumeUploadSection component combines upload and file list
 */
const ResumeUploadSection = ({
  files,
  onFilesUploaded,
  onRemoveFile,
  fileInputRef,
  isVisible,
}: ResumeUploadSectionProps) => {
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

export default ResumeUploadSection;

