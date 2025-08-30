import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/DevicePart.css";

function DevicePart() {
  const [devices, setDevices] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState("");

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchDevices();
    fetchProducts();
  }, []);

  const fetchDevices = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/devices/`);
      setDevices(res.data || []);
    } catch (err) {
      console.error("Error fetching devices:", err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/products/`);
      setProducts(res.data || []);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const filteredProducts = selectedDevice
    ? products.filter((p) => p.device === parseInt(selectedDevice))
    : [];

  return (
    <div className="devicepart-box">
      {/* هدر با تایتل و سلکت */}
      <div className="devicepart-header">
        <h2 className="devicepart-title">قطعات هر دستگاه</h2>
        <select
          className="devicepart-select"
          value={selectedDevice}
          onChange={(e) => setSelectedDevice(e.target.value)}
        >
          <option value="">-- انتخاب دستگاه --</option>
          {devices.map((d) => (
            <option key={d.id} value={d.id}>
              {d.title}
            </option>
          ))}
        </select>
      </div>

      {/* محتوای داخل همون کادر */}
      <div className="devicepart-content">
        {selectedDevice === "" ? (
          <p className="devicepart-empty">لطفاً یک دستگاه انتخاب کنید.</p>
        ) : filteredProducts.length === 0 ? (
          <p className="devicepart-empty">هیچ کالایی ثبت نشده است.</p>
        ) : (
          <ul className="devicepart-list">
            {filteredProducts.map((p) => (
              <li key={p.id} className="devicepart-item">
                {p.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default DevicePart;
