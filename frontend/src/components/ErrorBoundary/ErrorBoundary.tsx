import { Component, ReactNode, ErrorInfo } from "react";
import Button from "../Button/Button";

/**
 * ErrorBoundary component props
 */
interface ErrorBoundaryProps {
  children: ReactNode;
}

/**
 * ErrorBoundary component state
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary component to catch React errors
 * Provides graceful error handling and user-friendly error messages
 */
class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(_error: Error): Partial<ErrorBoundaryState> {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to error reporting service
    this.setState({
      error,
      errorInfo,
    });

    // In production, send to error tracking service
    if (import.meta.env.PROD) {
      // Example: Sentry.captureException(error, { extra: errorInfo });
      console.error("Error caught by boundary:", error, errorInfo);
    }
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    // Optionally reload the page
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center px-4">
          <div className="max-w-2xl w-full bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-8">
            <div className="text-center">
              <div className="mb-6">
                <svg
                  className="mx-auto h-16 w-16 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-yellow-400 mb-4">
                Something went wrong
              </h1>
              <p className="text-gray-300 mb-6">
                We're sorry, but something unexpected happened. Please try
                refreshing the page.
              </p>
              {import.meta.env.DEV && this.state.error && (
                <details className="mb-6 text-left bg-gray-900 p-4 rounded-lg overflow-auto max-h-64">
                  <summary className="text-yellow-400 cursor-pointer mb-2">
                    Error Details (Development Only)
                  </summary>
                  <pre className="text-xs text-red-300 whitespace-pre-wrap">
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )}
              <Button onClick={this.handleReset}>Reload Application</Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

