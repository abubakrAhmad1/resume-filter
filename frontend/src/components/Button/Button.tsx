import { ReactNode, ElementType } from "react";

/**
 * Button component props
 */
export interface ButtonProps {
  children?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
  icon?: ReactNode;
  variant?: string;
  iconOnly?: boolean;
  as?: ElementType;
}

/**
 * Reusable Button component with consistent styling
 */
const Button = ({
  children,
  onClick,
  disabled = false,
  loading = false,
  type = "button",
  className = "",
  icon,
  iconOnly = false,
  as: Component = "button",
}: ButtonProps) => {
  // Base button styles - consistent for all buttons
  const baseStyles = iconOnly
    ? "inline-flex items-center justify-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
    : "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 shadow-lg";

  // Black, Gold, and Silver color scheme
  // Gold for primary buttons, Silver for icon-only buttons
  const colorStyles = iconOnly
    ? "text-gray-300 hover:text-yellow-400 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed p-1"
    : "bg-gradient-to-r from-yellow-500 to-yellow-600 text-black hover:from-yellow-400 hover:to-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-md hover:shadow-xl";

  // Combine all styles
  const buttonStyles = `${baseStyles} ${colorStyles} ${className}`;

  // Props to pass to the component
  const componentProps: Record<string, unknown> = {
    className: buttonStyles,
    onClick,
    ...(Component === "button" && {
      type,
      disabled: disabled || loading,
    }),
  };

  return (
    <Component {...componentProps}>
      {loading ? (
        <>
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          {!iconOnly && children}
        </>
      ) : (
        <>
          {icon && <span className="flex-shrink-0">{icon}</span>}
          {children}
        </>
      )}
    </Component>
  );
};

export default Button;

