// src/pages/ProductOperation.js
import React from "react";
import { Link } from "react-router-dom";
import {
  FaBoxOpen,
  FaWarehouse,
  FaFileInvoice,
  FaFileInvoiceDollar,
} from "react-icons/fa";
import "../styles/ProductOperation.css";

function ProductOperation() {
  const buttons = [
    { label: "ورود کالا به انبار", icon: FaBoxOpen, to: "#" },
    { label: "خروج کالا از انبار", icon: FaWarehouse, to: "#" },
    { label: "فاکتور خرید", icon: FaFileInvoice, to: "/buy-invoice" },
    { label: "فاکتور فروش", icon: FaFileInvoiceDollar, to: "/sell-invoice" },
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
