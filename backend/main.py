# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import data, reports
import uvicorn

app = FastAPI(title="Financial Analytics Intelligence Platform")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(data.router)
app.include_router(reports.router)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)