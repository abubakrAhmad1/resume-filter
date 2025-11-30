import { useState, useCallback } from "react";
import { Toaster } from "react-hot-toast";
import { useFileUpload } from "./hooks/useFileUpload";
import ResumeUploadSection from "./components/ResumeUploadSection/ResumeUploadSection";
import JobDescription from "./components/JobDescription/JobDescription";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import { filterResumes } from "./services/api";
import Button from "./components/Button/Button";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "./constants";
import { logger } from "./utils/logger";
import "./App.css";

/**
 * Main App component that orchestrates resume upload and job description flow
 */
function App() {
  const { files, fileInputRef, addFiles, removeFile, resetInput } = useFileUpload();
  const [jobDescription, setJobDescription] = useState("");
  const [showJobDescription, setShowJobDescription] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const [filterError, setFilterError] = useState(null);
  const [filterResult, setFilterResult] = useState(null);

  /**
   * Handles file upload and resets the input
   * @param {File[]} uploadedFiles - Array of uploaded PDF files
   */
  const handleFilesUploaded = useCallback((uploadedFiles) => {
    addFiles(uploadedFiles);
    resetInput();
    logger.info("Files uploaded", { count: uploadedFiles.length });
  }, [addFiles, resetInput]);

  /**
   * Handles job description button click and triggers slide animation
   */
  const handleAddJobDescription = () => {
    setShowJobDescription(true);
  };

  /**
   * Handles job description text change
   * @param {Event} event - Change event from textarea
   */
  const handleJobDescriptionChange = (event) => {
    setJobDescription(event.target.value);
  };

  /**
   * Handles back button click to return to upload section
   */
  const handleBack = () => {
    setShowJobDescription(false);
  };

  /**
   * Handles filter button click - sends PDFs and job description to backend API
   */
  const handleFilter = useCallback(async () => {
    // Validate that files and job description are provided
    if (files.length === 0) {
      setFilterError(ERROR_MESSAGES.NO_FILES);
      return;
    }

    if (!jobDescription.trim()) {
      setFilterError(ERROR_MESSAGES.NO_DESCRIPTION);
      return;
    }

    // Reset previous error and result
    setFilterError(null);
    setFilterResult(null);
    setIsFiltering(true);

    try {
      // Extract the actual File objects from the files array
      const pdfFiles = files.map((fileObj) => fileObj.file);

      logger.info("Starting resume filter", {
        fileCount: pdfFiles.length,
        descriptionLength: jobDescription.length,
      });

      // Call the API
      const result = await filterResumes(pdfFiles, jobDescription);

      // Handle successful response
      setFilterResult(result);
      logger.info("Filter completed successfully", { result });
    } catch (error) {
      // Handle error
      const errorMessage =
        error.message || ERROR_MESSAGES.API_ERROR;
      setFilterError(errorMessage);
      logger.error("Filter error", error, {
        fileCount: files.length,
        descriptionLength: jobDescription.length,
      });
    } finally {
      setIsFiltering(false);
    }
  }, [files, jobDescription]);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black py-8 px-4">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#1f2937",
              color: "#f3f4f6",
              border: "1px solid #374151",
            },
            success: {
              iconTheme: {
                primary: "#eab308",
                secondary: "#000000",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#ffffff",
              },
            },
          }}
        />
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent tracking-wide text-center mb-8 drop-shadow-lg">
            Resume Filter
          </h1>

          {/* Main Content Container with relative positioning for animations */}
          <div className="relative min-h-[400px] overflow-hidden">
          {/* Resume Upload Section */}
          <div
            className={`transition-all duration-500 ease-in-out ${
              !showJobDescription
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-full absolute w-full"
            }`}
          >
            <ResumeUploadSection
              files={files}
              onFilesUploaded={handleFilesUploaded}
              onRemoveFile={removeFile}
              fileInputRef={fileInputRef}
              isVisible={!showJobDescription}
            />
          </div>

          {/* Job Description Button - shown when upload section is visible */}
          {!showJobDescription && (
            <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-6 mt-6">
              <Button onClick={handleAddJobDescription}>
                Add Job Description
              </Button>
            </div>
          )}

          {/* Job Description Section - slides in from right */}
          <div
            className={`transition-all duration-500 ease-in-out ${
              showJobDescription
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-full absolute w-full top-0"
            }`}
          >
            <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-6">
              <JobDescription
                jobDescription={jobDescription}
                onJobDescriptionChange={handleJobDescriptionChange}
                isVisible={showJobDescription}
                onFilter={handleFilter}
                onBack={handleBack}
                isFiltering={isFiltering}
                filterError={filterError}
                filterResult={filterResult}
              />
            </div>
          </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;
