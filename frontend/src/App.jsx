import { useState } from "react";
import { useFileUpload } from "./hooks/useFileUpload";
import ResumeUploadSection from "./components/ResumeUploadSection/ResumeUploadSection";
import JobDescription from "./components/JobDescription/JobDescription";
import "./App.css";

/**
 * Main App component that orchestrates resume upload and job description flow
 */
function App() {
  const { files, fileInputRef, addFiles, removeFile, resetInput } = useFileUpload();
  const [jobDescription, setJobDescription] = useState("");
  const [showJobDescription, setShowJobDescription] = useState(false);

  /**
   * Handles file upload and resets the input
   * @param {File[]} uploadedFiles - Array of uploaded PDF files
   */
  const handleFilesUploaded = (uploadedFiles) => {
    addFiles(uploadedFiles);
    resetInput();
  };

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
   * Handles filter button click
   */
  const handleFilter = () => {
    // TODO: Implement filter logic
    console.log("Filtering resumes with:", {
      files: files.map((f) => f.name),
      jobDescription,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-blue-600 tracking-wide text-center mb-8">
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
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              {/* <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Job Description
              </h2> */}
              <button
                onClick={handleAddJobDescription}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
                type="button"
              >
                Add Job Description
              </button>
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
            <div className="bg-white rounded-lg shadow-md p-6">
              <JobDescription
                jobDescription={jobDescription}
                onJobDescriptionChange={handleJobDescriptionChange}
                isVisible={showJobDescription}
                onFilter={handleFilter}
                onBack={handleBack}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
