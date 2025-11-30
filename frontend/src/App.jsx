import { useState, useRef } from "react";
import "./App.css";

function App() {
  const [resumes, setResumes] = useState([]);
  const [jobDescription, setJobDescription] = useState("");
  const [showJobDescriptionInput, setShowJobDescriptionInput] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const newResumes = files.map((file) => ({
      id: Date.now() + Math.random(),
      name: file.name,
      file: file,
    }));
    setResumes((prev) => [...prev, ...newResumes]);
    // Reset input to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveFile = (id) => {
    setResumes((prev) => prev.filter((resume) => resume.id !== id));
  };

  const handleJobDescriptionClick = () => {
    setShowJobDescriptionInput(true);
  };

  const handleJobDescriptionChange = (event) => {
    setJobDescription(event.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-blue-600 tracking-wide text-center mb-8">
          Resume Filter
        </h1>

        {/* Resume Upload Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Upload Resumes
          </h2>
          
          <div className="mb-4">
            <label
              htmlFor="resume-upload"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors duration-200 font-medium"
            >
              Choose Files
            </label>
            <input
              id="resume-upload"
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              multiple
              accept=".pdf,.doc,.docx"
              className="hidden"
            />
          </div>

          {/* Uploaded Files List */}
          {resumes.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-700 mb-3">
                Uploaded Files ({resumes.length})
              </h3>
              <div className="space-y-2">
                {resumes.map((resume) => (
                  <div
                    key={resume.id}
                    className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-3 hover:bg-gray-100 transition-colors"
                  >
                    <span className="text-gray-800 font-medium flex-1 truncate mr-3">
                      {resume.name}
                    </span>
                    <button
                      onClick={() => handleRemoveFile(resume.id)}
                      className="flex-shrink-0 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full p-1 transition-colors"
                      aria-label={`Remove ${resume.name}`}
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
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Job Description Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Job Description
          </h2>
          
          {!showJobDescriptionInput ? (
            <button
              onClick={handleJobDescriptionClick}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
            >
              Add Job Description
            </button>
          ) : (
            <div>
              <textarea
                value={jobDescription}
                onChange={handleJobDescriptionChange}
                placeholder="Enter job description here..."
                className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              {jobDescription && (
                <div className="mt-4 text-sm text-gray-600">
                  Character count: {jobDescription.length}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
