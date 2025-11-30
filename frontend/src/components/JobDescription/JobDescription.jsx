import PropTypes from "prop-types";
import Button from "../Button/Button";

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
        <Button
          onClick={onBack}
          icon={
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
          }
        >
          Back
        </Button>
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

        <Button
          onClick={onFilter}
          disabled={isFiltering}
          loading={isFiltering}
          className="mt-6"
        >
          {isFiltering ? "Filtering..." : "Filter"}
        </Button>
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

