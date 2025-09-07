import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Warehouse.css";

function Warehouse() {
  const [warehouses, setWarehouses] = useState([]);
  const [filteredWarehouses, setFilteredWarehouses] = useState([]);
  const [newWarehouseNumber, setNewWarehouseNumber] = useState("");
  const [newWarehouseName, setNewWarehouseName] = useState("");
  const [newWarehousePhone, setNewWarehousePhone] = useState("");
  const [editingWarehouse, setEditingWarehouse] = useState(null);
  const [search, setSearch] = useState("");
  const [alert, setAlert] = useState({ type: "", message: "" });

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchWarehouses();
    fetchNextNumber();
  }, []);

  useEffect(() => {
    // فیلتر بر اساس سرچ
    if (search.trim() === "") {
      setFilteredWarehouses(warehouses);
    } else {
      const filtered = warehouses.filter((w) =>
        Object.values(w).some((val) =>
          String(val).toLowerCase().includes(search.toLowerCase())
        )
      );
      setFilteredWarehouses(filtered);
    }
  }, [search, warehouses]);

  const showAlert = (type, message, timeout = 3000) => {
    setAlert({ type, message });
    setTimeout(() => setAlert({ type: "", message: "" }), timeout);
  };

  const fetchNextNumber = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/next-number/Warehouse/`);
      setNewWarehouseNumber(res.data.next_number.toString());
    } catch (err) {
      console.error(err);
      showAlert("danger", "خطا در دریافت شماره بعدی انبار");
      setNewWarehouseNumber("");
    }
  };

  const fetchWarehouses = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/warehouses/`);
      setWarehouses(res.data);
      setFilteredWarehouses(res.data);
    } catch (err) {
      console.error(err);
      showAlert("danger", "خطا در دریافت لیست انبارها");
    }
  };

  const handleCreate = async () => {
    if (!newWarehouseName.trim()) {
      showAlert("danger", "نام انبار نمی‌تواند خالی باشد");
      return;
    }
    try {
      await axios.post(`${API_URL}/api/warehouses/`, {
        number: newWarehouseNumber || null,
        name: newWarehouseName,
        phone: newWarehousePhone,
      });
      showAlert("success", "انبار جدید با موفقیت اضافه شد");
      setNewWarehouseName("");
      setNewWarehousePhone("");
      fetchNextNumber();
      fetchWarehouses();
    } catch (err) {
      console.error(err);
      showAlert("danger", "خطا در افزودن انبار");
    }
  };

  const handleUpdate = async () => {
    if (!editingWarehouse.name.trim()) {
      showAlert("danger", "نام انبار نمی‌تواند خالی باشد");
      return;
    }
    try {
      await axios.put(`${API_URL}/api/warehouses/${editingWarehouse.id}/`, {
        number: editingWarehouse.number,
        name: editingWarehouse.name,
        phone: editingWarehouse.phone,
      });
      showAlert("success", "ویرایش انبار با موفقیت انجام شد");
      setEditingWarehouse(null);
      fetchWarehouses();
    } catch (err) {
      console.error(err);
      showAlert("danger", "خطا در ویرایش انبار");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("آیا مطمئن هستید می‌خواهید حذف کنید؟")) return;
    try {
      await axios.delete(`${API_URL}/api/warehouses/${id}/`);
      showAlert("success", "انبار با موفقیت حذف شد");
      fetchWarehouses();
    } catch (err) {
      console.error(err);
      showAlert("danger", "خطا در حذف انبار");
    }
  };

  return (
    <div className="warehouse-container">
      <h2 className="text-center">مدیریت انبارها</h2>

      {/* Alert */}
      {alert.message && (
        <div className={`alert alert-${alert.type} my-2`} role="alert">
          {alert.message}
        </div>
      )}

      {/* سرچ */}
      <div className="search-bar mb-3">
        <input
          type="text"
          placeholder="جستجو در همه فیلدها..."
          className="form-control"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* فرم افزودن */}
      <div className="add-warehouse mb-4 d-flex gap-2">
        <input
          type="number"
          placeholder="شماره انبار"
          value={newWarehouseNumber}
          onChange={(e) => setNewWarehouseNumber(e.target.value)}
          className="form-control"
        />
        <input
          type="text"
          placeholder="نام انبار جدید"
          value={newWarehouseName}
          onChange={(e) => setNewWarehouseName(e.target.value)}
          className="form-control"
        />
        <input
          type="text"
          placeholder="تلفن انبار"
          value={newWarehousePhone}
          onChange={(e) => setNewWarehousePhone(e.target.value)}
          className="form-control"
        />
        <button className="btn btn-success" onClick={handleCreate}>
          افزودن
        </button>
      </div>

      {/* جدول */}
      <div className="table-wrapper">
        <table className="table table-striped table-bordered text-end">
          <thead className="table-primary text-center">
            <tr>
              <th>شماره انبار</th>
              <th>نام انبار</th>
              <th>تلفن</th>
              <th>عملیات</th>
            </tr>
          </thead>
          <tbody>
            {filteredWarehouses.map((w) => (
              <tr key={w.id}>
                <td>
                  {editingWarehouse?.id === w.id ? (
                    <input
                      type="text"
                      value={editingWarehouse.number}
                      onChange={(e) =>
                        setEditingWarehouse({ ...editingWarehouse, number: e.target.value })
                      }
                      className="form-control"
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
                        setEditingWarehouse({ ...editingWarehouse, name: e.target.value })
                      }
                      className="form-control"
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
                        setEditingWarehouse({ ...editingWarehouse, phone: e.target.value })
                      }
                      className="form-control"
                    />
                  ) : (
                    w.phone
                  )}
                </td>
                <td>
                  {editingWarehouse?.id === w.id ? (
                    <>
                      <button className="btn btn-primary btn-sm me-1" onClick={handleUpdate}>
                        ذخیره
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setEditingWarehouse(null)}
                      >
                        انصراف
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="btn btn-warning btn-sm me-1"
                        onClick={() => setEditingWarehouse(w)}
                      >
                        ویرایش
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
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
