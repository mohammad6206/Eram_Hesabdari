import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance"; // جایگزین axios
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import * as bootstrap from 'bootstrap';
import "../styles/device.css";

function Device() {
  const [units, setUnits] = useState([]);
  const [newUnitNumber, setNewUnitNumber] = useState(""); 
  const [newUnitTitle, setNewUnitTitle] = useState("");
  const [editingUnit, setEditingUnit] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [error, setError] = useState("");
  const [newUnitError, setNewUnitError] = useState("");

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchUnits();
    fetchNextNumber();
  }, []);

  const fetchNextNumber = async () => {
    try {
      const res = await axiosInstance.get(`${API_URL}/api/next-number/Device/`);
      setNewUnitNumber(res.data.next_number?.toString() || "");
      setError("");
    } catch (err) {
      console.error("Error fetching next number:", err);
      setNewUnitNumber("");
      setError("خطا در گرفتن شماره دستگاه بعدی");
    }
  };

  const fetchUnits = async () => {
    try {
      const res = await axiosInstance.get(`${API_URL}/api/devices/`);
      setUnits(res.data);
      setError("");
    } catch (err) {
      console.error("Error fetching units:", err);
      setError("خطا در دریافت دستگاه‌ها");
    }
  };

  const handleCreate = async () => {
    if (!newUnitTitle.trim()) {
      setNewUnitError("عنوان دستگاه نمی‌تواند خالی باشد");
      return;
    }
    try {
      await axiosInstance.post(`${API_URL}/api/devices/`, {
        number: newUnitNumber || null,
        title: newUnitTitle.trim(),
      });
      setNewUnitTitle("");
      fetchNextNumber();
      fetchUnits();
      setNewUnitError("");
      setError("");
    } catch (err) {
      console.error("Error creating device:", err);
      setNewUnitError("خطا در ایجاد دستگاه جدید");
    }
  };

  const closeModal = () => {
    const modalEl = document.getElementById("editDeviceModal");
    const modalInstance = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
    modalInstance.hide();
    setEditingUnit(null);
  };

  const handleUpdate = async () => {
    if (!editingUnit?.title.trim()) {
      setError("عنوان دستگاه نمی‌تواند خالی باشد");
      return;
    }
    try {
      await axiosInstance.put(`${API_URL}/api/devices/${editingUnit.id}/`, {
        number: editingUnit.number,
        title: editingUnit.title.trim(),
      });
      closeModal();
      fetchUnits();
      setError("");
    } catch (err) {
      console.error("Error updating device:", err);
      setError("خطا در بروزرسانی دستگاه");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("آیا مطمئن هستید می‌خواهید حذف کنید؟")) return;
    try {
      await axiosInstance.delete(`${API_URL}/api/devices/${id}/`);
      fetchUnits();
      setError("");
    } catch (err) {
      console.error("Error deleting device:", err);
      setError("خطا در حذف دستگاه");
    }
  };

  const filteredUnits = units.filter(u => {
    const text = searchText.toLowerCase();
    return (
      u.title.toLowerCase().includes(text) ||
      String(u.number).includes(text)
    );
  });

  return (
    <div className="unit-container" dir="rtl">
      <h2 className="unit-title text-center">مدیریت دستگاه‌ها</h2>

      {error && <p className="text-danger text-center">{error}</p>}

      {/* جستجو */}
      <div className="unit-add mb-3">
        <input
          type="text"
          placeholder="جستجو بر اساس شماره یا عنوان دستگاه..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      {/* فرم افزودن */}
      <div className="unit-add mb-3 d-flex gap-2">
        <input
          type="number"
          placeholder="شماره دستگاه"
          value={newUnitNumber}
          onChange={(e) => setNewUnitNumber(e.target.value)}
        />
        <input
          type="text"
          placeholder="عنوان دستگاه"
          value={newUnitTitle}
          onChange={(e) => {
            setNewUnitTitle(e.target.value);
            if (newUnitError) setNewUnitError("");
          }}
        />
        <button className="btn btn-add" onClick={handleCreate}>افزودن</button>
      </div>

      {/* جدول */}
      <div className="unit-table-wrapper">
        <table className="unit-table text-center">
          <thead>
            <tr>
              <th>شماره دستگاه</th>
              <th>عنوان دستگاه</th>
              <th>عملیات</th>
            </tr>
          </thead>
          <tbody>
            {filteredUnits.map(u => (
              <tr key={u.id}>
                <td>{u.number}</td>
                <td>{u.title}</td>
                <td className="text-center">
                  <button
                    className="btn btn-edit"
                    onClick={() => {
                      setEditingUnit(u);
                      const modalEl = document.getElementById("editDeviceModal");
                      const modalInstance = new bootstrap.Modal(modalEl);
                      modalInstance.show();
                    }}
                  >
                    ویرایش
                  </button>
                  <button
                    className="btn btn-delete"
                    onClick={() => handleDelete(u.id)}
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))}
            {filteredUnits.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center text-muted">
                  داده‌ای یافت نشد.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* مودال ویرایش */}
      <div
        className="modal fade"
        id="editDeviceModal"
        tabIndex="-1"
        aria-labelledby="editDeviceModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content" dir="rtl">
            <div className="modal-header">
              <button
                type="button"
                className="btn-close"
                onClick={closeModal}
              ></button>
              <h5 className="modal-title w-100 text-center" id="editDeviceModalLabel">
                ویرایش دستگاه
              </h5>
            </div>
            <div className="modal-body">
              {editingUnit && (
                <div className="mb-3">
                  <label className="form-label">عنوان دستگاه</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editingUnit.title}
                    onChange={(e) =>
                      setEditingUnit({ ...editingUnit, title: e.target.value })
                    }
                  />
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeModal}>
                بستن
              </button>
              <button className="btn btn-primary" onClick={handleUpdate}>
                ذخیره تغییرات
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Device;
