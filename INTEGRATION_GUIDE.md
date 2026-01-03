# Frontend-Backend Integration Guide

This guide ensures the frontend and backend work together seamlessly.

## Quick Start

### 1. Backend Setup

```bash
cd backend

# Activate virtual environment
# Windows:
myenv\Scripts\activate
# Linux/Mac:
source myenv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set up environment (if not done)
python setup_env.py

# Run migrations
python manage.py migrate

# Start backend server
python manage.py runserver
```

The backend will run on `http://localhost:8000`

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies (if not done)
npm install

# Create .env file (if not exists)
echo "VITE_API_BASE_URL=http://localhost:8000" > .env

# Start frontend server
npm run dev
```

The frontend will run on `http://localhost:5173` (or another port if 5173 is busy)

## API Endpoint

**Endpoint:** `POST /api/filter-resumes`

**Request Format:**
- Content-Type: `multipart/form-data`
- Fields:
  - `resumes`: Multiple PDF files (can append multiple files with same field name)
  - `job_description`: String containing job description

**Response Format:**
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
    }
  ]
}
```

**Error Response Format:**
```json
{
  "error": "Error message here",
  "message": "Error message here"
}
```

## Compatibility Features

### ✅ CSRF Protection
- API endpoint is exempt from CSRF (using `@csrf_exempt` decorator)
- This allows frontend to make POST requests without CSRF tokens

### ✅ CORS Configuration
- Backend allows requests from:
  - `http://localhost:5173` (Vite default)
  - `http://localhost:3000` (React default)
  - `http://127.0.0.1:5173`
  - `http://127.0.0.1:3000`
- Configure additional origins in backend `.env` file:
  ```
  CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000,http://your-domain.com
  ```

### ✅ Error Handling
- Backend returns errors in format: `{"error": "...", "message": "..."}`
- Frontend handles both `error` and `message` fields
- All errors are properly logged on both sides

### ✅ File Upload
- Maximum file size: 10MB per file
- Only PDF files accepted
- Multiple files can be uploaded in one request

## Testing the Integration

### Manual Test

1. **Start Backend:**
   ```bash
   cd backend
   python manage.py runserver
   ```

2. **Start Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Test Flow:**
   - Open browser to `http://localhost:5173`
   - Upload one or more PDF resume files
   - Click "Add Job Description"
   - Enter a job description
   - Click "Filter"
   - Wait for results (may take 30-60 seconds on first run as AI model loads)

### Using curl (Backend Only)

```bash
curl -X POST http://localhost:8000/api/filter-resumes \
  -F "resumes=@path/to/resume1.pdf" \
  -F "resumes=@path/to/resume2.pdf" \
  -F "job_description=Looking for a Python developer with Django experience"
```

## Troubleshooting

### CORS Errors

**Error:** `Access to fetch at 'http://localhost:8000/api/filter-resumes' from origin 'http://localhost:5173' has been blocked by CORS policy`

**Solution:**
1. Check backend `.env` file includes your frontend URL
2. Restart backend server after changing CORS settings
3. Verify `corsheaders` is in `INSTALLED_APPS` and middleware

### CSRF Errors

**Error:** `CSRF verification failed`

**Solution:**
- Should not occur as API endpoint is CSRF-exempt
- If it does, check that `@method_decorator(csrf_exempt, name='dispatch')` is on the view

### Connection Refused

**Error:** `Failed to fetch` or `Network error`

**Solution:**
1. Verify backend is running on port 8000
2. Check frontend `.env` has correct `VITE_API_BASE_URL`
3. Restart frontend dev server after changing `.env`

### Model Loading Issues

**First Request Takes Long Time:**
- This is normal - the AI model downloads on first use (~100MB)
- Subsequent requests will be faster
- Model is cached after first load

### No Results Returned

**Possible Causes:**
1. All resumes below 70% similarity threshold
2. PDF extraction failed (check backend logs)
3. Job description too short or generic

**Solution:**
- Check backend logs in `backend/logs/django.log`
- Try with more specific job descriptions
- Verify PDFs are not corrupted or password-protected

## Environment Variables

### Backend (.env)
```env
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
RESUME_SIMILARITY_THRESHOLD=0.70
```

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:8000
```

## Production Deployment

### Backend
1. Set `DEBUG=False` in `.env`
2. Set proper `ALLOWED_HOSTS`
3. Configure production CORS origins
4. Use Gunicorn or similar WSGI server
5. Set up proper database (PostgreSQL recommended)

### Frontend
1. Build for production: `npm run build`
2. Serve static files (or use CDN)
3. Update `VITE_API_BASE_URL` to production backend URL
4. Configure CORS on backend to allow frontend domain

## API Response Display

The frontend now displays results in a user-friendly format:
- Summary statistics (Total, Processed, Matched)
- List of matched resumes with similarity scores
- Collapsible raw JSON for debugging

## Support

For issues:
1. Check backend logs: `backend/logs/django.log`
2. Check browser console for frontend errors
3. Verify both servers are running
4. Check network tab in browser dev tools




