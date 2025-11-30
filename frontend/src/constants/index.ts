/**
 * Application constants
 * Centralized constants for better maintainability
 */

export const ERROR_MESSAGES = {
  NO_FILES: "Please upload at least one resume PDF file.",
  NO_DESCRIPTION: "Please enter a job description.",
  INVALID_PDF: (fileName: string): string =>
    `${fileName} is not a PDF file. Only PDF files are allowed.`,
  API_ERROR: "Failed to filter resumes. Please try again.",
  NETWORK_ERROR: "Network error. Please check your connection and try again.",
  UNKNOWN_ERROR: "An unexpected error occurred. Please try again.",
} as const;

export const SUCCESS_MESSAGES = {
  FILTER_COMPLETE: "Filter completed successfully!",
  FILES_UPLOADED: (count: number): string =>
    `${count} file${count > 1 ? "s" : ""} uploaded successfully.`,
} as const;

export const VALIDATION = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB in bytes
  ALLOWED_FILE_TYPES: ["application/pdf"] as const,
  ALLOWED_FILE_EXTENSIONS: [".pdf"] as const,
} as const;

export const API = {
  TIMEOUT: 30000, // 30 seconds
  MAX_RETRIES: 3,
} as const;

export const UI = {
  TOAST_DURATION: 4000, // 4 seconds
  ANIMATION_DURATION: 500, // milliseconds
} as const;

