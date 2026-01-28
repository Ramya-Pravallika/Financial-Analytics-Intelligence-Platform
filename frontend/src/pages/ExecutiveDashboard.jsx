import React, { useEffect, useState } from "react";
import axios from "axios";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

export default function ExecutiveDashboard(){
  const [data, setData] = useState({executive:{}, analyst:{}});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  function fetchDashboard(){
    setLoading(true);
    axios.get("http://localhost:8000/api/data/dashboard").then(r => {
      setData(r.data);
      setLoading(false);
    }).catch(e => {
      console.warn(e);
      setLoading(false);
    });
  }

  const exec = data.executive || {};
  const topCats = exec.top_categories || [];
  const revenueTrend = exec.revenue_trend || [];

  return (
    <div>
      <h1 className="text-3xl font-serif-title">Executive Dashboard</h1>
      <p className="text-gray-600">Strategic financial insights and key performance indicators</p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="text-sm text-gray-500">TOTAL TRANSACTIONS</div>
          <div className="text-2xl font-bold">{exec.total_transactions ?? "—"}</div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-500">TOTAL REVENUE</div>
          <div className="text-2xl font-bold">${(exec.total_revenue || 0).toLocaleString()}</div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-500">AVG TRANSACTION</div>
          <div className="text-2xl font-bold">${(exec.avg_transaction || 0).toFixed(2)}</div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-500">FRAUD RATE</div>
          <div className="text-2xl font-bold">{(exec.fraud_rate || 0).toFixed(2)}%</div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-semibold mb-4">Revenue Trend</h3>
          <div style={{height:300}}>
            <ResponsiveContainer>
              <LineChart data={revenueTrend}>
                <CartesianGrid stroke="#eee" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="amount" stroke="#0ea5a4" strokeWidth={2} dot />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold mb-4">Top Categories</h3>
          <div style={{height:300}}>
            <ResponsiveContainer>
              <BarChart data={topCats}>
                <CartesianGrid stroke="#eee" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-6 card border-l-4 border-red-300 bg-red-50">
        <strong>High Risk Transactions Detected</strong>
        <div className="mt-2">{exec.high_risk_count ?? 0} transactions flagged for review. Immediate attention recommended.</div>
      </div>
    </div>
  )
}