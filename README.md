# Financial Analytics Intelligence Platform

An end-to-end demo platform built to match the provided UI and functionality. Tech stack:

- Backend: FastAPI • Python • MongoDB
- Analytics: Pandas • NumPy • Scikit-learn
- Frontend: React (Vite) • Recharts • Tailwind CSS

Features:
- CSV upload and ingestion into MongoDB
- KPI endpoints for dashboard (transaction counts, data quality, detection metrics)
- Anomaly detection using IsolationForest (train + predict)
- Interactive dashboard with charts and KPI cards

Prerequisites:
- Python 3.10+
- Node 18+
- MongoDB (local or Atlas)
- Optional: Docker

Quick start (local):

1. Backend
   - cd backend
   - cp .env.example .env and edit MONGO_URI
   - python -m venv .venv && source .venv/bin/activate
   - pip install -r requirements.txt
   - uvicorn main:app --reload --port 8000

2. Frontend
   - cd frontend
   - npm install
   - npm run dev

3. Open: http://localhost:5173 (frontend) and backend at http://localhost:8000

API overview:
- POST /api/data/upload (multipart/form-data) -> upload CSV of transactions
- GET /api/data/transactions -> list transactions (pagination & filters)
- GET /api/data/stats -> summary KPIs
- POST /api/model/train -> retrain model from DB
- GET /api/model/anomalies -> list anomalies (uses trained model)

Sample dataset included in backend/sample_data/transactions_sample.csv

Notes:
- The IsolationForest model is used as an example fraud/anomaly detector. In production you'd use domain features and careful validation.
- Remove or change branding and text as needed for compliance.
