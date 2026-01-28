import React from "react";
import { NavLink, Outlet } from "react-router-dom";

export default function MainLayout(){
  const nav = [
    {to: "/", label: "Executive Dashboard"},
    {to: "/analyst", label: "Analyst Dashboard"},
    {to: "/data", label: "Data Management"},
    {to: "/predictive", label: "Predictive Analytics"},
    {to: "/reports", label: "Reports"},
    {to: "/quality", label: "Data Quality"},
  ];
  return (
    <div className="flex app-shell">
      <aside className="sidebar">
        <div className="brand">Financial Analytics</div>
        <nav className="px-4">
          {nav.map((n,idx) => (
            <NavLink key={idx} to={n.to} className={({isActive}) => "block py-3 px-3 rounded mb-1 " + (isActive ? "active" : "")}>
              {n.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="flex-1 content">
        {/* Top-right project name */}
        <div className="flex justify-end items-center mb-4">
          <div className="text-sm font-semibold text-slate-700">Financial Analytics Intelligence Platform</div>
        </div>

        <Outlet/>
      </main>
    </div>
  )
}
