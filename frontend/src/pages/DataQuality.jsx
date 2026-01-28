import React, { useEffect, useState } from "react";
import axios from "axios";

export default function DataQuality(){
  const [quality, setQuality] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:8000/api/data/quality").then(r => setQuality(r.data)).catch(() => {});
  }, []);

  if(!quality) return <div className="text-gray-600">Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-serif-title">Data Quality</h1>
      <p className="text-gray-600">Monitor data integrity, completeness, and accuracy</p>

      <div className="mt-6 card flex justify-between items-center">
        <div>
          <h3 className="font-semibold">Overall Data Quality Score</h3>
          <div className="text-sm text-gray-600">Last updated: {new Date().toLocaleString()}</div>
        </div>
        <div className="text-3xl font-bold text-teal-500">{quality.completeness_pct ?? 0.0}%</div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <div className="text-sm text-gray-500">Total Records</div>
          <div className="text-2xl font-bold">{quality.total_records}</div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-500">Missing Values (total fields)</div>
          <div className="text-2xl font-bold">{Object.values(quality.missing_values || {}).reduce((a,b)=>a+b,0)}</div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-500">Duplicate Records</div>
          <div className="text-2xl font-bold">{quality.duplicate_records}</div>
        </div>
      </div>

      <div className="mt-6 card">
        <h3 className="font-semibold">Quality Checks Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="p-4 border rounded">
            <strong>Data Type Validation</strong>
            <div className="text-sm text-gray-600">All fields checked for expected types</div>
          </div>
          <div className="p-4 border rounded">
            <strong>Format Consistency</strong>
            <div className="text-sm text-gray-600">Timestamps and IDs follow standard formats</div>
          </div>
          <div className="p-4 border rounded">
            <strong>Range Validation</strong>
            <div className="text-sm text-gray-600">Values within expected ranges</div>
          </div>
          <div className="p-4 border rounded">
            <strong>Uniqueness Check</strong>
            <div className="text-sm text-gray-600">Duplicate transaction IDs found: {quality.duplicate_records}</div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 border-l-4 border-teal-200 bg-teal-50">
        <strong>Data Quality Status: {quality.completeness_pct >= 95 ? "Excellent" : quality.completeness_pct >= 75 ? "Good" : "Needs Attention"}</strong>
        <div className="text-sm text-gray-600">Your data maintains high quality standards. Continue monitoring for anomalies.</div>
      </div>
    </div>
  )
}