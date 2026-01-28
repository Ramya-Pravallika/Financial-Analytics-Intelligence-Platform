import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Reports(){
  const [reportType, setReportType] = useState("Monthly Report");
  const [days, setDays] = useState(30);
  const [reports, setReports] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchReports();
  }, []);

  function fetchReports(){
    axios.get("http://localhost:8000/api/reports/list").then(r => setReports(r.data.items || [])).catch(() => {});
  }

  function generate(){
    setMessage("Generating report...");
    const payload = {report_type: reportType};
    axios.post("http://localhost:8000/api/reports/generate", payload).then(r => {
      setMessage(`Report generated (${r.data.report_id})`);
      fetchReports();
    }).catch(err => setMessage(err?.response?.data?.detail || err.message));
  }

  function download(id){
    window.open(`http://localhost:8000/api/reports/download?report_id=${id}`, "_blank");
  }

  return (
    <div>
      <h1 className="text-3xl font-serif-title">Reports</h1>
      <p className="text-gray-600">Generate and manage custom financial reports</p>

      <div className="mt-6 card">
        <h3 className="font-semibold">Generate New Report</h3>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
          <select value={reportType} onChange={e=>setReportType(e.target.value)} className="border p-2 rounded">
            <option>Monthly Report</option>
            <option>Weekly Report</option>
            <option>Custom Report</option>
          </select>
          <input type="number" value={days} onChange={e=>setDays(Number(e.target.value))} className="border p-2 rounded" />
          <div>
            <button onClick={generate} className="bg-slate-900 text-white px-4 py-2 rounded">Generate Report</button>
            <div className="text-sm text-teal-700 mt-2">{message}</div>
          </div>
        </div>
      </div>

      <div className="mt-6 card">
        <h3 className="font-semibold">Generated Reports</h3>
        <div className="mt-4 space-y-4">
          {reports.map((r) => (
            <div key={r.id} className="p-4 border rounded flex justify-between items-center">
              <div>
                <div className="font-semibold">{r.report_type}</div>
                <div className="text-sm text-gray-600">Report generated for period: {r.start} - {r.end} • Transactions: {r.transactions} • Amount: ${Number(r.amount).toFixed(2)}</div>
              </div>
              <div>
                <button onClick={()=>download(r.id)} className="px-3 py-2 border rounded">Download</button>
              </div>
            </div>
          ))}
          {reports.length===0 && <div className="text-sm text-gray-600">No reports yet</div>}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">Automated Scheduling<br/><small className="text-gray-600">Set up recurring reports via cron (future)</small></div>
        <div className="card">Custom Templates<br/><small className="text-gray-600">Create report templates for stakeholders (future)</small></div>
        <div className="card">Export Options<br/><small className="text-gray-600">PDF / Excel / CSV exports available</small></div>
      </div>
    </div>
  )
}