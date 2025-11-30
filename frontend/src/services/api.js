import { getApiUrl } from "../config/api";

/**
 * Sends PDF files and job description to the backend API for filtering
 * @param {File[]} pdfFiles - Array of PDF File objects to send
 * @param {string} jobDescription - Job description text
 * @returns {Promise<Response>} API response
 */
export const filterResumes = async (pdfFiles, jobDescription) => {
  // Create FormData to send files and text data
  const formData = new FormData();

  // Append all PDF files to FormData
  pdfFiles.forEach((file, index) => {
    // Use 'resumes' as the field name (backend can expect multiple files with same name)
    // or use 'resumes[]' if your backend expects array notation
    formData.append("resumes", file.file);
  });

  // Append job description
  formData.append("job_description", jobDescription);

  // Get the API endpoint URL
  const apiUrl = getApiUrl("/api/filter-resumes");

  // Make the API call
  const response = await fetch(apiUrl, {
    method: "POST",
    body: formData,
    // Don't set Content-Type header - browser will set it automatically with boundary for FormData
  });

  // Check if the response is ok
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: `HTTP error! status: ${response.status}`,
    }));
    throw new Error(errorData.message || `API request failed with status ${response.status}`);
  }

  // Return the response
  return response.json();
};

