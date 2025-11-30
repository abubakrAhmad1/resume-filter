import { memo, ChangeEvent } from "react";
import Button from "../Button/Button";

/**
 * JobDescription component props
 */
interface JobDescriptionProps {
  jobDescription: string;
  onJobDescriptionChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  isVisible: boolean;
  onFilter: () => void;
  onBack: () => void;
  isFiltering?: boolean;
  filterError?: string | null;
  filterResult?: unknown;
}

/**
 * JobDescription component handles job description input
 */
const JobDescription = memo(({
  jobDescription,
  onJobDescriptionChange,
  isVisible,
  onFilter,
  onBack,
  isFiltering = false,
  filterError,
  filterResult,
}: JobDescriptionProps) => {
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
        <>
          {typeof filterError === "string" && filterError.length > 0 && (
            <div className="mt-4 p-4 bg-red-900/30 border border-red-600/50 rounded-lg">
              <p className="text-sm text-red-300">{filterError}</p>
            </div>
          )}
        </>

        {/* Success Message */}
        {filterResult && (
          <div className="mt-4 p-4 bg-green-900/30 border border-green-600/50 rounded-lg">
            <p className="text-sm text-green-300 font-medium">
              Filter completed successfully!
            </p>
            <pre className="mt-2 text-xs text-gray-300 overflow-auto bg-gray-900/50 p-2 rounded">
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
});

JobDescription.displayName = "JobDescription";

export default JobDescription;

