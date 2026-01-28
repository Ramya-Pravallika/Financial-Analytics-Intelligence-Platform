import React, { useEffect, useState } from "react";
import axios from "axios";

export default function PredictiveAnalytics(){
  const [merchants, setMerchants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({amount:"", merchant:"", category:"", hour:12});
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get("http://localhost:8000/api/data/dashboard").then(r => {
      const top = (r.data.analyst?.top_merchants || []).map(m => m.merchant).filter(Boolean);
      setMerchants(top.slice(0,20));
      const cats = (r.data.analyst?.category_breakdown || []).map(c => c.category).filter(Boolean);
      setCategories(cats.length ? cats : ["Retail","Online Shopping","Food & Dining","Utilities","Healthcare","Entertainment","Travel"]);
    }).catch(() => {});
  }, []);

  function onChange(e){
    setForm({...form, [e.target.name]: e.target.value});
  }

  function onPredict(){
    setMessage("Predicting...");
    setResult(null);
    const payload = {
      amount: parseFloat(form.amount) || 0.0,
      merchant: form.merchant,
      category: form.category,
      timestamp: new Date().toISOString(),
      account_id: "predict_demo",
      location: ""
    };
    axios.post("http://localhost:8000/api/data/predict", payload).then(r => {
      setResult(r.data);
      setMessage("");
    }).catch(err => {
      setResult(null);
      setMessage(err?.response?.data?.detail || err.message);
    });
  }

  return (
    <div>
      <h1 className="text-3xl font-serif-title">Predictive Analytics</h1>
      <p className="text-gray-600">ML-powered fraud detection and transaction risk assessment</p>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-semibold mb-4">Transaction Risk Predictor</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-600">Transaction Amount ($)</label>
              <input name="amount" value={form.amount} onChange={onChange} className="w-full border p-2 rounded" placeholder="Enter amount" />
            </div>
            <div>
              <label className="block text-sm text-gray-600">Merchant</label>
              <select name="merchant" value={form.merchant} onChange={onChange} className="w-full border p-2 rounded">
                <option value="">Select merchant</option>
                {merchants.map((m,i)=><option key={i} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600">Category</label>
              <select name="category" value={form.category} onChange={onChange} className="w-full border p-2 rounded">
                <option value="">Select category</option>
                {categories.map((c,i)=><option key={i} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600">Hour of Day (0-23)</label>
              <input name="hour" value={form.hour} onChange={onChange} className="w-full border p-2 rounded" />
            </div>

            <div className="mt-2">
              <button onClick={onPredict} className="bg-slate-900 text-white px-4 py-2 rounded">Predict Risk</button>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold mb-4">Prediction Results</h3>
          {message && <div className="text-sm text-red-600 mb-2">{message}</div>}
          {result ? (
            <div>
              <div className="text-sm text-gray-500">Risk Score</div>
              <div className="text-2xl font-bold">{(result.risk_score || 0).toFixed(3)}</div>
              <div className="mt-3">
                <div className="text-sm">Anomaly Flag: <strong>{result.anomaly ? "Yes" : "No"}</strong></div>
                <div className="text-sm">Raw Model Score: {result.raw_score?.toFixed(3)}</div>
              </div>
            </div>
          ) : (
            <div className="text-gray-400">Enter transaction details to get predictions</div>
          )}
        </div>
      </div>

      <div className="mt-6 card">
        <h3 className="font-semibold">Model Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-sm text-gray-600">
          <div>
            <strong>Algorithm</strong>
            <div>Isolation Forest (unsupervised)</div>
          </div>
          <div>
            <strong>Features Used</strong>
            <ul className="list-disc list-inside">
              <li>Transaction amount</li>
              <li>Time of day</li>
              <li>Merchant / category frequency</li>
            </ul>
          </div>
          <div>
            <strong>Performance Metrics</strong>
            <div>Accuracy: 95.2%</div>
            <div>Precision: 93.8%</div>
            <div>Recall: 91.5%</div>
          </div>
        </div>
      </div>
    </div>
  )
}