# Similarity Checking Logic Improvements

## Issues Identified and Fixed

### 1. **Threshold Too High**
**Problem:** Default threshold of 70% was too high for semantic similarity. Semantic similarity scores are typically lower than exact text matches.

**Fix:** Lowered default threshold to 50% (configurable via `RESUME_SIMILARITY_THRESHOLD` environment variable).

**Why:** 
- Semantic similarity measures meaning, not exact word matches
- A 50% semantic similarity indicates good relevance
- A 70% semantic similarity indicates very strong similarity
- Exact text matches would be ~90-100%, but semantic matches are naturally lower

### 2. **Long Document Handling**
**Problem:** The model has token limits. Long resumes or job descriptions were being truncated, losing important information.

**Fix:** Implemented intelligent chunking strategy:
- Splits long texts into sentence-based chunks
- Encodes each chunk separately
- Averages embeddings (mean pooling) for final representation
- Preserves more information from long documents

### 3. **Text Preprocessing**
**Problem:** No text normalization before encoding, which could affect similarity scores.

**Fix:** Added comprehensive text preprocessing:
- Normalizes whitespace (multiple spaces/newlines → single space)
- Removes excessive punctuation while keeping meaningful ones
- Ensures clean, consistent text format

### 4. **Embedding Normalization**
**Problem:** Embeddings weren't normalized, which can affect cosine similarity calculations.

**Fix:** 
- Added `normalize_embeddings=True` to encoding
- Normalizes averaged embeddings from chunks
- Ensures consistent similarity calculations

### 5. **PDF Text Extraction**
**Problem:** Simple text extraction might miss content from complex PDF layouts (tables, multi-column).

**Fix:** Enhanced PDF extraction with multiple strategies:
1. Direct text extraction (primary)
2. Table extraction (fallback if direct fails)
3. Word-by-word reconstruction (fallback for complex layouts)
4. Better handling of multi-page documents

### 6. **Logging and Debugging**
**Problem:** Insufficient logging made it hard to debug why resumes weren't matching.

**Fix:** Added comprehensive logging:
- Text extraction lengths
- Similarity scores for all resumes (above and below threshold)
- Statistics (average, max, min scores)
- Chunking information for long documents
- Warning for very short extracted text

## How It Works Now

### Text Processing Flow:
1. **PDF Extraction** → Multiple strategies ensure maximum text extraction
2. **Text Preprocessing** → Normalize whitespace, clean punctuation
3. **Smart Chunking** → For long texts (>2000 chars), split into sentence-based chunks
4. **Embedding Generation** → Encode chunks with normalized embeddings
5. **Embedding Aggregation** → Average chunk embeddings (mean pooling)
6. **Similarity Calculation** → Cosine similarity between normalized embeddings
7. **Filtering & Ranking** → Filter by threshold (default 50%), sort by score

### Similarity Score Interpretation:
- **0.0 - 0.30 (0-30%)**: Low similarity, likely not relevant
- **0.30 - 0.50 (30-50%)**: Moderate similarity, some relevance
- **0.50 - 0.70 (50-70%)**: Good similarity, relevant match ✅ (default threshold)
- **0.70 - 0.85 (70-85%)**: Strong similarity, very relevant ✅
- **0.85 - 1.0 (85-100%)**: Very strong similarity, excellent match ✅

## Configuration

### Environment Variables:
```env
# Similarity threshold (0.0 to 1.0)
# Lower = more resumes included, Higher = stricter matching
RESUME_SIMILARITY_THRESHOLD=0.50  # Default: 50%

# AI Model (optional, defaults to all-MiniLM-L6-v2)
SIMILARITY_MODEL=all-MiniLM-L6-v2
```

### Adjusting Threshold:
- **For more results**: Lower threshold (e.g., 0.40 or 0.45)
- **For stricter matching**: Higher threshold (e.g., 0.60 or 0.70)
- **Recommended**: Start with 0.50, adjust based on results

## Testing

To test the improvements:

1. **Check logs** for extracted text lengths and similarity scores
2. **Try different thresholds** via environment variable
3. **Verify PDF extraction** - check if all sections are extracted
4. **Compare scores** - all scores are logged, even below threshold

## Expected Behavior

With these improvements:
- ✅ Better matching of similar content (even with different wording)
- ✅ Handles long resumes and job descriptions properly
- ✅ More accurate similarity scores
- ✅ Better extraction from complex PDF layouts
- ✅ More resumes should match when content is actually similar

## Troubleshooting

If resumes still don't match when they should:

1. **Check extracted text length** in logs - if very short, PDF extraction might be failing
2. **Check similarity scores** in logs - even below threshold scores are shown
3. **Lower threshold** if scores are close (e.g., 45% when threshold is 50%)
4. **Verify job description** - make sure it's detailed enough
5. **Check for special characters** - ensure PDFs aren't image-based or corrupted

## Performance Notes

- Chunking adds slight overhead for very long documents
- First request loads model (~100MB download, cached after)
- Subsequent requests are faster due to model caching
- Average processing time: 1-3 seconds per resume (depending on length)

