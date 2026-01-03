# How to View Logging Information

## Log Locations

The Django backend logs information in **two places**:

### 1. **Console/Terminal Output** (Real-time)
When you run the Django server, logs appear directly in your terminal/console.

**To see logs:**
```bash
cd backend
python manage.py runserver
```

You'll see logs like:
```
INFO resume_filter.views Processing 3 resumes for filtering
INFO resume_filter.services.similarity_service Ranking 3 resumes against job description (threshold: 10.0%)
INFO resume_filter.services.pdf_extractor Extracted 1523 characters from resume1.pdf
✓ Resume resume1.pdf: 65.42% similarity (ABOVE threshold)
✗ Resume resume2.pdf: 35.21% similarity (below threshold)
INFO resume_filter.services.similarity_service Similarity statistics - Avg: 45.32%, Max: 65.42%, Min: 25.11%, Threshold: 10.0%
```

### 2. **Log File** (Persistent)
All logs are also saved to a file for later review.

**Location:** `backend/logs/django.log`

**To view the log file:**

**Windows (PowerShell):**
```powershell
cd backend
Get-Content logs\django.log -Tail 50
```

**Windows (Command Prompt):**
```cmd
cd backend
type logs\django.log
```

**Linux/Mac:**
```bash
cd backend
tail -f logs/django.log  # Real-time (follow mode)
# OR
tail -n 100 logs/django.log  # Last 100 lines
# OR
cat logs/django.log  # Full file
```

## What Information is Logged

### During Resume Processing:

1. **PDF Extraction:**
   - `INFO resume_filter.views Extracted X characters from filename.pdf`
   - Warnings if text is very short

2. **Similarity Calculation:**
   - `DEBUG resume_filter.services.similarity_service Resume text length: X chars`
   - `DEBUG resume_filter.services.similarity_service Job description length: X chars`
   - `DEBUG resume_filter.services.similarity_service Calculated similarity: X.XXXX (XX.XX%)`

3. **Ranking Results:**
   - `✓ Resume filename.pdf: XX.XX% similarity (ABOVE threshold)`
   - `✗ Resume filename.pdf: XX.XX% similarity (below threshold)`

4. **Statistics:**
   - `INFO resume_filter.services.similarity_service Similarity statistics - Avg: XX.XX%, Max: XX.XX%, Min: XX.XX%, Threshold: XX.X%`
   - `INFO resume_filter.services.similarity_service Found X/Y resumes above XX.X% threshold`

## Log Levels

- **DEBUG**: Detailed information (text lengths, similarity calculations)
- **INFO**: General information (processing steps, results)
- **WARNING**: Potential issues (short text, extraction problems)
- **ERROR**: Errors that occurred

## Viewing Logs in Real-Time

### Option 1: Watch Console Output
Just run the server and watch the terminal:
```bash
python manage.py runserver
```

### Option 2: Tail Log File (Linux/Mac)
```bash
tail -f backend/logs/django.log
```

### Option 3: Use a Text Editor
Open `backend/logs/django.log` in any text editor to view all logs.

## Filtering Logs

### View Only Resume Filter Logs:
**Linux/Mac:**
```bash
grep "resume_filter" backend/logs/django.log
```

**Windows (PowerShell):**
```powershell
Select-String -Path "backend\logs\django.log" -Pattern "resume_filter"
```

### View Only Similarity Scores:
**Linux/Mac:**
```bash
grep "similarity" backend/logs/django.log
```

**Windows (PowerShell):**
```powershell
Select-String -Path "backend\logs\django.log" -Pattern "similarity"
```

## Troubleshooting

### If logs directory doesn't exist:
The logs directory is created automatically, but if it's missing:
```bash
mkdir backend/logs
```

### If log file is empty:
- Make sure the server is running
- Check that you've made API requests
- Verify logging configuration in `settings.py`

### To see more detailed logs:
The `resume_filter` logger is already set to `DEBUG` level, so you should see all details. If you want even more Django logs, set:
```env
DJANGO_LOG_LEVEL=DEBUG
```

## Quick Reference

**Most Important Logs to Check:**
1. Extracted text lengths - verify PDF extraction worked
2. Similarity scores - see why resumes matched or didn't
3. Statistics - understand overall matching performance
4. Errors - identify any problems

**Example Log Output:**
```
INFO resume_filter.views Processing 2 resumes for filtering
INFO resume_filter.views Extracted 1845 characters from john_doe_resume.pdf
INFO resume_filter.views Extracted 2103 characters from jane_smith_resume.pdf
INFO resume_filter.services.similarity_service Ranking 2 resumes against job description (threshold: 10.0%)
DEBUG resume_filter.services.similarity_service Resume text length: 1845 chars
DEBUG resume_filter.services.similarity_service Job description length: 523 chars
DEBUG resume_filter.services.similarity_service Calculated similarity: 0.6542 (65.42%)
✓ Resume john_doe_resume.pdf: 65.42% similarity (ABOVE threshold)
✗ Resume jane_smith_resume.pdf: 32.15% similarity (below threshold)
INFO resume_filter.services.similarity_service Similarity statistics - Avg: 48.79%, Max: 65.42%, Min: 32.15%, Threshold: 10.0%
INFO resume_filter.services.similarity_service Found 1/2 resumes above 10.0% threshold
```




