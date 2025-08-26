import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Warehouse.css";

function Warehouse() {
  const [warehouses, setWarehouses] = useState([]);
  const [newWarehouseName, setNewWarehouseName] = useState("");
  const [newWarehousePhone, setNewWarehousePhone] = useState("");
  const [editingWarehouse, setEditingWarehouse] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => { fetchWarehouses(); }, []);

  const fetchWarehouses = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/warehouses/`);
      setWarehouses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async () => {
    if (!newWarehouseName.trim()) return;

    try {
      await axios.post(`${API_URL}/api/warehouses/`, {
        name: newWarehouseName,
        phone: newWarehousePhone
      });
      setNewWarehouseName("");
      setNewWarehousePhone("");
      fetchWarehouses();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async () => {
    if (!editingWarehouse.name.trim()) return;

    try {
      await axios.put(`${API_URL}/api/warehouses/${editingWarehouse.id}/`, {
        code: editingWarehouse.code,
        name: editingWarehouse.name,
        phone: editingWarehouse.phone
      });
      setEditingWarehouse(null);
      fetchWarehouses();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("آیا مطمئن هستید می‌خواهید حذف کنید؟")) return;
    try {
      await axios.delete(`${API_URL}/api/warehouses/${id}/`);
      fetchWarehouses();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="warehouse-container">
      <div className="header">
        <h2>مدیریت انبارها</h2>
        <div className="add-warehouse">
          <input
            type="text"
            placeholder="نام انبار جدید"
            value={newWarehouseName}
            onChange={(e) => setNewWarehouseName(e.target.value)}
          />
          <input
            type="text"
            placeholder="تلفن انبار"
            value={newWarehousePhone}
            onChange={(e) => setNewWarehousePhone(e.target.value)}
          />
          <button className="btn-add" onClick={handleCreate}>افزودن</button>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="warehouse-table">
          <thead>
            <tr>
              <th>کد</th>
              <th>نام انبار</th>
              <th>تلفن</th>
              <th>عملیات</th>
            </tr>
          </thead>
          <tbody>
            {warehouses.map((w) => (
              <tr key={w.id}>
                <td>{w.code}</td>
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
                    <input
                      type="text"
                      value={editingWarehouse.phone || ""}
                      onChange={(e) => setEditingWarehouse({ ...editingWarehouse, phone: e.target.value })}
                      className="edit-input"
                    />
                  ) : (
                    w.phone
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
