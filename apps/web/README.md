# Goran — Fashionable Portfolio (Next.js + Tailwind + Real AI Chat)

This is a complete, deployable portfolio with a **real OpenAI-powered AI chat section**.

## 1) Setup
```bash
npm install
cp .env.example .env.local
# add your OPENAI_API_KEY to .env.local
npm run dev
```

Open http://localhost:3000

## 2) Customize
Edit:
- `lib/data.ts` (email, socials, projects, services, stack)
- `components/sections/*` for layout/text

## 3) Deploy (Vercel)
- Push to GitHub
- Import into Vercel
- Set environment variables:
  - `OPENAI_API_KEY`
  - optional: `OPENAI_MODEL`

## Notes
- The contact form uses `mailto:` by default (simple and reliable).
- The AI chat route is in `app/api/chat/route.ts`.


## Resume Builder Trial + Paid Unlock
- Users can generate **1 resume for free** (browser cookie enforcement).
- Clicking **Unlock more resumes** starts a Stripe Checkout session (optional).

### Configure Stripe (optional)
Add to `.env.local`:
- `NEXT_PUBLIC_BASE_URL`
- `STRIPE_SECRET_KEY`
- `STRIPE_PRICE_ID`

## Using your Python resume-builder backend (recommended)
Run your Python service and set:
- `RESUME_BUILDER_BACKEND_URL="http://localhost:8000"`

The site will proxy the trial generation to `POST /trial`.
