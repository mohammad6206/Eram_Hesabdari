import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "../styles/TransportationType.css";
import * as bootstrap from 'bootstrap';

function TransportationType() {
  const [types, setTypes] = useState([]);
  const [newType, setNewType] = useState("");
  const [newTransportNumber, setNewTransportNumber] = useState("");
  const [editingType, setEditingType] = useState(null);
  const [searchText, setSearchText] = useState("");

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchTypes();
    fetchNextNumber();
  }, []);

  const fetchNextNumber = async () => {
    try {
      const res = await axiosInstance.get(`${API_URL}/api/next-number/TransportationType/`);
      setNewTransportNumber(res.data.next_number.toString());
    } catch (err) {
      console.error(err);
      setNewTransportNumber("");
    }
  };

  const fetchTypes = async () => {
    try {
      const res = await axiosInstance.get(`${API_URL}/api/transportation-types/`);
      setTypes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async () => {
    if (!newType.trim()) return;
    try {
      await axiosInstance.post(`${API_URL}/api/transportation-types/`, {
        number: newTransportNumber || null,
        title: newType,
      });
      setNewType("");
      fetchNextNumber();
      fetchTypes();
    } catch (err) {
      console.error(err);
    }
  };

  const closeModal = () => {
    const modalEl = document.getElementById("editTransportModal");
    const modalInstance = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
    modalInstance.hide();
    setEditingType(null);
  };

  const handleUpdate = async () => {
    if (!editingType?.title.trim()) return;
    try {
      await axiosInstance.put(`${API_URL}/api/transportation-types/${editingType.id}/`, {
        number: editingType.number,
        title: editingType.title,
      });
      closeModal();
      fetchTypes();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("آیا مطمئن هستید می‌خواهید حذف کنید؟")) return;
    try {
      await axiosInstance.delete(`${API_URL}/api/transportation-types/${id}/`);
      fetchTypes();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredTypes = types.filter(t => {
    const text = searchText.toLowerCase();
    return t.title.toLowerCase().includes(text) || String(t.number).includes(text);
  });

  return (
    <div className="page-container" dir="rtl">
      <h2 className="page-title text-end">مدیریت نوع حمل و نقل</h2>

      {/* جستجو */}
      <div className="form-section mb-3">
        <input
          type="text"
          className="form-input"
          placeholder="جستجو بر اساس شماره یا نام نوع حمل و نقل..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      {/* فرم افزودن */}
      <div className="form-section mb-3 d-flex gap-2">
        <input
          type="number"
          className="form-input"
          placeholder="شماره نوع حمل و نقل"
          value={newTransportNumber}
          onChange={(e) => setNewTransportNumber(e.target.value)}
          style={{ width: "80px" }}
        />
        <input
          type="text"
          className="form-input"
          placeholder="نوع حمل و نقل جدید"
          value={newType}
          onChange={(e) => setNewType(e.target.value)}
        />
        <button className="btn btn-add" onClick={handleCreate}>
          افزودن
        </button>
      </div>

      {/* جدول */}
      <div className="table-wrapper">
        <table className="custom-table">
          <thead>
            <tr>
              <th>شماره نوع حمل و نقل</th>
              <th>نوع حمل و نقل</th>
              <th>عملیات</th>
            </tr>
          </thead>
          <tbody>
            {filteredTypes.map((t) => (
              <tr key={t.id}>
                <td>{t.number}</td>
                <td>{t.title}</td>
                <td className="text-center">
                  <button
                    className="btn btn-edit"
                    onClick={() => {
                      setEditingType(t);
                      const modalEl = document.getElementById("editTransportModal");
                      const modalInstance = new bootstrap.Modal(modalEl);
                      modalInstance.show();
                    }}
                  >
                    ویرایش
                  </button>
                  <button
                    className="btn btn-delete"
                    onClick={() => handleDelete(t.id)}
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))}
            {filteredTypes.length === 0 && (
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
        id="editTransportModal"
        tabIndex="-1"
        aria-labelledby="editTransportModalLabel"
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
              <h5 className="modal-title w-100 text-center" id="editTransportModalLabel">
                ویرایش نوع حمل و نقل
              </h5>
            </div>
            <div className="modal-body">
              {editingType && (
                <div className="mb-3">
                  <label className="form-label">نوع حمل و نقل</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editingType.title}
                    onChange={(e) =>
                      setEditingType({ ...editingType, title: e.target.value })
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

export default TransportationType;
