/**
 * Environment configuration and validation
 */

/**
 * Validates required environment variables
 * @throws {Error} If required environment variables are missing
 */
export const validateEnv = () => {
  const requiredVars = [];
  const missingVars = [];

  // Check required variables
  requiredVars.forEach((varName) => {
    if (!import.meta.env[varName]) {
      missingVars.push(varName);
    }
  });

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}`
    );
  }
};

/**
 * Get environment configuration
 * @returns {Object} Environment configuration
 */
export const getEnvConfig = () => {
  return {
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD,
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
  };
};

// Validate on module load (only in development)
if (import.meta.env.DEV) {
  try {
    validateEnv();
  } catch (error) {
    console.warn("Environment validation warning:", error.message);
  }
}

