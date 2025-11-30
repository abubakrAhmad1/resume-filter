import { getApiUrl } from "../config/api";
import { logger } from "../utils/logger";
import { ERROR_MESSAGES, API } from "../constants";

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
  pdfFiles.forEach((file) => {
    // Use 'resumes' as the field name (backend can expect multiple files with same name)
    // or use 'resumes[]' if your backend expects array notation
    // Handle both File objects and file objects with .file property
    const fileToAppend = file instanceof File ? file : file.file || file;
    formData.append("resumes", fileToAppend);
  });

  // Append job description
  formData.append("job_description", jobDescription);

  // Get the API endpoint URL
  const apiUrl = getApiUrl("/api/filter-resumes");

  logger.info("Sending API request", {
    url: apiUrl,
    fileCount: pdfFiles.length,
  });

  // Create AbortController for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API.TIMEOUT);

  try {
    // Make the API call
    const response = await fetch(apiUrl, {
      method: "POST",
      body: formData,
      signal: controller.signal,
      // Don't set Content-Type header - browser will set it automatically with boundary for FormData
    });

    clearTimeout(timeoutId);

    // Check if the response is ok
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: `HTTP error! status: ${response.status}`,
      }));
      const errorMessage =
        errorData.message || `API request failed with status ${response.status}`;
      logger.error("API request failed", null, {
        status: response.status,
        statusText: response.statusText,
        errorData,
      });
      throw new Error(errorMessage);
    }

    // Return the response
    const result = await response.json();
    logger.info("API request successful", { result });
    return result;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === "AbortError") {
      logger.error("API request timeout", error);
      throw new Error("Request timeout. Please try again.");
    }
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      logger.error("Network error", error);
      throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
    }
    throw error;
  }
};

