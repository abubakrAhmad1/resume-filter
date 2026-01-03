# Setup Checklist

Use this checklist to ensure frontend and backend are properly configured to work together.

## Backend Setup ✅

- [ ] Virtual environment activated
- [ ] Dependencies installed (`pip install -r requirements.txt`)
- [ ] `.env` file created (run `python setup_env.py` or create manually)
- [ ] Database migrations run (`python manage.py migrate`)
- [ ] Backend server running on `http://localhost:8000`
- [ ] CORS configured to allow frontend origin
- [ ] Logs directory exists (`backend/logs/`)

## Frontend Setup ✅

- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file created with `VITE_API_BASE_URL=http://localhost:8000`
- [ ] Frontend server running (usually `http://localhost:5173`)
- [ ] Browser console shows no errors

## Integration Test ✅

- [ ] Can upload PDF files in frontend
- [ ] Can enter job description
- [ ] Clicking "Filter" sends request to backend
- [ ] Backend processes request (check backend console/logs)
- [ ] Results displayed in frontend
- [ ] No CORS errors in browser console
- [ ] No network errors

## Common Issues & Fixes

### Backend won't start
- Check if port 8000 is already in use
- Verify virtual environment is activated
- Check for missing dependencies

### Frontend can't connect to backend
- Verify backend is running
- Check `VITE_API_BASE_URL` in frontend `.env`
- Restart frontend after changing `.env`

### CORS errors
- Add frontend URL to `CORS_ALLOWED_ORIGINS` in backend `.env`
- Restart backend after changing CORS settings
- Check browser console for exact error

### No results returned
- Check backend logs for errors
- Verify PDFs are valid and not corrupted
- Try with a more specific job description
- Check similarity threshold (default 70%)

## Quick Test Command

Test backend API directly:
```bash
curl -X POST http://localhost:8000/api/filter-resumes \
  -F "resumes=@test-resume.pdf" \
  -F "job_description=Test job description"
```

If this works, the backend is configured correctly.

