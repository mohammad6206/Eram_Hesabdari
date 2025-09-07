import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/ConsumptionType.css";

function ConsumptionType() {
  const [types, setTypes] = useState([]);
  const [newType, setNewType] = useState("");
  const [newConsumptionTypeNumber, setNewConsumptionTypeNumber] = useState(""); // شماره اتوماتیک
  const [editingType, setEditingType] = useState(null);
  const [searchText, setSearchText] = useState(""); // 🔹 اضافه شد

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchTypes();
    fetchNextNumber();
  }, []);

  const fetchNextNumber = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/next-number/ConsumptionType/`);
      setNewConsumptionTypeNumber(res.data.next_number.toString());
    } catch (err) {
      console.error(err);
      setNewConsumptionTypeNumber("");
    }
  };

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
      await axios.post(`${API_URL}/api/consumption-types/`, {
        number: newConsumptionTypeNumber || null,
        title: newType,
      });
      setNewType("");
      fetchNextNumber();
      fetchTypes();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async () => {
    if (!editingType?.title.trim()) return;
    try {
      await axios.put(`${API_URL}/api/consumption-types/${editingType.id}/`, {
        number: editingType.number,
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

  // 🔹 فیلتر بر اساس جستجو
  const filteredTypes = types.filter(t => {
    const text = searchText.toLowerCase();
    return (
      t.title.toLowerCase().includes(text) ||
      String(t.number).includes(text)
    );
  });

  return (
    <div className="page-container" dir="rtl">
      <h2 className="page-title text-end">مدیریت نوع مصرف</h2>

      {/* 🔍 جستجو */}
      <div className="form-section" style={{ marginBottom: "15px" }}>
        <input
          type="text"
          className="form-input"
          placeholder="جستجو بر اساس شماره یا نام نوع مصرف..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      {/* فرم افزودن نوع مصرف */}
      <div className="form-section">
        <input
          type="number"
          className="form-input"
          placeholder="شماره نوع مصرف"
          value={newConsumptionTypeNumber}
          onChange={(e) => setNewConsumptionTypeNumber(e.target.value)}
        />
        <input
          type="text"
          className="form-input"
          placeholder="نوع مصرف جدید"
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
              <th>شماره نوع مصرف</th>
              <th>نوع مصرف</th>
              <th>عملیات</th>
            </tr>
          </thead>
          <tbody>
            {filteredTypes.map((t) => (
              <tr key={t.id}>
                <td>{t.number}</td>
                <td>
                  {editingType?.id === t.id ? (
                    <input
                      type="text"
                      className="edit-input"
                      value={editingType.title || ""}
                      onChange={(e) =>
                        setEditingType({ ...editingType, title: e.target.value })
                      }
                    />
                  ) : (
                    t.title
                  )}
                </td>
                <td>
                  {editingType?.id === t.id ? (
                    <>
                      <button className="btn btn-save" onClick={handleUpdate}>
                        ذخیره
                      </button>
                      <button
                        className="btn btn-cancel"
                        onClick={() => setEditingType(null)}
                      >
                        انصراف
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="btn btn-edit"
                        onClick={() => setEditingType(t)}
                      >
                        ویرایش
                      </button>
                      <button
                        className="btn btn-delete"
                        onClick={() => handleDelete(t.id)}
                      >
                        حذف
                      </button>
                    </>
                  )}
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
    </div>
  );
}

export default ConsumptionType;
