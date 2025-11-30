/**
 * Environment configuration and validation
 */

interface EnvConfig {
  isDevelopment: boolean;
  isProduction: boolean;
  apiBaseUrl: string;
}

/**
 * Validates required environment variables
 * @throws {Error} If required environment variables are missing
 */
export const validateEnv = (): void => {
  const requiredVars: string[] = [];
  const missingVars: string[] = [];

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
 * @returns Environment configuration
 */
export const getEnvConfig = (): EnvConfig => {
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
    console.warn(
      "Environment validation warning:",
      error instanceof Error ? error.message : String(error)
    );
  }
}

