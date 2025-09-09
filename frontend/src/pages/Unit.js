import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance"; // جایگزین axios
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "../styles/Unit.css";
import * as bootstrap from 'bootstrap';

function Unit() {
  const [units, setUnits] = useState([]);
  const [newUnitNumber, setNewUnitNumber] = useState("");
  const [newUnitTitle, setNewUnitTitle] = useState("");
  const [editingUnit, setEditingUnit] = useState(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [newUnitError, setNewUnitError] = useState("");

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchUnits();
    fetchNextNumber();
  }, []);

  const fetchNextNumber = async () => {
    try {
      const res = await axiosInstance.get(`${API_URL}/api/next-number/Unit/`);
      setNewUnitNumber(res.data.next_number.toString());
      setError("");
    } catch (err) {
      console.error(err);
      setError("خطا در گرفتن شماره واحد بعدی");
      setNewUnitNumber("");
    }
  };

  const fetchUnits = async () => {
    try {
      const res = await axiosInstance.get(`${API_URL}/api/units/`);
      setUnits(res.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("خطا در دریافت واحدها");
    }
  };

  const handleCreate = async () => {
    if (!newUnitTitle.trim()) {
      setNewUnitError("نام واحد نمی‌تواند خالی باشد");
      return;
    }
    try {
      await axiosInstance.post(`${API_URL}/api/units/`, {
        number: newUnitNumber || null,
        title: newUnitTitle,
      });
      setNewUnitTitle("");
      fetchNextNumber();
      fetchUnits();
      setNewUnitError("");
      setError("");
    } catch (err) {
      console.error(err);
      setNewUnitError("خطا در ایجاد واحد جدید");
    }
  };

  // تابع بستن مودال
  const closeModal = () => {
    const modalEl = document.getElementById("editUnitModal");
    const modalInstance = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
    modalInstance.hide();
    setEditingUnit(null);
  };

  const handleUpdate = async () => {
    if (!editingUnit?.title.trim()) {
      setError("نام واحد نمی‌تواند خالی باشد");
      return;
    }
    try {
      await axiosInstance.put(`${API_URL}/api/units/${editingUnit.id}/`, {
        number: editingUnit.number,
        title: editingUnit.title,
      });
      closeModal();
      fetchUnits();
      setError("");
    } catch (err) {
      console.error(err);
      setError("خطا در بروزرسانی واحد");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("آیا مطمئن هستید می‌خواهید حذف کنید؟")) return;
    try {
      await axiosInstance.delete(`${API_URL}/api/units/${id}/`);
      fetchUnits();
      setError("");
    } catch (err) {
      console.error(err);
      setError("خطا در حذف واحد");
    }
  };

  const filteredUnits = units.filter(
    (u) =>
      u.title.toLowerCase().includes(search.toLowerCase()) ||
      u.number.toString().includes(search)
  );

  return (
    <div className="unit-container" dir="rtl">
      <h2 className="text-center">مدیریت واحدها</h2>

      {error && <p className="text-danger text-center">{error}</p>}

      {/* جستجو */}
      <div className="form-section d-flex gap-2 mb-3">
        <input
          type="text"
          className="form-input"
          placeholder="جستجو بر اساس شماره یا نام واحد..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* فرم افزودن واحد جدید */}
      <div className="form-section d-flex gap-2 mb-3">
        <input
          type="number"
          className="form-input"
          placeholder="شماره واحد"
          value={newUnitNumber}
          onChange={(e) => setNewUnitNumber(e.target.value)}
          style={{ width: "80px" }}
        />
        <input
          type="text"
          className="form-input"
          placeholder="واحد جدید"
          value={newUnitTitle}
          onChange={(e) => {
            setNewUnitTitle(e.target.value);
            if (newUnitError) setNewUnitError("");
          }}
        />
        <button className="btn btn-add" onClick={handleCreate}>
          افزودن
        </button>
      </div>

      {/* جدول واحدها */}
      <div className="unit-table-wrapper">
        <table className="unit-table text-center">
          <thead>
            <tr>
              <th>شماره واحد</th>
              <th>نام واحد</th>
              <th>عملیات</th>
            </tr>
          </thead>
          <tbody>
            {filteredUnits.map((u) => (
              <tr key={u.id}>
                <td>{u.number}</td>
                <td>{u.title}</td>
                <td className="text-center">
                  <button
                    className="btn btn-edit"
                    onClick={() => {
                      setEditingUnit(u);
                      const modalEl = document.getElementById("editUnitModal");
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
        id="editUnitModal"
        tabIndex="-1"
        aria-labelledby="editUnitModalLabel"
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
              <h5 className="modal-title w-100 text-center" id="editUnitModalLabel">
                ویرایش واحد
              </h5>
            </div>
            <div className="modal-body">
              {editingUnit && (
                <div className="mb-3">
                  <label className="form-label">نام واحد</label>
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
              <button
                type="button"
                className="btn btn-secondary"
                onClick={closeModal}
              >
                بستن
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleUpdate}
              >
                ذخیره تغییرات
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Unit;
