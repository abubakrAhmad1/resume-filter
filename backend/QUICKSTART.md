# Quick Start Guide

## Initial Setup

1. **Activate virtual environment:**
   ```bash
   # Windows
   myenv\Scripts\activate
   
   # Linux/Mac
   source myenv/bin/activate
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment file:**
   ```bash
   python setup_env.py
   ```
   Or manually create `.env` file with the following:
   ```
   SECRET_KEY=your-secret-key-here
   DEBUG=True
   ALLOWED_HOSTS=localhost,127.0.0.1
   CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
   RESUME_SIMILARITY_THRESHOLD=0.70
   ```

4. **Run migrations:**
   ```bash
   python manage.py migrate
   ```

5. **Test the similarity service (optional):**
   ```bash
   python manage.py test_similarity
   ```

6. **Start the server:**
   ```bash
   python manage.py runserver
   ```

The API will be available at `http://localhost:8000`

## Testing the API

### Using curl:

```bash
curl -X POST http://localhost:8000/api/filter-resumes \
  -F "resumes=@path/to/resume1.pdf" \
  -F "resumes=@path/to/resume2.pdf" \
  -F "job_description=Looking for a Python developer with Django experience"
```

### Using Python requests:

```python
import requests

url = "http://localhost:8000/api/filter-resumes"
files = [
    ('resumes', open('resume1.pdf', 'rb')),
    ('resumes', open('resume2.pdf', 'rb')),
]
data = {
    'job_description': 'Looking for a Python developer with Django experience'
}

response = requests.post(url, files=files, data=data)
print(response.json())
```

## Expected Response

```json
{
  "total_resumes": 2,
  "processed_resumes": 2,
  "filtered_resumes": 1,
  "threshold": 70.0,
  "resumes": [
    {
      "filename": "resume1.pdf",
      "similarity_score": 85.42
    }
  ]
}
```

## Troubleshooting

### Model Download
On first run, the AI model will be downloaded (~100MB). This may take a few minutes depending on your internet connection.

### Port Already in Use
If port 8000 is in use, specify a different port:
```bash
python manage.py runserver 8001
```

### CORS Errors
Make sure your frontend URL is included in `CORS_ALLOWED_ORIGINS` in `.env`

