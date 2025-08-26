// src/components/Layout.js
import React from "react";
import { Outlet, Link } from "react-router-dom";
import {
  FaUser, FaDatabase, FaClipboardList, FaChartBar, FaCogs, FaCog, FaSignOutAlt, FaBoxOpen,FaTachometerAlt  
} from "react-icons/fa";
import "../styles/Layout.css";

function Layout() {
  return (
    <div className="dashboard-container">
      {/* نوار کناری */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-icons" style={{ display: "flex", flexDirection: "column", gap: "20px", alignItems: "center" }}>
          <Link to="/dashboard" className="sidebar-button">
            <FaTachometerAlt   size={24} />
            <span>داشبورد</span>
          </Link>

          <Link to="/basic-info" className="sidebar-button">
            <FaDatabase size={24} />
            <span>اطلاعات پایه</span>
          </Link>

          <Link to="#" className="sidebar-button">
            <FaBoxOpen size={24} />
            <span>عملیات کالا</span>
          </Link>

          <Link to="#" className="sidebar-button">
            <FaClipboardList size={24} />
            <span>گزارش موجودی</span>
          </Link>

          <Link to="#" className="sidebar-button">
            <FaChartBar size={24} />
            <span>گزارشات</span>
          </Link>

          <Link to="#" className="sidebar-button">
            <FaCogs size={24} />
            <span>امکانات</span>
          </Link>
        </div>

        <div className="sidebar-bottom">
          <Link to="#" className="sidebar-button">
            <FaCog />
            <span>تنظیمات</span>
          </Link>
          <Link to="#" className="sidebar-button">
            <FaSignOutAlt />
            <span>خروج</span>
          </Link>
        </div>
      </aside>

      {/* بخش محتوای صفحات */}
      <div className="dashboard-content">
        {/* هدر ثابت */}
        <header className="dashboard-header">
          <div className="user-info">
            <div className="user-text">
              <p className="user-name">امین رضایی</p>
              <p className="user-role">مدیر سیستم</p>
            </div>
            <div className="user-avatar">
              <FaUser />
            </div>
          </div>
          <h1 className="dashboard-title">پنل مدیریت</h1>
        </header>

        {/* محل تغییر صفحات */}
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
