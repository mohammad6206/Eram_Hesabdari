import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Unit.css";

function Unit() {
  const [units, setUnits] = useState([]);
  const [newUnit, setNewUnit] = useState("");
  const [editingUnit, setEditingUnit] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchUnits();
  }, []);

  const fetchUnits = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/units/`);
      setUnits(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async () => {
    if (!newUnit.trim()) return;
    try {
      await axios.post(`${API_URL}/api/units/`, { title: newUnit });
      setNewUnit("");
      fetchUnits();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async () => {
    if (!editingUnit?.title.trim()) return;
    try {
      await axios.put(`${API_URL}/api/units/${editingUnit.id}/`, {
        title: editingUnit.title,
      });
      setEditingUnit(null);
      fetchUnits();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("آیا مطمئن هستید می‌خواهید حذف کنید؟")) return;
    try {
      await axios.delete(`${API_URL}/api/units/${id}/`);
      fetchUnits();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="unit-container" dir="rtl">
      <h2 className="unit-title">مدیریت واحدها</h2>

      <div className="unit-add">
        <input
          type="text"
          placeholder="نام واحد جدید"
          value={newUnit}
          onChange={(e) => setNewUnit(e.target.value)}
        />
        <button onClick={handleCreate}>افزودن</button>
      </div>

      <div className="unit-table-wrapper">
        <table className="unit-table">
          <thead>
            <tr>
              <th>شناسه</th>
              <th>نام واحد</th>
              <th>عملیات</th>
            </tr>
          </thead>
          <tbody>
            {units.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>
                  {editingUnit?.id === u.id ? (
                    <input
                      type="text"
                      value={editingUnit.title || ""}
                      onChange={(e) =>
                        setEditingUnit({ ...editingUnit, title: e.target.value })
                      }
                    />
                  ) : (
                    u.title
                  )}
                </td>
                <td>
                  {editingUnit?.id === u.id ? (
                    <>
                      <button className="btn-save" onClick={handleUpdate}>
                        ذخیره
                      </button>
                      <button
                        className="btn-cancel"
                        onClick={() => setEditingUnit(null)}
                      >
                        انصراف
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="btn-edit" onClick={() => setEditingUnit(u)}>
                        ویرایش
                      </button>
                      <button className="btn-delete" onClick={() => handleDelete(u.id)}>
                        حذف
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Unit;
