import { useState, useRef } from "react";

/**
 * File object with metadata
 */
export interface FileWithMetadata {
  id: string;
  name: string;
  file: File;
}

/**
 * Return type for useFileUpload hook
 */
export interface UseFileUploadReturn {
  files: FileWithMetadata[];
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  addFiles: (newFiles: File[]) => void;
  removeFile: (id: string) => void;
  clearFiles: () => void;
  resetInput: () => void;
}

/**
 * Custom hook for managing file uploads
 * @returns File upload state and handlers
 */
export const useFileUpload = (): UseFileUploadReturn => {
  const [files, setFiles] = useState<FileWithMetadata[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Adds new files to the existing files list
   * @param newFiles - Array of files to add
   */
  const addFiles = (newFiles: File[]): void => {
    const fileObjects: FileWithMetadata[] = newFiles.map((file) => ({
      id: `${Date.now()}-${Math.random()}`,
      name: file.name,
      file: file,
    }));
    setFiles((prev) => [...prev, ...fileObjects]);
  };

  /**
   * Removes a file by its ID
   * @param id - The ID of the file to remove
   */
  const removeFile = (id: string): void => {
    setFiles((prev) => prev.filter((file) => file.id !== id));
  };

  /**
   * Clears all files
   */
  const clearFiles = (): void => {
    setFiles([]);
  };

  /**
   * Resets the file input element
   */
  const resetInput = (): void => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return {
    files,
    fileInputRef,
    addFiles,
    removeFile,
    clearFiles,
    resetInput,
  };
};

