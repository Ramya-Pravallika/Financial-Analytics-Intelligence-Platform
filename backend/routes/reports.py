# routes/reports.py
from fastapi import APIRouter, HTTPException, Body
from fastapi.responses import StreamingResponse, JSONResponse
from ..db import db
import pandas as pd
import io, datetime
from typing import Optional

router = APIRouter(prefix="/api/reports", tags=["reports"])

@router.post("/generate")
async def generate_report(payload: dict = Body(...)):
    """
    payload example:
    {
      "report_type": "Monthly Report",
      "start": "2026-01-01T00:00:00",
      "end": "2026-01-31T23:59:59"
    }
    If start/end not provided, defaults to last 30 days.
    """
    report_type = payload.get("report_type", "Custom Report")
    start = payload.get("start")
    end = payload.get("end")
    if not start or not end:
        end_dt = datetime.datetime.utcnow()
        start_dt = end_dt - datetime.timedelta(days=30)
    else:
        start_dt = pd.to_datetime(start)
        end_dt = pd.to_datetime(end)

    # query transactions
    query = {}
    if start_dt is not None and end_dt is not None:
        query['timestamp'] = {"$exists": True}
    cursor = db.transactions.find(query)
    records = []
    async for doc in cursor:
        records.append(doc)
    if not records:
        df = pd.DataFrame(columns=["transaction_id","timestamp","amount","merchant","category","location","account_id"])
    else:
        df = pd.DataFrame(records)

    # ensure timestamp typed
    if 'timestamp' in df.columns:
        df['timestamp'] = pd.to_datetime(df['timestamp'], errors='coerce')

    # filter by date range
    if not df.empty and 'timestamp' in df.columns:
        df = df[(df['timestamp'] >= start_dt) & (df['timestamp'] <= end_dt)]

    # compute summary
    total = int(len(df))
    amount = float(df['amount'].sum()) if 'amount' in df.columns else 0.0

    # create CSV
    csv_buf = io.StringIO()
    df.to_csv(csv_buf, index=False)
    csv_content = csv_buf.getvalue()

    report_doc = {
        "report_type": report_type,
        "generated_at": datetime.datetime.utcnow().isoformat(),
        "transactions": total,
        "amount": round(amount,2),
        "start": start_dt.isoformat() if hasattr(start_dt,'isoformat') else str(start_dt),
        "end": end_dt.isoformat() if hasattr(end_dt,'isoformat') else str(end_dt),
        "csv": csv_content
    }
    res = await db.reports.insert_one(report_doc)
    return {"report_id": str(res.inserted_id), "transactions": total, "amount": amount}

@router.get("/list")
async def list_reports():
    cursor = db.reports.find({}).sort([("generated_at",-1)])
    items = []
    async for doc in cursor:
        doc["id"] = str(doc.pop("_id"))
        # remove csv content to keep response small
        doc.pop("csv", None)
        items.append(doc)
    return {"items": items}

@router.get("/download")
async def download_report(report_id: str):
    doc = await db.reports.find_one({"_id": {"$oid": report_id}})
    # Some drivers/clients can't search by $oid like above; fall back
    if not doc:
        # try by string _id
        from bson import ObjectId
        try:
            doc = await db.reports.find_one({"_id": ObjectId(report_id)})
        except Exception:
            doc = None
    if not doc:
        raise HTTPException(status_code=404, detail="Report not found")
    csv = doc.get("csv", "")
    return StreamingResponse(io.StringIO(csv), media_type="text/csv", headers={"Content-Disposition": f"attachment; filename=report_{report_id}.csv"})
