# Deploying CrushLoad to Google Cloud Run

CrushLoad is a single Node container: an Express server that serves the built
Vite client and proxies two budget-guarded Gemini endpoints. It has no database
and no background work, so it runs perfectly on Cloud Run with **scale-to-zero**
— you pay nothing while no one is playing.

## Prerequisites

- A Google Cloud project with billing enabled
- `gcloud` CLI installed and authenticated (`gcloud auth login`)
- The Generative Language (Gemini) API enabled, and an API key

## 1. Store the Gemini key as a secret

```bash
echo -n "YOUR_GEMINI_API_KEY" | gcloud secrets create gemini-api-key --data-file=-
```

## 2. Deploy

From the repo root (the `Dockerfile` is detected automatically):

```bash
gcloud run deploy crushload \
  --source . \
  --region me-west1 \
  --allow-unauthenticated \
  --min-instances 0 \
  --max-instances 3 \
  --memory 512Mi \
  --concurrency 80 \
  --set-secrets GEMINI_API_KEY=gemini-api-key:latest \
  --set-env-vars AI_RATE_LIMIT_PER_MINUTE=8,AI_DAILY_CALL_CAP=150
```

Notes:
- `--min-instances 0` is the key cost setting: the service idles at **zero
  instances / zero cost** and cold-starts (~1s) on the next request.
- Cloud Run injects `PORT` (8080); the server already reads it.
- `--source .` builds with the included multi-stage `Dockerfile`.

## 3. Cost guardrails (stay under ~40 ILS / month)

Compute is effectively free at low traffic (Cloud Run's free tier covers it),
so the only real variable is Gemini tokens. Three layers, most important first:

1. **Hard quota at the source.** In the Cloud console, set a per-day quota on
   the Generative Language API and a **billing budget alert** (e.g. 30 ILS).
   This is enforced by Google regardless of app behaviour.
2. **In-app caps.** `AI_DAILY_CALL_CAP` is the global daily ceiling and
   `AI_RATE_LIMIT_PER_MINUTE` is per client. Start conservative (150/day) and
   raise only when usage data justifies it. Always use a Flash-tier model.
3. **Built-in fallbacks.** Both AI endpoints already return in-character static
   responses when throttled or keyless, so gameplay never breaks at the cap.

## 4. Scale spend only with revenue

`aiCallAllowed()` reads `AI_DAILY_CALL_CAP` from the environment, so raising the
budget is a one-line env update. When Stripe revenue is wired up, derive the cap
from `min(free_floor, 0.20 × MRR)` and update the env var (or a small config doc)
as subscribers grow — with the Google-side quota as the ceiling that cannot be
exceeded even by mistake.

## Local container test

```bash
docker build -t crushload .
docker run --rm -p 8080:8080 -e GEMINI_API_KEY=... crushload
# open http://localhost:8080
```
