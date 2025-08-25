// src/pages/Unit.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Unit.css";

function Unit() {
  const [units, setUnits] = useState([]);
  const [newUnit, setNewUnit] = useState("");
  const [editingUnit, setEditingUnit] = useState(null);

  useEffect(() => { fetchUnits(); }, []);

  const fetchUnits = async () => {
    try {
      const res = await axios.get("/api/unit/");
      setUnits(res.data);
    } catch (err) { console.error(err); }
  };

  const handleCreate = async () => {
    try {
      await axios.post("/api/create_unit/", { name: newUnit });
      setNewUnit("");
      fetchUnits();
    } catch (err) { console.error(err); }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`/api/update_unit/${editingUnit.id}/`, { name: editingUnit.name });
      setEditingUnit(null);
      fetchUnits();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/delete_unit/${id}/`);
      fetchUnits();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="unit-container">
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
                      value={editingUnit.name} 
                      onChange={(e) => setEditingUnit({ ...editingUnit, name: e.target.value })} 
                    />
                  ) : u.name}
                </td>
                <td>
                  {editingUnit?.id === u.id ? (
                    <>
                      <button className="btn-save" onClick={handleUpdate}>ذخیره</button>
                      <button className="btn-cancel" onClick={() => setEditingUnit(null)}>انصراف</button>
                    </>
                  ) : (
                    <>
                      <button className="btn-edit" onClick={() => setEditingUnit(u)}>ویرایش</button>
                      <button className="btn-delete" onClick={() => handleDelete(u.id)}>حذف</button>
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
