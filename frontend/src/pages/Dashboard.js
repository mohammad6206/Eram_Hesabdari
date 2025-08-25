import React from "react";
import { Link } from "react-router-dom";
import {
  FaUser, FaWarehouse, FaBoxes, FaBalanceScale, FaBoxOpen, FaFileSignature,
  FaFileExcel, FaTruck, FaRecycle, FaCog, FaSignOutAlt, FaDatabase,
  FaClipboardList, FaChartBar, FaCogs
} from "react-icons/fa";
import "../styles/dashboard.css";

function Dashboard() {

  const statButtons = [
    {
      label: "کالاها",
      icon: "📦",
    },
    {
      label: "انبارها",
      icon: "🏬",
    },
    {
      label: "واحدها",
      icon: "📏",
    },
    {
      label: "انواع مصرف",
      icon: "⚡",
    },
  ];

  return (
    <div className="dashboard-container">

        {/* دکمه های آماری */}
        <div className="stats-grid" style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
          {statButtons.map((btn, index) => (
            <button
              key={index}
              className="stat-button"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "10px 15px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                backgroundColor: "#f5f5f5",
                cursor: "pointer",
                minWidth: "120px"
              }}
            >
              <div className="stat-icon" style={{ fontSize: "24px", marginBottom: "5px" }}>
                {btn.icon}
              </div>
              <span className="stat-label">{btn.label}</span>
            </button>
          ))}
        </div>
      </div>
  );
}

export default Dashboard;
