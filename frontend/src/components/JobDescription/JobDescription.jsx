import PropTypes from "prop-types";

/**
 * JobDescription component handles job description input
 * @param {Object} props - Component props
 * @param {string} props.jobDescription - Current job description text
 * @param {Function} props.onJobDescriptionChange - Callback when description changes
 * @param {boolean} props.isVisible - Whether the component should be visible
 * @param {Function} props.onFilter - Callback when filter button is clicked
 * @param {Function} props.onBack - Callback when back button is clicked
 * @param {boolean} props.isFiltering - Whether the filter request is in progress
 * @param {string|null} props.filterError - Error message if filter request failed
 * @param {Object|null} props.filterResult - Result from successful filter request
 */
const JobDescription = ({
  jobDescription,
  onJobDescriptionChange,
  isVisible,
  onFilter,
  onBack,
  isFiltering,
  filterError,
  filterResult,
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

        {/* Error Message */}
        {filterError && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{filterError}</p>
          </div>
        )}

        {/* Success Message */}
        {filterResult && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800 font-medium">
              Filter completed successfully!
            </p>
            <pre className="mt-2 text-xs text-green-700 overflow-auto">
              {JSON.stringify(filterResult, null, 2)}
            </pre>
          </div>
        )}

        <button
          onClick={onFilter}
          disabled={isFiltering}
          className={`mt-6 bg-purple-600 text-white px-8 py-3 rounded-lg transition-colors duration-200 font-medium ${
            isFiltering
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-purple-700"
          }`}
          type="button"
        >
          {isFiltering ? (
            <span className="flex items-center gap-2">
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
              Filtering...
            </span>
          ) : (
            "Filter"
          )}
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
  isFiltering: PropTypes.bool,
  filterError: PropTypes.string,
  filterResult: PropTypes.object,
};

export default JobDescription;

