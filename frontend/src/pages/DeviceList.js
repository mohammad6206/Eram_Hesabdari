import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import { Link } from "react-router-dom";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "../styles/DeviceGeneration.css";

function DeviceList() {
  const [deviceList, setDeviceList] = useState([]);
  const [expandedDeviceId, setExpandedDeviceId] = useState(null);
  const [personnel, setPersonnel] = useState([]);
  const [search, setSearch] = useState("");
  const [dateField, setDateField] = useState("created_at");
  const [dateFilter, setDateFilter] = useState({ from: null, to: null });

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchPersonnel();
    fetchDeviceList();
  }, []);

  const fetchPersonnel = async () => {
    try {
      const res = await axiosInstance.get(`${API_URL}/api/personnel/`);
      setPersonnel(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDeviceList = async () => {
    try {
      const res = await axiosInstance.get(`${API_URL}/api/device-generation/`);
      setDeviceList(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // فیلتر جستجو و تاریخ
  const filteredDevices = deviceList.filter((device) => {
    const text = search.toLowerCase();
    const matchesText =
      device.deviceName.toLowerCase().includes(text) ||
      device.documentCode.toLowerCase().includes(text) ||
      device.deviceSerial.toLowerCase().includes(text);

    let matchesDate = true;
    if (dateFilter.from) {
      matchesDate =
        new Date(device[dateField]) >= new Date(dateFilter.from.toDate());
    }
    if (matchesDate && dateFilter.to) {
      matchesDate =
        new Date(device[dateField]) <= new Date(dateFilter.to.toDate());
    }

    return matchesText && matchesDate;
  });

  return (
    <div className="device-list-page" dir="rtl">
      <h2 className="page-title text-center">لیست دستگاه‌های تولید شده</h2>

      {/* سرچ و فیلتر */}
      <div className="d-flex justify-content-between align-items-center mb-3 gap-3 flex-wrap">
        {/* 🔎 سرچ */}
        <input
          type="text"
          placeholder="جستجو در همه فیلدها..."
          className="form-control w-25"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* 📅 فیلتر تاریخ */}
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <select
            className="form-select"
            value={dateField}
            onChange={(e) => setDateField(e.target.value)}
          >
            <option value="created_at">تاریخ ایجاد</option>
            <option value="updated_at">تاریخ آخرین ویرایش</option>
          </select>

          <span>از:</span>
          <DatePicker
            calendar={persian}
            locale={persian_fa}
            value={dateFilter.from}
            onChange={(date) =>
              setDateFilter((prev) => ({ ...prev, from: date }))
            }
            format="YYYY/MM/DD"
            className="form-control"
          />

          <span>تا:</span>
          <DatePicker
            calendar={persian}
            locale={persian_fa}
            value={dateFilter.to}
            onChange={(date) =>
              setDateFilter((prev) => ({ ...prev, to: date }))
            }
            format="YYYY/MM/DD"
            className="form-control"
          />
        </div>

        <Link to="/device-generation" className="btn btn-success">
          تولید دستگاه جدید
        </Link>
      </div>

      {/* لیست دستگاه‌ها */}
      <div className="device-list-box">
        {filteredDevices.map((device) => (
          <div
            key={device.id}
            className="device-list-item"
            style={{
              border: "1px solid #ccc",
              borderRadius: "6px",
              marginBottom: "10px",
              padding: "10px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <span>
                {device.deviceName} - {device.documentCode} - {device.deviceSerial}
              </span>
              <button
                className="btn btn-primary"
                onClick={() =>
                  setExpandedDeviceId(
                    expandedDeviceId === device.id ? null : device.id
                  )
                }
              >
                {expandedDeviceId === device.id ? "بستن" : "مشاهده جزئیات"}
              </button>
            </div>

            {expandedDeviceId === device.id && (
              <table className="custom-table" style={{ marginTop: "10px" }}>
                <thead>
                  <tr>
                    <th>نام اجزا</th>
                    <th>سریال کالا / پک</th>
                    <th>پارامتر کنترلی</th>
                    <th>نتیجه</th>
                    <th>نام اپراتور</th>
                    <th>تاریخ</th>
                  </tr>
                </thead>
                <tbody>
                  {device.rows.map((row, index) => (
                    <tr key={index}>
                      <td>{row.items.map((i) => i.productName).join(", ")}</td>
                      <td>{row.items.map((i) => i.serial).join(", ")}</td>
                      <td>{row.items.map((i) => i.controlParameter).join(", ")}</td>
                      <td>{row.items.map((i) => (i.result ? "✔" : "✖")).join(", ")}</td>
                      <td>
                        {row.items
                          .map(
                            (i) =>
                              personnel.find((p) => p.id === i.operatorId)?.name ||
                              ""
                          )
                          .join(", ")}
                      </td>
                      <td>{row.items.map((i) => i.date).join(", ")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ))}

        {filteredDevices.length === 0 && (
          <p className="text-center text-muted">هیچ دستگاهی یافت نشد.</p>
        )}
      </div>
    </div>
  );
}

export default DeviceList;
