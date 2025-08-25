import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Warehouse.css";

function Warehouse() {
  const [warehouses, setWarehouses] = useState([]);
  const [newWarehouse, setNewWarehouse] = useState("");
  const [editingWarehouse, setEditingWarehouse] = useState(null);

  useEffect(() => { fetchWarehouses(); }, []);

  const fetchWarehouses = async () => {
    try {
      const res = await axios.get("/api/warehouse/");
      setWarehouses(res.data);
    } catch (err) { console.error(err); }
  };

  const handleCreate = async () => {
    if (!newWarehouse.trim()) return;
    try {
      await axios.post("/api/create_warehouse/", { name: newWarehouse });
      setNewWarehouse("");
      fetchWarehouses();
    } catch (err) { console.error(err); }
  };

  const handleUpdate = async () => {
    if (!editingWarehouse.name.trim()) return;
    try {
      await axios.put(`/api/update_warehouse/${editingWarehouse.id}/`, {
        name: editingWarehouse.name,
      });
      setEditingWarehouse(null);
      fetchWarehouses();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("آیا مطمئن هستید می‌خواهید حذف کنید؟")) return;
    try {
      await axios.delete(`/api/delete_warehouse/${id}/`);
      fetchWarehouses();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="warehouse-container">
      <div className="header">
        <h2>مدیریت انبارها</h2>
        <div className="add-warehouse">
          <input
            type="text"
            placeholder="نام انبار جدید"
            value={newWarehouse}
            onChange={(e) => setNewWarehouse(e.target.value)}
          />
          <button className="btn-add" onClick={handleCreate}>افزودن</button>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="warehouse-table">
          <thead>
            <tr>
              <th>شناسه</th>
              <th>نام انبار</th>
              <th>عملیات</th>
            </tr>
          </thead>
          <tbody>
            {warehouses.map((w) => (
              <tr key={w.id}>
                <td>{w.id}</td>
                <td>
                  {editingWarehouse?.id === w.id ? (
                    <input
                      type="text"
                      value={editingWarehouse.name}
                      onChange={(e) => setEditingWarehouse({ ...editingWarehouse, name: e.target.value })}
                      className="edit-input"
                    />
                  ) : (
                    w.name
                  )}
                </td>
                <td>
                  {editingWarehouse?.id === w.id ? (
                    <>
                      <button className="btn-save" onClick={handleUpdate}>ذخیره</button>
                      <button className="btn-cancel" onClick={() => setEditingWarehouse(null)}>انصراف</button>
                    </>
                  ) : (
                    <>
                      <button className="btn-edit" onClick={() => setEditingWarehouse(w)}>ویرایش</button>
                      <button className="btn-delete" onClick={() => handleDelete(w.id)}>حذف</button>
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

export default Warehouse;
