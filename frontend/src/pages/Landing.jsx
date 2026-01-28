import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Landing(){
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:8000/api/data/stats").then(res => {
      setStats(res.data);
    }).catch(err => {
      console.warn("stats fetch failed", err);
    })
  }, []);

  return (
    <div>
      <header className="bg-deep text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl font-serif-title font-bold">Financial Analytics <span className="text-teal-400">Intelligence Platform</span></h1>
          <p className="mt-6 text-gray-200 max-w-2xl mx-auto">Transform complex financial data into actionable insights. Built for JP Morgan Chase analysts to decode patterns, detect fraud, and drive strategic decisions.</p>
          <div className="mt-8 flex justify-center gap-4">
            <Link to="/dashboard" className="bg-teal-500 text-white px-6 py-3 rounded">View Dashboard</Link>
            <Link to="/data" className="border border-white text-white px-6 py-3 rounded">Manage Data</Link>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            <div className="bg-slate-800 bg-opacity-30 p-6 rounded">
              <div className="text-2xl font-bold">{stats ? (stats.transactions_analyzed > 1000000 ? "1M+" : stats.transactions_analyzed) : "—"}</div>
              <div className="text-sm text-gray-300">TRANSACTIONS ANALYZED</div>
            </div>
            <div className="bg-slate-800 bg-opacity-30 p-6 rounded">
              <div className="text-2xl font-bold">{stats ? stats.fraud_detection_accuracy + "%" : "—"}</div>
              <div className="text-sm text-gray-300">FRAUD DETECTION ACCURACY</div>
            </div>
            <div className="bg-slate-800 bg-opacity-30 p-6 rounded">
              <div className="text-2xl font-bold">&lt;{stats ? stats.processing_speed_ms + "ms" : "—"}</div>
              <div className="text-sm text-gray-300">PROCESSING SPEED</div>
            </div>
            <div className="bg-slate-800 bg-opacity-30 p-6 rounded">
              <div className="text-2xl font-bold">{stats ? stats.data_quality_score + "%" : "—"}</div>
              <div className="text-sm text-gray-300">DATA QUALITY SCORE</div>
            </div>
          </div>
        </div>
      </header>

      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-serif-title text-center">Comprehensive Analytics Suite</h2>
          <p className="text-center text-gray-600 mt-2">End-to-end solution for financial data analysis, from ingestion to insights</p>

          <div className="mt-8 grid md:grid-cols-3 gap-6">
            <div className="border p-6">
              <h3 className="font-semibold">Executive Insights</h3>
              <p className="text-sm text-gray-600 mt-2">High-level KPIs and strategic metrics for decision-makers</p>
            </div>
            <div className="border p-6">
              <h3 className="font-semibold">Detailed Analytics</h3>
              <p className="text-sm text-gray-600 mt-2">Drill-down capabilities with advanced filtering and segmentation</p>
            </div>
            <div className="border p-6">
              <h3 className="font-semibold">ML-Powered Predictions</h3>
              <p className="text-sm text-gray-600 mt-2">Fraud detection and forecasting using machine learning models</p>
            </div>
            <div className="border p-6">
              <h3 className="font-semibold">Data Management</h3>
              <p className="text-sm text-gray-600 mt-2">Upload, validate, and process large financial datasets</p>
            </div>
            <div className="border p-6">
              <h3 className="font-semibold">Report Generation</h3>
              <p className="text-sm text-gray-600 mt-2">Automated reporting with templates and scheduling</p>
            </div>
            <div className="border p-6">
              <h3 className="font-semibold">Data Quality</h3>
              <p className="text-sm text-gray-600 mt-2">Continuous monitoring of data integrity and completeness</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-100 py-12">
        <div className="container mx-auto px-6 text-center">
          <h3 className="font-serif-title text-xl">Built with Enterprise-Grade Technology</h3>
          <div className="mt-4 text-gray-600 flex justify-center gap-8">
            <div><strong>Backend</strong><div>FastAPI • Python • MongoDB</div></div>
            <div><strong>Analytics</strong><div>Pandas • NumPy • Scikit-Learn</div></div>
            <div><strong>Frontend</strong><div>React • Recharts • Tailwind</div></div>
          </div>
        </div>
      </footer>
    </div>
  )
}