import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance"; // axios آماده
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "../styles/DeviceGeneration.css";

function DeviceGeneration() {
  const [deviceName, setDeviceName] = useState("");
  const [documentCode, setDocumentCode] = useState("");
  const [deviceSerial, setDeviceSerial] = useState("");
  const [deviceRows, setDeviceRows] = useState([]);
  const [personnel, setPersonnel] = useState([]);

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchPersonnel();
  }, []);

  const fetchPersonnel = async () => {
    try {
      const res = await axiosInstance.get(`${API_URL}/api/personnel/`);
      setPersonnel(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // افزودن ردیف جدید
  const handleAddRow = () => {
    setDeviceRows(prev => [
      ...prev,
      { 
        isPackage: false, 
        items: [{ productName: "", serial: "", controlParameter: "", result: false, operatorId: "", date: "" }]
      }
    ]);
  };

  // حذف آخرین ردیف
  const handleRemoveRow = () => {
    setDeviceRows(prev => prev.slice(0, prev.length - 1));
  };

  // تغییر مقادیر هر ردیف
  const handleControlParameterChange = (rowIndex, itemIndex, value) => {
    const newRows = [...deviceRows];
    newRows[rowIndex].items[itemIndex].controlParameter = value;
    setDeviceRows(newRows);
  };

  const handleResultChange = (rowIndex, itemIndex, value) => {
    const newRows = [...deviceRows];
    newRows[rowIndex].items[itemIndex].result = value;
    setDeviceRows(newRows);
  };

  const handleOperatorChange = (rowIndex, itemIndex, value) => {
    const newRows = [...deviceRows];
    newRows[rowIndex].items[itemIndex].operatorId = value;
    setDeviceRows(newRows);
  };

  const handleDateChange = (rowIndex, itemIndex, value) => {
    const newRows = [...deviceRows];
    newRows[rowIndex].items[itemIndex].date = value;
    setDeviceRows(newRows);
  };

  // ثبت دستگاه
  const handleSubmit = async () => {
    const payload = {
      deviceName,
      documentCode,
      deviceSerial,
      rows: deviceRows
    };
    try {
      await axiosInstance.post(`${API_URL}/api/device-generation/`, payload);
      alert("دستگاه ثبت شد!");
      // ریست فرم
      setDeviceName("");
      setDocumentCode("");
      setDeviceSerial("");
      setDeviceRows([]);
    } catch (err) {
      console.error(err);
      alert("ثبت دستگاه با خطا مواجه شد.");
    }
  };

  return (
    <div className="device-generation-page" dir="rtl">
      <h2 className="page-title text-center">تولید دستگاه</h2>

      {/* اطلاعات دستگاه */}
      <div className="device-info-box">
        <div className="device-info-row">
          <label>نام دستگاه:</label>
          <input
            type="text"
            className="form-input"
            value={deviceName}
            onChange={e => setDeviceName(e.target.value)}
          />
        </div>
        <div className="device-info-row">
          <label>کد سند:</label>
          <input
            type="text"
            className="form-input"
            value={documentCode}
            onChange={e => setDocumentCode(e.target.value)}
          />
        </div>
        <div className="device-info-row">
          <label>سریال نامبر دستگاه:</label>
          <input
            type="text"
            className="form-input"
            value={deviceSerial}
            onChange={e => setDeviceSerial(e.target.value)}
          />
        </div>
      </div>

      {/* جدول ردیف‌ها */}
      <div className="device-rows-box">
        <table className="custom-table">
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
            {deviceRows.map((row, rowIndex) => (
              <React.Fragment key={rowIndex}>
                {row.isPackage && (
                  <tr className="package-row">
                    <td colSpan="6" className="package-title">
                      پک: {row.packageName} ({row.items.length} کالا)
                    </td>
                  </tr>
                )}
                {row.items.map((item, itemIndex) => (
                  <tr key={itemIndex} className={row.isPackage ? "package-item-row" : ""}>
                    <td>{item.productName}</td>
                    <td>{item.serial}</td>
                    <td>
                      <input
                        type="text"
                        className="form-input"
                        value={item.controlParameter}
                        onChange={e => handleControlParameterChange(rowIndex, itemIndex, e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={item.result}
                        onChange={e => handleResultChange(rowIndex, itemIndex, e.target.checked)}
                      />
                    </td>
                    <td>
                      <select
                        className="form-input"
                        value={item.operatorId}
                        onChange={e => handleOperatorChange(rowIndex, itemIndex, e.target.value)}
                      >
                        <option value="">انتخاب اپراتور</option>
                        {personnel.map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        type="date"
                        className="form-input"
                        value={item.date}
                        onChange={e => handleDateChange(rowIndex, itemIndex, e.target.value)}
                      />
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>

        {/* دکمه‌های عملیات ردیف */}
        <div className="device-rows-actions">
          <button className="btn btn-primary" onClick={handleAddRow}>افزودن ردیف</button>
          <button className="btn btn-danger" onClick={handleRemoveRow}>حذف ردیف</button>
        </div>
      </div>

      {/* ثبت نهایی */}
      <div className="submit-box">
        <button className="btn btn-success w-100 py-2" onClick={handleSubmit}>ثبت دستگاه</button>
      </div>
    </div>
  );
}

export default DeviceGeneration;
