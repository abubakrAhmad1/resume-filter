/**
 * API Configuration
 * Update this URL when you have your backend API endpoint
 */
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
  ENDPOINTS: {
    FILTER_RESUMES: "/api/filter-resumes", // Update this endpoint path as needed
  },
};

/**
 * Get the full API URL for an endpoint
 * @param {string} endpoint - The API endpoint path
 * @returns {string} Full API URL
 */
export const getApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

