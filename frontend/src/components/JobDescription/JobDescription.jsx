import { memo } from "react";
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
const JobDescription = memo(({
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
        <h2 className="text-2xl font-semibold text-yellow-400">
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
          className="w-full h-48 p-4 bg-gray-900 border border-gray-600 text-gray-100 placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 resize-none"
        />
        {jobDescription && (
          <div className="mt-4 text-sm text-gray-400">
            Character count: <span className="text-yellow-400">{jobDescription.length}</span>
          </div>
        )}

        {/* Error Message */}
        {filterError && (
          <div className="mt-4 p-4 bg-red-900/30 border border-red-600/50 rounded-lg">
            <p className="text-sm text-red-300">{filterError}</p>
          </div>
        )}

        {/* Success Message */}
        {filterResult && (
          <div className="mt-4 p-4 bg-green-900/30 border border-green-600/50 rounded-lg">
            <p className="text-sm text-green-300 font-medium mb-3">
              ✓ Filter completed successfully!
            </p>
            
            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4 mb-4 text-xs">
              <div className="bg-gray-900/50 p-2 rounded">
                <div className="text-gray-400">Total</div>
                <div className="text-yellow-400 font-semibold">{filterResult.total_resumes || 0}</div>
              </div>
              <div className="bg-gray-900/50 p-2 rounded">
                <div className="text-gray-400">Processed</div>
                <div className="text-blue-400 font-semibold">{filterResult.processed_resumes || 0}</div>
              </div>
              <div className="bg-gray-900/50 p-2 rounded">
                <div className="text-gray-400">Matched</div>
                <div className="text-green-400 font-semibold">{filterResult.filtered_resumes || 0}</div>
              </div>
            </div>

            {/* Filtered Resumes List */}
            {filterResult.resumes && filterResult.resumes.length > 0 ? (
              <div className="space-y-2">
                <p className="text-xs text-gray-400 mb-2">
                  Resumes with similarity ≥ {filterResult.threshold || 70}%:
                </p>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {filterResult.resumes.map((resume, index) => (
                    <div
                      key={index}
                      className="bg-gray-900/50 p-3 rounded border border-gray-700 flex items-center justify-between"
                    >
                      <span className="text-sm text-gray-200 truncate flex-1 mr-2">
                        {resume.filename}
                      </span>
                      <span className="text-sm font-semibold text-yellow-400 whitespace-nowrap">
                        {resume.similarity_score?.toFixed(2) || '0.00'}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-yellow-900/30 border border-yellow-600/50 rounded p-3">
                <p className="text-xs text-yellow-300">
                  No resumes matched the similarity threshold of {filterResult.threshold || 70}%
                </p>
              </div>
            )}

            {/* Raw JSON (collapsible for debugging) */}
            <details className="mt-4">
              <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-400">
                View raw JSON
              </summary>
              <pre className="mt-2 text-xs text-gray-300 overflow-auto bg-gray-900/50 p-2 rounded max-h-40">
                {JSON.stringify(filterResult, null, 2)}
              </pre>
            </details>
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
});

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

JobDescription.displayName = "JobDescription";

export default JobDescription;

