import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Warehouse.css";

function Warehouse() {
  const [warehouses, setWarehouses] = useState([]);
  const [newWarehouseNumber, setNewWarehouseNumber] = useState("");
  const [newWarehouseName, setNewWarehouseName] = useState("");
  const [newWarehousePhone, setNewWarehousePhone] = useState("");
  const [editingWarehouse, setEditingWarehouse] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL;

  // --- هنگام mount صفحه، لیست و شماره بعدی را بگیر
  useEffect(() => {
    fetchWarehouses();
    fetchNextNumber();
  }, []);

  const fetchNextNumber = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/next-number/Warehouse/`);
      setNewWarehouseNumber(res.data.next_number.toString());
    } catch (err) {
      console.error(err);
      setNewWarehouseNumber("");
    }
  };


  // --- گرفتن لیست انبارها
  const fetchWarehouses = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/warehouses/`);
      setWarehouses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // --- ایجاد رکورد جدید
  const handleCreate = async () => {
    if (!newWarehouseName.trim()) return;

    try {
      await axios.post(`${API_URL}/api/warehouses/`, {
        number: newWarehouseNumber || null,
        name: newWarehouseName,
        phone: newWarehousePhone,
      });

      // ریست فرم و گرفتن شماره بعدی
      setNewWarehouseName("");
      setNewWarehousePhone("");
      fetchNextNumber(); // شماره بعدی
      fetchWarehouses(); // لیست به‌روز

    } catch (err) {
      console.error(err);
    }
  };

  // --- ویرایش رکورد
  const handleUpdate = async () => {
    if (!editingWarehouse.name.trim()) return;

    try {
      await axios.put(`${API_URL}/api/warehouses/${editingWarehouse.id}/`, {
        number: editingWarehouse.number,
        code: editingWarehouse.code,
        name: editingWarehouse.name,
        phone: editingWarehouse.phone,
      });
      setEditingWarehouse(null);
      fetchWarehouses();
    } catch (err) {
      console.error(err);
    }
  };

  // --- حذف رکورد
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
          {/* شماره اتوماتیک ولی قابل تغییر */}
          <input
            type="number"
            placeholder="شماره انبار"
            value={newWarehouseNumber}
            onChange={(e) => setNewWarehouseNumber(e.target.value)}
          />
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
          <button className="btn-add" onClick={handleCreate}>
            افزودن
          </button>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="warehouse-table">
          <thead>
            <tr>
              <th>شماره انبار</th>
              <th>نام انبار</th>
              <th>تلفن</th>
              <th>عملیات</th>
            </tr>
          </thead>
          <tbody>
            {warehouses.map((w) => (
              <tr key={w.id}>
                <td>
                  {editingWarehouse?.id === w.id ? (
                    <input
                      type="text"
                      value={editingWarehouse.number}
                      onChange={(e) =>
                        setEditingWarehouse({
                          ...editingWarehouse,
                          number: e.target.value,
                        })
                      }
                      className="edit-input"
                    />
                  ) : (
                    w.number
                  )}
                </td>
                <td>
                  {editingWarehouse?.id === w.id ? (
                    <input
                      type="text"
                      value={editingWarehouse.name}
                      onChange={(e) =>
                        setEditingWarehouse({
                          ...editingWarehouse,
                          name: e.target.value,
                        })
                      }
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
                      onChange={(e) =>
                        setEditingWarehouse({
                          ...editingWarehouse,
                          phone: e.target.value,
                        })
                      }
                      className="edit-input"
                    />
                  ) : (
                    w.phone
                  )}
                </td>
                <td>
                  {editingWarehouse?.id === w.id ? (
                    <>
                      <button className="btn-save" onClick={handleUpdate}>
                        ذخیره
                      </button>
                      <button
                        className="btn-cancel"
                        onClick={() => setEditingWarehouse(null)}
                      >
                        انصراف
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="btn-edit"
                        onClick={() => setEditingWarehouse(w)}
                      >
                        ویرایش
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(w.id)}
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

export default Warehouse;
