import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance"; // جایگزین axios
import "../styles/ProductGroup.css";
import * as bootstrap from "bootstrap";

function ProductGroup() {
  const [groups, setGroups] = useState([]);
  const [newGroupNumber, setNewGroupNumber] = useState("");
  const [newGroup, setNewGroup] = useState("");
  const [editingGroup, setEditingGroup] = useState(null);
  const [error, setError] = useState("");
  const [newGroupError, setNewGroupError] = useState("");
  const [search, setSearch] = useState("");

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchGroups();
    fetchNextNumber();
  }, []);

  const fetchNextNumber = async () => {
    try {
      const res = await axiosInstance.get(`${API_URL}/api/next-number/ProductGroup/`);
      setNewGroupNumber(res.data.next_number.toString());
      setError("");
    } catch (err) {
      console.error(err);
      setError("خطا در گرفتن شماره گروه بعدی");
      setNewGroupNumber("");
    }
  };

  const fetchGroups = async () => {
    try {
      const res = await axiosInstance.get(`${API_URL}/api/product-groups/`);
      setGroups(res.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("خطا در دریافت گروه‌ها");
    }
  };

  const handleCreate = async () => {
    if (!newGroup.trim()) {
      setNewGroupError("نام گروه نمی‌تواند خالی باشد");
      return;
    }
    try {
      await axiosInstance.post(`${API_URL}/api/product-groups/`, {
        number: newGroupNumber || null,
        title: newGroup,
      });
      setNewGroup("");
      fetchNextNumber();
      fetchGroups();
      setNewGroupError("");
      setError("");
    } catch (err) {
      console.error(err);
      setNewGroupError("خطا در ایجاد گروه جدید");
    }
  };

  const closeModal = () => {
    const modalEl = document.getElementById("editGroupModal");
    const modalInstance = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
    modalInstance.hide();
    setEditingGroup(null);
  };

  const handleUpdate = async () => {
    if (!editingGroup?.title.trim()) {
      setError("نام گروه نمی‌تواند خالی باشد");
      return;
    }
    try {
      await axiosInstance.put(`${API_URL}/api/product-groups/${editingGroup.id}/`, {
        number: editingGroup.number,
        title: editingGroup.title,
      });

      // بستن مودال بعد از ذخیره
      closeModal();
      fetchGroups();
      setError("");
    } catch (err) {
      console.error(err);
      setError("خطا در بروزرسانی گروه");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("آیا مطمئن هستید می‌خواهید حذف کنید؟")) return;
    try {
      await axiosInstance.delete(`${API_URL}/api/product-groups/${id}/`);
      fetchGroups();
      setError("");
    } catch (err) {
      console.error(err);
      setError("خطا در حذف گروه");
    }
  };

  const filteredGroups = groups.filter(
    (g) =>
      g.title.toLowerCase().includes(search.toLowerCase()) ||
      g.number.toString().includes(search)
  );

  return (
    <div className="product-group-container">
      <div className="header text-center">
        <h2>مدیریت گروه کالا</h2>
      </div>

      {error && <p className="text-danger text-center">{error}</p>}

      <div className="form-section d-flex align-items-center gap-2 mb-3">
        <input
          type="text"
          className="form-input"
          placeholder="جستجو..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="form-section d-flex align-items-center gap-2 mb-3">
        <input
          type="number"
          className="form-input"
          placeholder="شماره گروه"
          value={newGroupNumber}
          onChange={(e) => setNewGroupNumber(e.target.value)}
          style={{ width: "80px" }}
        />
        <div style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          <input
            type="text"
            className="form-input"
            placeholder="نام گروه جدید..."
            value={newGroup}
            onChange={(e) => {
              setNewGroup(e.target.value);
              if (newGroupError) setNewGroupError("");
            }}
          />
          {newGroupError && <p className="text-danger mt-1">{newGroupError}</p>}
        </div>
        <button className="btn btn-add" onClick={handleCreate}>
          افزودن
        </button>
      </div>

      <div className="table-wrapper">
        <table className="custom-table">
          <thead>
            <tr>
              <th>شماره گروه</th>
              <th>نام گروه</th>
              <th>عملیات</th>
            </tr>
          </thead>
          <tbody>
            {filteredGroups.map((g) => (
              <tr key={g.id}>
                <td>{g.number}</td>
                <td>{g.title}</td>
                <td className="text-center">
                  <button
                    className="btn btn-edit"
                    onClick={() => {
                      setEditingGroup(g);
                      const modalEl = document.getElementById("editGroupModal");
                      const modalInstance = new bootstrap.Modal(modalEl);
                      modalInstance.show();
                    }}
                  >
                    ویرایش
                  </button>
                  <button
                    className="btn btn-delete"
                    onClick={() => handleDelete(g.id)}
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* مودال ویرایش */}
      <div
        className="modal fade"
        id="editGroupModal"
        tabIndex="-1"
        aria-labelledby="editGroupModalLabel"
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
              <h5 className="modal-title w-100 text-center" id="editGroupModalLabel">
                ویرایش گروه
              </h5>
            </div>
            <div className="modal-body">
              {editingGroup && (
                <div className="mb-3">
                  <label className="form-label">نام گروه</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editingGroup.title}
                    onChange={(e) =>
                      setEditingGroup({ ...editingGroup, title: e.target.value })
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

export default ProductGroup;
