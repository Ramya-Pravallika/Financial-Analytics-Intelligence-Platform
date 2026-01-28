import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar } from "recharts";

const COLORS = ["#4ade80","#f97316","#60a5fa","#f472b6","#a78bfa","#34d399","#f59e0b","#60a5fa"];

export default function AnalystDashboard(){
  const [data, setData] = useState({executive:{}, analyst:{}});
  useEffect(() => {
    axios.get("http://localhost:8000/api/data/dashboard").then(r => setData(r.data)).catch(console.warn);
  }, []);

  const analyst = data.analyst || {};
  const catBreak = analyst.category_breakdown || [];
  const hourly = analyst.hourly_distribution || [];
  const topMerchants = analyst.top_merchants || [];
  const risk = analyst.risk_distribution || [];
  const recent = analyst.recent_transactions || [];

  return (
    <div>
      <h1 className="text-3xl font-serif-title">Analyst Dashboard</h1>
      <p className="text-gray-600">Detailed metrics, patterns, and drill-down analysis</p>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-semibold mb-4">Category Breakdown</h3>
          <div style={{height:300}}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={catBreak} dataKey="pct" nameKey="category" outerRadius={100} label>
                  {catBreak.map((entry, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v)=> (v*100).toFixed(1) + "%"} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold mb-4">Hourly Distribution</h3>
          <div style={{height:300}}>
            <ResponsiveContainer>
              <LineChart data={hourly}>
                <CartesianGrid stroke="#eee" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#10b981" dot />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold mb-4">Top Merchants by Revenue</h3>
          <div style={{height:260}}>
            <ResponsiveContainer>
              <BarChart layout="vertical" data={topMerchants}>
                <XAxis type="number" />
                <YAxis dataKey="merchant" type="category" />
                <CartesianGrid stroke="#eee" />
                <Tooltip />
                <Bar dataKey="amount" fill="#0f172a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold mb-4">Risk Distribution</h3>
          <div style={{height:260}}>
            <ResponsiveContainer>
              <BarChart data={risk}>
                <CartesianGrid stroke="#eee" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-6 card">
        <h3 className="font-semibold mb-4">Recent Transactions</h3>
        <table className="w-full table-light">
          <thead>
            <tr className="text-sm text-gray-500">
              <th>ID</th><th>Amount</th><th>Merchant</th><th>Category</th><th>Location</th><th>Risk</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((r, idx) => (
              <tr key={idx} className="border-t">
                <td className="p-2">{r.transaction_id}</td>
                <td className="p-2">${Number(r.amount || 0).toFixed(2)}</td>
                <td className="p-2">{r.merchant}</td>
                <td className="p-2">{r.category}</td>
                <td className="p-2">{r.location}</td>
                <td className="p-2">
                  {r.risk_score !== undefined ? (
                    <span className={r.risk_score>=0.66 ? "badge-risk-high" : "badge-risk-low"}>
                      {r.risk_score.toFixed(2)}
                    </span>
                  ) : "—"}
                </td>
              </tr>
            ))}
            {recent.length===0 && <tr><td colSpan={6} className="p-4">No transactions</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
