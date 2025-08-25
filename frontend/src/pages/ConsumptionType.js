// src/pages/ConsumptionType.js
import React, { useState, useEffect } from "react";
import axios from "axios";

function ConsumptionType() {
  const [types, setTypes] = useState([]);
  const [newType, setNewType] = useState("");
  const [editingType, setEditingType] = useState(null);

  useEffect(() => { fetchTypes(); }, []);

  const fetchTypes = async () => {
    try {
      const res = await axios.get("/api/consumption_type/");
      setTypes(res.data);
    } catch (err) { console.error(err); }
  };

  const handleCreate = async () => {
    try {
      await axios.post("/api/create_consumption_type/", { name: newType });
      setNewType("");
      fetchTypes();
    } catch (err) { console.error(err); }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`/api/update_consumption_type/${editingType.id}/`, {
        name: editingType.name,
      });
      setEditingType(null);
      fetchTypes();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/delete_consumption_type/${id}/`);
      fetchTypes();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="container mt-4">
      <h2>مدیریت نوع مصرف</h2>
      <div className="mb-3 d-flex">
        <input type="text" className="form-control" placeholder="نوع مصرف جدید"
          value={newType} onChange={(e) => setNewType(e.target.value)} />
        <button className="btn btn-success ms-2" onClick={handleCreate}>افزودن</button>
      </div>

      <table className="table table-dark table-striped">
        <thead><tr><th>شناسه</th><th>نوع مصرف</th><th>عملیات</th></tr></thead>
        <tbody>
          {types.map((t) => (
            <tr key={t.id}>
              <td>{t.id}</td>
              <td>
                {editingType?.id === t.id ? (
                  <input type="text" value={editingType.name}
                    onChange={(e) => setEditingType({ ...editingType, name: e.target.value })} />
                ) : (t.name)}
              </td>
              <td>
                {editingType?.id === t.id ? (
                  <>
                    <button className="btn btn-primary btn-sm me-2" onClick={handleUpdate}>ذخیره</button>
                    <button className="btn btn-secondary btn-sm" onClick={() => setEditingType(null)}>انصراف</button>
                  </>
                ) : (
                  <>
                    <button className="btn btn-warning btn-sm me-2" onClick={() => setEditingType(t)}>ویرایش</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(t.id)}>حذف</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default ConsumptionType;
