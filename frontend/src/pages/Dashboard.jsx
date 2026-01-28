import React, { useEffect, useState } from "react";
import axios from "axios";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

export default function Dashboard(){
  const [stats, setStats] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [anomalies, setAnomalies] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchTransactions();
    fetchAnomalies();
  }, []);

  function fetchStats(){
    axios.get("http://localhost:8000/api/data/stats").then(r => setStats(r.data));
  }
  function fetchTransactions(){
    axios.get("http://localhost:8000/api/data/transactions?limit=200").then(r => setTransactions(r.data.items || []));
  }
  function fetchAnomalies(){
    axios.get("http://localhost:8000/api/data/anomalies?limit=200").then(r => setAnomalies(r.data.items || []));
  }

  // aggregate sample series for chart
  const series = transactions.slice(0,200).map((t, i) => ({
    name: t.timestamp ? t.timestamp.split("T")[0] : `t${i}`,
    amount: Number(t.amount || 0)
  }));

  return (
    <div className="container mx-auto px-6 py-10">
      <h1 className="text-3xl font-serif-title">Dashboard</h1>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-6 bg-white shadow rounded">
          <div className="text-sm text-gray-500">Transactions Analyzed</div>
          <div className="text-2xl font-bold">{stats ? stats.transactions_analyzed : "—"}</div>
        </div>
        <div className="p-6 bg-white shadow rounded">
          <div className="text-sm text-gray-500">Fraud Detection Accuracy</div>
          <div className="text-2xl font-bold">{stats ? stats.fraud_detection_accuracy + "%" : "—"}</div>
        </div>
        <div className="p-6 bg-white shadow rounded">
          <div className="text-sm text-gray-500">Processing Speed</div>
          <div className="text-2xl font-bold">{stats ? "<" + stats.processing_speed_ms + "ms" : "—"}</div>
        </div>
        <div className="p-6 bg-white shadow rounded">
          <div className="text-sm text-gray-500">Data Quality</div>
          <div className="text-2xl font-bold">{stats ? stats.data_quality_score + "%" : "—"}</div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 bg-white shadow rounded">
          <h3 className="font-semibold mb-4">Transaction Volume</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={series}>
              <CartesianGrid stroke="#eee" />
              <XAxis dataKey="name" hide />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="amount" stroke="#34d399" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="p-6 bg-white shadow rounded">
          <h3 className="font-semibold mb-4">Top Anomalous Transactions</h3>
          <div className="max-h-64 overflow-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-sm text-gray-500">
                  <th className="p-2">Tx ID</th>
                  <th className="p-2">Amount</th>
                  <th className="p-2">Account</th>
                </tr>
              </thead>
              <tbody>
                {anomalies.slice(0,20).map((a, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="p-2">{a.transaction_id || a.id || idx}</td>
                    <td className="p-2">{a.amount}</td>
                    <td className="p-2">{a.account_id}</td>
                  </tr>
                ))}
                {anomalies.length === 0 && <tr><td className="p-2" colSpan={3}>No anomalies detected (train model to enable)</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}