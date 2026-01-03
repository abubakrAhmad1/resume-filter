import PropTypes from "prop-types";

/**
 * ShortlistedResumes component displays the filtered/shortlisted resumes with similarity scores
 * @param {Object} props - Component props
 * @param {Object} props.filterResult - Result object from the API containing shortlisted resumes
 * @param {boolean} props.isVisible - Whether the component should be visible
 */
const ShortlistedResumes = ({ filterResult, isVisible }) => {
  if (!filterResult || !isVisible) {
    return null;
  }

  const { resumes, filtered_resumes, total_resumes, processed_resumes, threshold } = filterResult;

  return (
    <div
      className={`bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-6 transition-all duration-500 ease-in-out ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-yellow-400">
          Shortlisted Resumes
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Threshold:</span>
          <span className="text-sm font-semibold text-yellow-400">{threshold || 70}%</span>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
          <div className="text-xs text-gray-400 mb-1">Total Uploaded</div>
          <div className="text-2xl font-bold text-yellow-400">{total_resumes || 0}</div>
        </div>
        <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
          <div className="text-xs text-gray-400 mb-1">Processed</div>
          <div className="text-2xl font-bold text-blue-400">{processed_resumes || 0}</div>
        </div>
        <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
          <div className="text-xs text-gray-400 mb-1">Shortlisted</div>
          <div className="text-2xl font-bold text-green-400">{filtered_resumes || 0}</div>
        </div>
      </div>

      {/* Shortlisted Resumes List */}
      {resumes && resumes.length > 0 ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent"></div>
            <span className="text-sm font-medium text-gray-400">
              Resumes with similarity ≥ {threshold || 70}%
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent"></div>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {resumes.map((resume, index) => {
              const score = resume.similarity_score || 0;
              const getScoreColor = (score) => {
                if (score >= 85) return "text-green-400";
                if (score >= 75) return "text-yellow-400";
                return "text-orange-400";
              };

              const getScoreBgColor = (score) => {
                if (score >= 85) return "bg-green-500/20 border-green-500/50";
                if (score >= 75) return "bg-yellow-500/20 border-yellow-500/50";
                return "bg-orange-500/20 border-orange-500/50";
              };

              return (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${getScoreBgColor(score)} transition-all hover:scale-[1.02] hover:shadow-lg`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {/* Rank Badge */}
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-black font-bold text-sm">
                        #{index + 1}
                      </div>

                      {/* File Name */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-400 flex-shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                            />
                          </svg>
                          <span className="text-base font-medium text-gray-200 truncate">
                            {resume.filename}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Similarity Score */}
                    <div className="flex items-center gap-3 ml-4">
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${getScoreColor(score)}`}>
                          {score.toFixed(2)}%
                        </div>
                        <div className="text-xs text-gray-400">Similarity</div>
                      </div>
                      {/* Checkmark for shortlisted */}
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500/20 border border-green-500/50 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-green-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="h-2 bg-gray-900 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          score >= 85
                            ? "bg-gradient-to-r from-green-400 to-green-600"
                            : score >= 75
                            ? "bg-gradient-to-r from-yellow-400 to-yellow-600"
                            : "bg-gradient-to-r from-orange-400 to-orange-600"
                        }`}
                        style={{ width: `${Math.min(score, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-yellow-900/30 border border-yellow-600/50 rounded-lg p-6 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-yellow-400 mx-auto mb-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-yellow-300 font-medium mb-1">
            No Resumes Shortlisted
          </p>
          <p className="text-sm text-yellow-400/80">
            No resumes matched the similarity threshold of {threshold || 70}%
          </p>
        </div>
      )}
    </div>
  );
};

ShortlistedResumes.propTypes = {
  filterResult: PropTypes.shape({
    resumes: PropTypes.arrayOf(
      PropTypes.shape({
        filename: PropTypes.string.isRequired,
        similarity_score: PropTypes.number.isRequired,
      })
    ),
    filtered_resumes: PropTypes.number,
    total_resumes: PropTypes.number,
    processed_resumes: PropTypes.number,
    threshold: PropTypes.number,
  }),
  isVisible: PropTypes.bool.isRequired,
};

export default ShortlistedResumes;

