// src/pages/ConsumptionType.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/ConsumptionType.css";

function ConsumptionType() {
  const [types, setTypes] = useState([]);
  const [newType, setNewType] = useState("");
  const [editingType, setEditingType] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchTypes();
  }, []);

  const fetchTypes = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/consumption-types/`);
      setTypes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async () => {
    if (!newType.trim()) return;
    try {
      await axios.post(`${API_URL}/api/consumption-types/`, { title: newType });
      setNewType("");
      fetchTypes();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async () => {
    if (!editingType?.title.trim()) return;
    try {
      await axios.put(`${API_URL}/api/consumption-types/${editingType.id}/`, {
        title: editingType.title,
      });
      setEditingType(null);
      fetchTypes();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("آیا مطمئن هستید می‌خواهید حذف کنید؟")) return;
    try {
      await axios.delete(`${API_URL}/api/consumption-types/${id}/`);
      fetchTypes();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="page-container" dir="rtl">
      <h2 className="page-title text-end">مدیریت نوع مصرف</h2>

      {/* فرم افزودن نوع مصرف */}
      <div className="form-inline justify-content-end mb-3">
        <input
          type="text"
          className="form-control text-end"
          placeholder="نوع مصرف جدید"
          value={newType}
          onChange={(e) => setNewType(e.target.value)}
        />
        <button className="btn btn-success ms-2" onClick={handleCreate}>
          افزودن
        </button>
      </div>

      {/* جدول */}
      <div className="table-responsive" dir="rtl">
        <table className="table table-striped table-dark custom-table text-end">
          <thead>
            <tr>
              <th className="text-end">شناسه</th>
              <th className="text-end">نوع مصرف</th>
              <th className="text-end">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {types.map((t) => (
              <tr key={t.id}>
                {/* شناسه */}
                <td className="text-end">{t.id}</td>

                {/* نوع مصرف */}
                <td className="text-end">
                  {editingType?.id === t.id ? (
                    <input
                      type="text"
                      value={editingType.title || ""}
                      className="form-control text-end"
                      onChange={(e) =>
                        setEditingType({ ...editingType, title: e.target.value })
                      }
                    />
                  ) : (
                    t.title
                  )}
                </td>

                {/* عملیات */}
                <td className="text-end">
                  {editingType?.id === t.id ? (
                    <>
                      <button
                        className="btn btn-primary btn-sm ms-1"
                        onClick={handleUpdate}
                      >
                        ذخیره
                      </button>
                      <button
                        className="btn btn-secondary btn-sm ms-1"
                        onClick={() => setEditingType(null)}
                      >
                        انصراف
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="btn btn-warning btn-sm ms-1"
                        onClick={() => setEditingType(t)}
                      >
                        ویرایش
                      </button>
                      <button
                        className="btn btn-danger btn-sm ms-1"
                        onClick={() => handleDelete(t.id)}
                      >
                        حذف
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}

            {types.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center text-muted">
                  هیچ نوع مصرفی ثبت نشده است.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ConsumptionType;
