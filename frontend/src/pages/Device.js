import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/device.css";

function Device() {
  const [units, setUnits] = useState([]);
  const [newUnitNumber, setNewUnitNumber] = useState(""); 
  const [newUnitTitle, setNewUnitTitle] = useState("");
  const [editingUnit, setEditingUnit] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchUnits();
    fetchNextNumber();
  }, []);

  const fetchNextNumber = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/next-number/Device/`);
      setNewUnitNumber(res.data.next_number?.toString() || "");
    } catch (err) {
      console.error("Error fetching next number:", err);
      setNewUnitNumber("");
    }
  };

  const fetchUnits = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/devices/`);
      setUnits(res.data);
    } catch (err) {
      console.error("Error fetching units:", err);
    }
  };

  const handleCreate = async () => {
    if (!newUnitTitle.trim()) return;

    try {
      await axios.post(`${API_URL}/api/devices/`, {
        number: newUnitNumber || null,
        title: newUnitTitle.trim(),
      });
      setNewUnitTitle("");
      setNewUnitNumber("");
      fetchNextNumber();
      fetchUnits();
    } catch (err) {
      console.error("Error creating device:", err);
    }
  };

  const handleUpdate = async () => {
    if (!editingUnit || !editingUnit.title.trim()) return;

    try {
      await axios.put(`${API_URL}/api/devices/${editingUnit.id}/`, {
        number: editingUnit.number,
        title: editingUnit.title.trim(),
      });
      setEditingUnit(null);
      fetchUnits();
    } catch (err) {
      console.error("Error updating device:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("آیا مطمئن هستید می‌خواهید حذف کنید؟")) return;
    try {
      await axios.delete(`${API_URL}/api/devices/${id}/`);
      fetchUnits();
    } catch (err) {
      console.error("Error deleting device:", err);
    }
  };

  return (
    <div className="unit-container" dir="rtl">
      <h2 className="unit-title">مدیریت دستگاه‌ها</h2>

      <div className="unit-add">
        <input
          type="text"
          placeholder="شماره دستگاه"
          value={newUnitNumber}
          onChange={(e) => setNewUnitNumber(e.target.value)}
        />
        <input
          type="text"
          placeholder="عنوان دستگاه"
          value={newUnitTitle}
          onChange={(e) => setNewUnitTitle(e.target.value)}
        />
        <button onClick={handleCreate}>افزودن</button>
      </div>

      <div className="unit-table-wrapper">
        <table className="unit-table">
          <thead>
            <tr>
              <th>شماره دستگاه</th>
              <th>عنوان دستگاه</th>
              <th>عملیات</th>
            </tr>
          </thead>
          <tbody>
            {units.map((u) => (
              <tr key={u.id}>
                <td>
                  {editingUnit?.id === u.id ? (
                    <input
                      type="text"
                      value={editingUnit.number || ""}
                      onChange={(e) =>
                        setEditingUnit({ ...editingUnit, number: e.target.value })
                      }
                    />
                  ) : (
                    u.number
                  )}
                </td>
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
                      <button
                        className="btn-edit"
                        onClick={() => setEditingUnit(u)}
                      >
                        ویرایش
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(u.id)}
                      >
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

export default Device;
