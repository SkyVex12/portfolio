# Goran Portfolio Monorepo (Next.js + Python Resume Builder)

This repository contains **one project** with two apps:

- `apps/web` — Next.js portfolio (AI chat + Resume Builder trial UI)
- `apps/resume-api` — your Python resume builder exposed as a FastAPI service

## Quick start (local)

### 1) Set environment variables
Create these files:

**apps/web/.env.local**
```bash
OPENAI_API_KEY="YOUR_KEY"
RESUME_BUILDER_BACKEND_URL="http://localhost:8000"
# Optional:
# OPENAI_MODEL="gpt-4.1-mini"
```

**apps/resume-api/.env**
```bash
OPENAI_API_KEY="YOUR_KEY"
```

> The portfolio will call the Python API at `POST /trial`.

### 2) Install + run
From repo root:
```bash
npm install
npm run dev
```

- Web: http://localhost:3000
- API: http://localhost:8000/health

## Run API dependencies
In another terminal (or before `npm run dev`), ensure your Python deps are installed:
```bash
cd apps/resume-api
pip install -r requirements_server.txt
```

## Docker (single deploy)
```bash
docker compose up -d --build
```

## Notes
- Trial gating is cookie-based (1 free resume). Add Stripe webhook + DB credits for production paywall.
