import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function DataManagement(){
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [sampleing, setSampling] = useState(false);
  const inputRef = useRef();

  useEffect(() => {
    // nothing
  }, []);

  function onFileChange(e){
    setFile(e.target.files[0]);
  }

  function uploadFile(autoTrain=false){
    if(!file) return setMessage("Select a CSV file");
    const form = new FormData();
    form.append("file", file);
    setMessage("Uploading...");
    axios.post("http://localhost:8000/api/data/upload", form, { headers: { "Content-Type": "multipart/form-data" } })
      .then(r => {
        setMessage(`Inserted: ${r.data.inserted}`);
        if(autoTrain) trainModel();
      }).catch(err => setMessage("Upload failed: " + (err?.response?.data?.detail || err.message)));
  }

  function trainModel(){
    setMessage("Training model...");
    axios.post("http://localhost:8000/api/data/train").then(r => setMessage("Model trained at " + r.data.model_path)).catch(err => setMessage("Train failed: " + (err?.response?.data?.detail || err.message)));
  }

  function generateSample(){
    setSampling(true);
    axios.post("http://localhost:8000/api/data/generate-sample?n=1000").then(r => {
      setMessage(`Generated ${r.data.inserted} sample transactions`);
      setSampling(false);
    }).catch(err => {
      setMessage("Generate failed: " + (err?.response?.data?.detail || err.message));
      setSampling(false);
    });
  }

  return (
    <div>
      <h1 className="text-3xl font-serif-title">Data Management</h1>
      <p className="text-gray-600">Upload, validate, and process financial transaction data</p>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-semibold mb-2">Upload Transactions</h3>
          <p className="text-sm text-gray-600">Required columns: transaction_id, account_id (or user_id), timestamp, amount, merchant, category, location</p>
          <div className="mt-4 border-dashed border-2 border-gray-200 p-6 text-center">
            <input ref={inputRef} type="file" accept=".csv" onChange={onFileChange} />
            <div className="mt-4">
              <button onClick={() => uploadFile(false)} className="bg-teal-500 text-white px-4 py-2 rounded mr-2">Upload</button>
              <button onClick={() => uploadFile(true)} className="bg-blue-600 text-white px-4 py-2 rounded mr-2">Upload & Auto Train</button>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold mb-2">Generate Sample Data</h3>
          <p className="text-sm text-gray-600">Create 1,000 synthetic transactions for testing and demos</p>
          <div className="mt-6">
            <button onClick={generateSample} className="bg-slate-900 text-white px-4 py-2 rounded" disabled={sampleing}>{sampleing ? "Generating..." : "Generate Sample Data"}</button>
            <div className="mt-4 text-sm text-teal-700">{message}</div>
            <div className="mt-6">
              <h4 className="font-semibold">Data Validation Rules</h4>
              <ul className="text-sm text-gray-600 list-disc list-inside mt-2">
                <li>Required fields: transaction_id, amount, merchant, category, timestamp, account_id/user_id, location</li>
                <li>Amount: numeric</li>
                <li>Timestamp: ISO 8601</li>
                <li>Duplicates will be stored — dedupe in your pipeline if needed</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}