import React, { useState, useEffect } from "react";
import axios from "axios";

export default function DataManager(){
  const [file, setFile] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [message, setMessage] = useState("");

  function fetchTransactions(){
    axios.get("http://localhost:8000/api/data/transactions?limit=100").then(r => setTransactions(r.data.items || []))
  }

  useEffect(() => {
    fetchTransactions();
  }, []);

  function onUpload(e){
    e.preventDefault();
    if(!file) return setMessage("Select a CSV file");
    const form = new FormData();
    form.append("file", file);
    axios.post("http://localhost:8000/api/data/upload", form, { headers: { "Content-Type": "multipart/form-data" } })
      .then(r => {
        setMessage(`Inserted: ${r.data.inserted}`);
        fetchTransactions();
      }).catch(err => setMessage("Upload failed: " + String(err)));
  }

  function onTrain(){
    setMessage("Training model...");
    axios.post("http://localhost:8000/api/data/train").then(r => {
      setMessage("Model trained at " + r.data.model_path);
    }).catch(e => setMessage("Train failed: " + e?.response?.data?.detail || e.message));
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-2xl font-serif-title">Manage Data</h1>
      <p className="text-gray-600 mt-2">Upload CSV files containing transaction data. Ensure columns: transaction_id, account_id, timestamp, amount, merchant, category</p>

      <form className="mt-6" onSubmit={onUpload}>
        <input type="file" accept=".csv" onChange={e => setFile(e.target.files[0])} />
        <button type="submit" className="ml-4 bg-teal-500 text-white px-4 py-2 rounded">Upload</button>
        <button type="button" onClick={onTrain} className="ml-4 bg-blue-600 text-white px-4 py-2 rounded">Train Model</button>
      </form>

      {message && <div className="mt-4 text-sm text-teal-700">{message}</div>}

      <div className="mt-6">
        <h3 className="font-semibold">Recent Transactions</h3>
        <div className="max-h-96 overflow-auto mt-2 border">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-2">transaction_id</th>
                <th className="p-2">account_id</th>
                <th className="p-2">timestamp</th>
                <th className="p-2">amount</th>
                <th className="p-2">merchant</th>
                <th className="p-2">category</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t, idx) => (
                <tr key={idx} className="border-t">
                  <td className="p-2">{t.transaction_id}</td>
                  <td className="p-2">{t.account_id}</td>
                  <td className="p-2">{t.timestamp}</td>
                  <td className="p-2">{t.amount}</td>
                  <td className="p-2">{t.merchant}</td>
                  <td className="p-2">{t.category}</td>
                </tr>
              ))}
              {transactions.length === 0 && <tr><td className="p-2" colSpan={6}>No transactions yet</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
