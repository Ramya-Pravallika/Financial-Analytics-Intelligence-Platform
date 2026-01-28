# Financial Analytics Intelligence Platform
Preview of main page: 
<img width="1897" height="795" alt="image" src="https://github.com/user-attachments/assets/d9b90366-d54f-406d-9811-ac9230696252" /> <img width="1905" height="791" alt="image" src="https://github.com/user-attachments/assets/05b4bc7f-0d71-49e9-8fc2-8d058acc2261" /> <img width="1900" height="788" alt="image" src="https://github.com/user-attachments/assets/28b09e72-524c-489f-8780-cbff8cfe2e5c" />

Preview of Dashboard:
<img width="1911" height="734" alt="image" src="https://github.com/user-attachments/assets/b9a7a23d-7e69-48f6-8204-f90f4c852e8c" /> <img width="1915" height="790" alt="image" src="https://github.com/user-attachments/assets/13f57e9f-fb10-416c-a4ef-1a9d6733acc9" /> <img width="1913" height="776" alt="image" src="https://github.com/user-attachments/assets/945ebc8d-87dc-43ef-b333-ed48c659c366" /> <img width="1918" height="812" alt="image" src="https://github.com/user-attachments/assets/4cfb5b2f-1d96-4167-912c-ad350c9d865b" /> <img width="1910" height="795" alt="image" src="https://github.com/user-attachments/assets/5008253f-2428-4b03-aa90-8eabd3d4dbac" /> <img width="1907" height="793" alt="image" src="https://github.com/user-attachments/assets/6d19f8df-d639-4dab-8ae4-a7e786422bf7" /> <img width="1908" height="803" alt="image" src="https://github.com/user-attachments/assets/e45a4641-c3a6-4324-9344-a4efa3521658" />

An end-to-end platform built to match the provided UI and functionality. Tech stack:

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
