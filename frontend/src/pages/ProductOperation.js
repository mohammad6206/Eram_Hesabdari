// src/pages/ProductOperation.js
import React from "react";
import { Link } from "react-router-dom";
import {
  FaFileInvoice,
  FaFileInvoiceDollar,
  FaIndustry,
  FaExchangeAlt,
  FaArrowCircleUp,
  FaArrowCircleDown,
  
} from "react-icons/fa";
import "../styles/ProductOperation.css";

function ProductOperation() {
  const buttons = [
    { label: "فاکتور خرید کالا", icon: FaFileInvoice, to: "/BuyInvoiceList" },
    { label: "فاکتور فروش دستگاه", icon: FaFileInvoiceDollar, to: "/SellInvoiceList" },
    { label: "تولید دستگاه", icon: FaIndustry, to: "/device-list" },
    { label: "جابه جایی بین انبار", icon: FaExchangeAlt, to: "/warehouse-transfer" },
    { label: "ورودی انبار", icon:FaArrowCircleDown , to: "/inventory-item" },
    { label: "خروجی انبار", icon: FaArrowCircleUp, to: "/inventory-out-item" },
  ];

  return (
    <div className="product-operation-container">
      <h2 className="product-operation-title">عملیات کالا</h2>
      <div className="product-operation-grid">
        {buttons.map(({ label, icon: Icon, to }, index) => (
          <Link
            key={index}
            to={to}
            className="product-operation-card"
            aria-label={label}
            title={label}
          >
            <div className="product-operation-icon">
              <Icon />
            </div>
            <span className="product-operation-label">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ProductOperation;
