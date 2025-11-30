import PropTypes from "prop-types";

/**
 * JobDescription component handles job description input
 * @param {Object} props - Component props
 * @param {string} props.jobDescription - Current job description text
 * @param {Function} props.onJobDescriptionChange - Callback when description changes
 * @param {boolean} props.isVisible - Whether the component should be visible
 * @param {Function} props.onFilter - Callback when filter button is clicked
 * @param {Function} props.onBack - Callback when back button is clicked
 */
const JobDescription = ({
  jobDescription,
  onJobDescriptionChange,
  isVisible,
  onFilter,
  onBack,
}) => {
  return (
    <div
      className={`transition-all duration-500 ease-in-out ${
        isVisible
          ? "opacity-100 translate-x-0"
          : "opacity-0 translate-x-full pointer-events-none"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          Job Description
        </h2>
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
          type="button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back
        </button>
      </div>
      <div>
        <textarea
          value={jobDescription}
          onChange={onJobDescriptionChange}
          placeholder="Enter job description here..."
          className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
        {jobDescription && (
          <div className="mt-4 text-sm text-gray-600">
            Character count: {jobDescription.length}
          </div>
        )}
        <button
          onClick={onFilter}
          className="mt-6 bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors duration-200 font-medium"
          type="button"
        >
          Filter
        </button>
      </div>
    </div>
  );
};

JobDescription.propTypes = {
  jobDescription: PropTypes.string.isRequired,
  onJobDescriptionChange: PropTypes.func.isRequired,
  isVisible: PropTypes.bool.isRequired,
  onFilter: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
};

export default JobDescription;

