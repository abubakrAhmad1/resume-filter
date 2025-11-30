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
} as const;

export type LogLevelType = typeof LogLevel[keyof typeof LogLevel];

/**
 * Logger class for structured logging
 */
class Logger {
  /**
   * Log debug message (only in development)
   * @param message - Log message
   * @param data - Additional data
   */
  debug(message: string, data: Record<string, unknown> = {}): void {
    if (isDevelopment) {
      console.debug(`[DEBUG] ${message}`, data);
    }
  }

  /**
   * Log info message
   * @param message - Log message
   * @param data - Additional data
   */
  info(message: string, data: Record<string, unknown> = {}): void {
    if (isDevelopment) {
      console.info(`[INFO] ${message}`, data);
    }
    // In production, you might want to send to logging service
  }

  /**
   * Log warning message
   * @param message - Log message
   * @param data - Additional data
   */
  warn(message: string, data: Record<string, unknown> = {}): void {
    if (isDevelopment) {
      console.warn(`[WARN] ${message}`, data);
    }
    // In production, send to error tracking service
  }

  /**
   * Log error message
   * @param message - Log message
   * @param error - Error object
   * @param context - Additional context
   */
  error(
    message: string,
    error: Error | null = null,
    context: Record<string, unknown> = {}
  ): void {
    if (isDevelopment) {
      console.error(`[ERROR] ${message}`, { error, ...context });
    }
    // In production, send to error tracking service (e.g., Sentry)
    // Example: Sentry.captureException(error, { extra: context });
  }
}

// Export singleton instance
export const logger = new Logger();

