import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { getEnvConfig } from "./config/env";
import "./index.css";
import App from "./App.jsx";

// Validate environment on startup
try {
  getEnvConfig();
} catch (error) {
  console.error("Environment configuration error:", error);
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
