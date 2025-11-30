import PropTypes from "prop-types";

/**
 * Reusable Button component with consistent styling
 * @param {Object} props - Component props
 * @param {string} props.children - Button content (text or JSX)
 * @param {Function} props.onClick - Click handler function
 * @param {boolean} props.disabled - Whether the button is disabled
 * @param {boolean} props.loading - Whether the button is in loading state
 * @param {string} props.type - Button type (button, submit, reset)
 * @param {string} props.className - Additional CSS classes
 * @param {React.ReactNode} props.icon - Optional icon to display before text
 * @param {string} props.variant - Button variant (for future use, currently all same style)
 * @param {boolean} props.iconOnly - Whether this is an icon-only button (smaller padding)
 * @param {string} props.as - Render as different element (button, span, div, etc.)
 */
const Button = ({
  children,
  onClick,
  disabled = false,
  loading = false,
  type = "button",
  className = "",
  icon,
  variant = "primary",
  iconOnly = false,
  as: Component = "button",
}) => {
  // Base button styles - consistent for all buttons
  const baseStyles = iconOnly
    ? "inline-flex items-center justify-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    : "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500";

  // Consistent color scheme for all buttons (blue)
  // For icon-only buttons, use a more subtle style but still blue-themed
  const colorStyles = iconOnly
    ? "text-blue-600 hover:text-blue-800 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed p-1"
    : "bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed";

  // Combine all styles
  const buttonStyles = `${baseStyles} ${colorStyles} ${className}`;

  // Props to pass to the component
  const componentProps = {
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

Button.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  className: PropTypes.string,
  icon: PropTypes.node,
  variant: PropTypes.string,
  iconOnly: PropTypes.bool,
  as: PropTypes.elementType,
};

export default Button;

