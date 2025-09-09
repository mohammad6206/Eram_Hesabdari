import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance"; // جایگزین axios
import "../styles/Warehouse.css";
import * as bootstrap from 'bootstrap';


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
      const res = await axiosInstance.get(`${API_URL}/api/next-number/Warehouse/`);
      setNewWarehouseNumber(res.data.next_number.toString());
    } catch (err) {
      console.error(err);
      showAlert("danger", "خطا در دریافت شماره بعدی انبار");
      setNewWarehouseNumber("");
    }
  };

  const fetchWarehouses = async () => {
    try {
      const res = await axiosInstance.get(`${API_URL}/api/warehouses/`);
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
      await axiosInstance.post(`${API_URL}/api/warehouses/`, {
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
      await axiosInstance.put(`${API_URL}/api/warehouses/${editingWarehouse.id}/`, {
        number: editingWarehouse.number,
        name: editingWarehouse.name,
        phone: editingWarehouse.phone,
      });

      showAlert("success", "ویرایش انبار با موفقیت انجام شد");
      fetchWarehouses();

      const modalEl = document.getElementById("editWarehouseModal");
      const modalInstance = bootstrap.Modal.getInstance(modalEl);
      if (modalInstance) modalInstance.hide();

      // پاک کردن state بعد از بسته شدن مودال
      setEditingWarehouse(null);
    } catch (err) {
      console.error(err);
      showAlert("danger", "خطا در ویرایش انبار");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("آیا مطمئن هستید می‌خواهید حذف کنید؟")) return;
    try {
      await axiosInstance.delete(`${API_URL}/api/warehouses/${id}/`);
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

      {alert.message && (
        <div className={`alert alert-${alert.type} my-2`} role="alert">
          {alert.message}
        </div>
      )}

      <div className="search-bar mb-3">
        <input
          type="text"
          placeholder="جستجو در همه فیلدها..."
          className="form-control"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

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
                <td>{w.number}</td>
                <td>{w.name}</td>
                <td>{w.phone}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm "
                    onClick={() => {
                      setEditingWarehouse(w);
                      const modalEl = document.getElementById("editWarehouseModal");
                      const modalInstance = new bootstrap.Modal(modalEl);
                      modalInstance.show();
                    }}
                  >
                    ویرایش
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(w.id)}
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* مودال ویرایش */}
      <div
        className="modal fade"
        id="editWarehouseModal"
        tabIndex="-1"
        aria-labelledby="editWarehouseModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content" dir="rtl">
            <div className="modal-header">
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => setEditingWarehouse(null)}
              ></button>
              <h5
                className="modal-title w-100 text-center"
                id="editWarehouseModalLabel"
              >
                ویرایش انبار
              </h5>
            </div>
            <div className="modal-body">
              {editingWarehouse && (
                <>
                  <div className="mb-3">
                    <label className="form-label">نام انبار</label>
                    <input
                      className="form-control"
                      value={editingWarehouse.name}
                      onChange={(e) =>
                        setEditingWarehouse({
                          ...editingWarehouse,
                          name: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">تلفن انبار</label>
                    <input
                      className="form-control"
                      value={editingWarehouse.phone || ""}
                      onChange={(e) =>
                        setEditingWarehouse({
                          ...editingWarehouse,
                          phone: e.target.value,
                        })
                      }
                    />
                  </div>
                </>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={() => setEditingWarehouse(null)}
              >
                بستن
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleUpdate}
              >
                ذخیره تغییرات
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Warehouse;
