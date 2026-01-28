import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import ExecutiveDashboard from "./pages/ExecutiveDashboard";
import AnalystDashboard from "./pages/AnalystDashboard";
import DataManagement from "./pages/DataManagement";
import PredictiveAnalytics from "./pages/PredictiveAnalytics";
import Reports from "./pages/Reports";
import DataQuality from "./pages/DataQuality";

export default function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout/>}>
          <Route index element={<ExecutiveDashboard/>} />
          <Route path="analyst" element={<AnalystDashboard/>} />
          <Route path="data" element={<DataManagement/>} />
          <Route path="predictive" element={<PredictiveAnalytics/>} />
          <Route path="reports" element={<Reports/>} />
          <Route path="quality" element={<DataQuality/>} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}