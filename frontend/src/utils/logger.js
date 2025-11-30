/**
 * Logger utility for application logging
 * Replaces console statements with proper logging
 */

const isDevelopment = import.meta.env.DEV;

/**
 * Log levels
 */
export const LogLevel = {
  DEBUG: "debug",
  INFO: "info",
  WARN: "warn",
  ERROR: "error",
};

/**
 * Logger class for structured logging
 */
class Logger {
  /**
   * Log debug message (only in development)
   * @param {string} message - Log message
   * @param {Object} data - Additional data
   */
  debug(message, data = {}) {
    if (isDevelopment) {
      console.debug(`[DEBUG] ${message}`, data);
    }
  }

  /**
   * Log info message
   * @param {string} message - Log message
   * @param {Object} data - Additional data
   */
  info(message, data = {}) {
    if (isDevelopment) {
      console.info(`[INFO] ${message}`, data);
    }
    // In production, you might want to send to logging service
  }

  /**
   * Log warning message
   * @param {string} message - Log message
   * @param {Object} data - Additional data
   */
  warn(message, data = {}) {
    if (isDevelopment) {
      console.warn(`[WARN] ${message}`, data);
    }
    // In production, send to error tracking service
  }

  /**
   * Log error message
   * @param {string} message - Log message
   * @param {Error} error - Error object
   * @param {Object} context - Additional context
   */
  error(message, error = null, context = {}) {
    if (isDevelopment) {
      console.error(`[ERROR] ${message}`, { error, ...context });
    }
    // In production, send to error tracking service (e.g., Sentry)
    // Example: Sentry.captureException(error, { extra: context });
  }
}

// Export singleton instance
export const logger = new Logger();

