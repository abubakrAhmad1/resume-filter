import { useState, useRef } from "react";

/**
 * Custom hook for managing file uploads
 * @returns {Object} File upload state and handlers
 */
export const useFileUpload = () => {
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

  /**
   * Adds new files to the existing files list
   * @param {File[]} newFiles - Array of files to add
   */
  const addFiles = (newFiles) => {
    const fileObjects = newFiles.map((file) => ({
      id: `${Date.now()}-${Math.random()}`,
      name: file.name,
      file: file,
    }));
    setFiles((prev) => [...prev, ...fileObjects]);
  };

  /**
   * Removes a file by its ID
   * @param {string} id - The ID of the file to remove
   */
  const removeFile = (id) => {
    setFiles((prev) => prev.filter((file) => file.id !== id));
  };

  /**
   * Clears all files
   */
  const clearFiles = () => {
    setFiles([]);
  };

  /**
   * Resets the file input element
   */
  const resetInput = () => {
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

