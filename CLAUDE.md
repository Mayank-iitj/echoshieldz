# EchoShield v2 - Real-Time AI Scam Call Detector

AI-powered scam call detection for Indian mobile users.

## Project Structure

```
echoshield/
├── backend/           # FastAPI backend
│   ├── app/
│   │   ├── api/v1/   # REST + WebSocket endpoints
│   │   ├── ml/       # ASR, ScamBERT, Voice Stress, Deepfake, RAG, Risk Scorer
│   │   ├── db/       # PostgreSQL + Redis
│   │   └── core/     # Config, logging
│   ├── training/     # Dataset prep, fine-tuning, ONNX export
│   └── Dockerfile
│
├── frontend/         # Next.js 14 + Tailwind + Recharts
│   └── src/
│
└── monitoring/       # Prometheus config
```

## Running Locally

### Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn app.main:app --reload
```

Backend runs on http://localhost:8000

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend runs on http://localhost:3000

## Docker Deployment

```bash
cd backend

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f backend
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/calls/analyze` | POST | Analyze audio segment |
| `/api/v1/calls/reputation/{phone}` | GET | Get caller reputation |
| `/api/v1/calls/feedback` | POST | Submit feedback |
| `/api/v1/ws/call/{call_id}` | WS | Real-time streaming |
| `/health` | GET | Health check |

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://echo:echo@localhost:5432/echoshield
REDIS_URL=redis://localhost:6379
ASR_MODEL_ID=openai/whisper-large-v3
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000
```

## Tech Stack

- **Backend:** FastAPI, Python 3.11, PostgreSQL, Redis
- **ML:** Transformers, Whisper, DistilBERT, LangChain
- **Frontend:** Next.js 14, React, Tailwind CSS, Recharts
- **Container:** Docker, Docker Compose