# Resume Filter Backend API

A production-ready Django REST API for filtering resumes based on job descriptions using AI-powered semantic similarity matching.

## Features

- **PDF Text Extraction**: Robust PDF parsing using multiple libraries (pdfplumber, PyPDF2)
- **AI-Powered Matching**: Semantic similarity comparison using sentence transformers
- **Intelligent Filtering**: Returns only resumes with similarity scores ≥ 70% (configurable)
- **RESTful API**: Clean, well-documented REST endpoints
- **Production Ready**: Includes logging, error handling, CORS, and security best practices
- **Comprehensive Testing**: Unit tests for core functionality

## Tech Stack

- **Django 5.2.8**: Web framework
- **Django REST Framework**: REST API framework
- **sentence-transformers**: AI/ML for semantic similarity
- **pdfplumber & PyPDF2**: PDF text extraction
- **django-cors-headers**: CORS support for frontend integration

## Installation

### Prerequisites

- Python 3.8 or higher
- pip

### Setup

1. **Clone the repository and navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create and activate virtual environment:**
   ```bash
   python -m venv myenv
   # On Windows
   myenv\Scripts\activate
   # On Linux/Mac
   source myenv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Create environment file:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and update the settings as needed.

5. **Run migrations:**
   ```bash
   python manage.py migrate
   ```

6. **Create superuser (optional, for admin access):**
   ```bash
   python manage.py createsuperuser
   ```

7. **Run development server:**
   ```bash
   python manage.py runserver
   ```

The API will be available at `http://localhost:8000`

## API Endpoints

### Filter Resumes

**Endpoint:** `POST /api/filter-resumes`

**Description:** Filters and ranks resumes based on job description similarity.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body:
  - `resumes`: Multiple PDF files (field name: `resumes`)
  - `job_description`: Job description text (string)

**Response:**
```json
{
  "total_resumes": 5,
  "processed_resumes": 5,
  "filtered_resumes": 3,
  "threshold": 70.0,
  "resumes": [
    {
      "filename": "resume1.pdf",
      "similarity_score": 85.42
    },
    {
      "filename": "resume2.pdf",
      "similarity_score": 78.91
    },
    {
      "filename": "resume3.pdf",
      "similarity_score": 72.35
    }
  ]
}
```

**Error Responses:**

- `400 Bad Request`: Missing files or job description, invalid file types, or file size exceeded
- `500 Internal Server Error`: Server-side processing errors

**Example using curl:**
```bash
curl -X POST http://localhost:8000/api/filter-resumes \
  -F "resumes=@resume1.pdf" \
  -F "resumes=@resume2.pdf" \
  -F "job_description=Looking for a Python developer with Django experience"
```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `SECRET_KEY` | Django secret key | (auto-generated) |
| `DEBUG` | Debug mode | `True` |
| `ALLOWED_HOSTS` | Allowed hostnames | `localhost,127.0.0.1` |
| `CORS_ALLOWED_ORIGINS` | CORS allowed origins | `http://localhost:5173,...` |
| `RESUME_SIMILARITY_THRESHOLD` | Minimum similarity (0-1) | `0.70` |
| `SIMILARITY_MODEL` | Sentence transformer model | `all-MiniLM-L6-v2` |

### Settings

- **File Upload Limit**: 10MB per file
- **Similarity Threshold**: 70% (configurable via environment variable)
- **AI Model**: Uses `all-MiniLM-L6-v2` by default (fast and efficient)

## Project Structure

```
backend/
├── backend/              # Django project settings
│   ├── settings.py      # Main settings file
│   ├── urls.py          # URL routing
│   └── wsgi.py          # WSGI configuration
├── resume_filter/       # Main application
│   ├── services/        # Business logic
│   │   ├── pdf_extractor.py      # PDF text extraction
│   │   └── similarity_service.py # AI similarity matching
│   ├── views.py         # API views
│   ├── urls.py          # App URL routing
│   └── tests.py         # Unit tests
├── manage.py            # Django management script
├── requirements.txt     # Python dependencies
└── README.md            # This file
```

## Testing

Run tests using pytest:

```bash
pytest
```

Or using Django's test runner:

```bash
python manage.py test
```

## Production Deployment

### Using Gunicorn

1. **Install gunicorn** (already in requirements.txt):
   ```bash
   pip install gunicorn
   ```

2. **Run with gunicorn:**
   ```bash
   gunicorn backend.wsgi:application --bind 0.0.0.0:8000
   ```

### Environment Setup

1. Set `DEBUG=False` in `.env`
2. Set a strong `SECRET_KEY`
3. Configure `ALLOWED_HOSTS` with your domain
4. Set up proper CORS origins
5. Configure static file serving (WhiteNoise is included)
6. Set up proper database (PostgreSQL recommended for production)

### Security Checklist

- [ ] Change `SECRET_KEY`
- [ ] Set `DEBUG=False`
- [ ] Configure `ALLOWED_HOSTS`
- [ ] Set up HTTPS/SSL
- [ ] Configure proper CORS origins
- [ ] Set up database backups
- [ ] Configure logging
- [ ] Set up monitoring

## How It Works

1. **PDF Upload**: API receives multiple PDF files via multipart form data
2. **Text Extraction**: Each PDF is processed to extract text content using pdfplumber (with PyPDF2 fallback)
3. **AI Comparison**: Extracted resume text is compared with job description using sentence transformers
4. **Similarity Calculation**: Cosine similarity is calculated between resume and job description embeddings
5. **Filtering**: Only resumes with similarity ≥ threshold (default 70%) are returned
6. **Ranking**: Results are sorted by similarity score (highest first)

## Troubleshooting

### Model Download Issues

The sentence transformer model will be downloaded automatically on first use. If you encounter issues:

1. Check internet connection
2. Ensure sufficient disk space (~100MB for model)
3. Model is cached in `~/.cache/huggingface/`

### PDF Extraction Failures

If PDF extraction fails:
- Ensure PDFs are not password-protected
- Check if PDFs are corrupted
- Try with different PDF files

### Memory Issues

For large batches of resumes:
- Process in smaller batches
- Consider using a more powerful server
- The model loads into memory on first use

## License

This project is part of a university graduate portfolio project.

## Author

University Graduate Portfolio Project




