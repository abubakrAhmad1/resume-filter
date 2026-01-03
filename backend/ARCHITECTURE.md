# Architecture Overview

## System Design

The Resume Filter API is built using Django REST Framework and follows a service-oriented architecture pattern.

## Components

### 1. API Layer (`resume_filter/views.py`)
- **FilterResumesView**: Main API endpoint
  - Handles HTTP requests
  - Validates input (files, job description)
  - Orchestrates the filtering process
  - Returns JSON responses

### 2. Service Layer (`resume_filter/services/`)

#### PDF Extractor (`pdf_extractor.py`)
- Extracts text from PDF files
- Uses pdfplumber as primary method
- Falls back to PyPDF2 if needed
- Validates PDF file format

#### Similarity Service (`similarity_service.py`)
- Loads and manages AI model (sentence transformers)
- Calculates semantic similarity between resumes and job descriptions
- Ranks resumes by relevance
- Filters by similarity threshold (default: 70%)

### 3. Data Flow

```
Frontend Request
    ↓
FilterResumesView (API View)
    ↓
PDF Extractor → Extract text from PDFs
    ↓
Similarity Service → Calculate similarity scores
    ↓
Rank and Filter (threshold: 70%)
    ↓
JSON Response → Frontend
```

## AI Model

- **Model**: `all-MiniLM-L6-v2` (default)
- **Type**: Sentence Transformer
- **Purpose**: Semantic similarity calculation
- **Method**: Cosine similarity on embeddings
- **Performance**: Fast, efficient, good accuracy

## Key Features

1. **Robust PDF Processing**: Multiple extraction methods with fallback
2. **Model Caching**: AI model loaded once and reused
3. **Error Handling**: Comprehensive error handling at all levels
4. **Logging**: Detailed logging for debugging and monitoring
5. **Validation**: Input validation before processing
6. **Scalability**: Service-oriented design allows easy extension

## Security Considerations

- File size limits (10MB per file)
- File type validation (PDF only)
- CORS configuration
- Input sanitization
- Error message sanitization (no sensitive data exposure)

## Performance Optimizations

- Model caching (loaded once, reused)
- Efficient PDF processing
- Batch processing of multiple resumes
- Async-ready architecture (can be extended)

## Extension Points

1. **Database Persistence**: Add models to store processing history
2. **Caching**: Add Redis for response caching
3. **Async Processing**: Use Celery for long-running tasks
4. **Multiple Models**: Support for different AI models
5. **Custom Thresholds**: Per-request threshold configuration
6. **Export Formats**: Add support for exporting results


