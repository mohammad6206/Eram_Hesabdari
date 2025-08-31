import React from "react";
import { Link } from "react-router-dom";
import {
  FaBoxOpen,
  FaWarehouse,
  FaBalanceScale,
  FaUsers,
  FaFileSignature,
  FaFileExcel,
  FaTruck,
  FaFire,
  FaLayerGroup,
  FaCogs,
  FaLaptop,
  FaUserPlus,
  FaUserTie,
} from "react-icons/fa";
import "../styles/basicinfo.css"; // فایل CSS جدا

function BasicInfo() {
  const buttons = [
    { label: "تعریف خریداران", icon: <FaUserPlus  />, to: "/buyer" },
    { label: "تعریف تامین‌کننده", icon: <FaUserTie  />, to: "/seller" },
    { label: "تعریف پرسنل", icon: <FaUsers />, to: "/Personnel" },
    { label: "تعریف انبار", icon: <FaWarehouse />, to: "/warehouse" },
    { label: "گروه کالا", icon: <FaLayerGroup />, to: "/product-group" },
    { label: "تعریف واحد", icon: <FaBalanceScale />, to: "/unit" },
    { label: "تعریف کالا", icon: <FaBoxOpen />, to: "/product" },
    { label: "امضا گزارشات", icon: <FaFileSignature />, to: "#" },
    { label: "ورود کالا از اکسل", icon: <FaFileExcel />, to: "#" },
    { label: "تعریف رانندگان", icon: <FaTruck />, to: "#" },
    { label: "نوع مصرف", icon: <FaFire />, to: "/consumption-type" },
    { label: "تعریف دستگاه" , icon: <FaLaptop   />, to: "/device" },
    { label: "قطعات دستگاه" , icon: <FaCogs />, to: "/device-part" },

  ];

  return (
    <div className="basicinfo-container">
      <h2>اطلاعات پایه</h2>
      <div className="basicinfo-grid">
        {buttons.map((btn, idx) => (
          <Link key={idx} to={btn.to} className="basicinfo-card">
            <div className="icon">{btn.icon}</div>
            <div className="label">{btn.label}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default BasicInfo;
