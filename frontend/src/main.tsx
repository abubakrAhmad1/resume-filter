import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { getEnvConfig } from "./config/env";
import "./index.css";
import App from "./App";

// Validate environment on startup
try {
  getEnvConfig();
} catch (error) {
  console.error(
    "Environment configuration error:",
    error instanceof Error ? error.message : String(error)
  );
}

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);

