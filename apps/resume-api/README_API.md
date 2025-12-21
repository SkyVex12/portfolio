# Resume Builder API (FastAPI wrapper)

Run the service:
```bash
pip install -r requirements_server.txt
export OPENAI_API_KEY="YOUR_KEY"
uvicorn server:app --host 0.0.0.0 --port 8000
```

Endpoints:
- GET /health
- POST /trial
  Body:
  ```json
  { "job_description": "...", "tone": "Senior, confident, concise", "person": "Timothy" }
  ```
