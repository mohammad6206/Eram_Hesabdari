import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Unit.css";

function Unit() {
  const [units, setUnits] = useState([]);
  const [newUnitNumber, setNewUnitNumber] = useState(""); // شماره اتوماتیک
  const [newUnitTitle, setNewUnitTitle] = useState("");
  const [editingUnit, setEditingUnit] = useState(null);

  const [error, setError] = useState(""); // ارور کلی
  const [newUnitError, setNewUnitError] = useState(""); // ارور فیلد جدید
  const [search, setSearch] = useState(""); // برای جستجو

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchUnits();
    fetchNextNumber();
  }, []);

  const fetchNextNumber = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/next-number/Unit/`);
      setNewUnitNumber(res.data.next_number.toString());
      setError("");
    } catch (err) {
      console.error(err);
      setError("خطا در گرفتن شماره واحد بعدی");
      setNewUnitNumber("");
    }
  };

  const fetchUnits = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/units/`);
      setUnits(res.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("خطا در دریافت واحدها");
    }
  };

  const handleCreate = async () => {
    if (!newUnitTitle.trim()) {
      setNewUnitError("نام واحد نمی‌تواند خالی باشد");
      return;
    }
    try {
      await axios.post(`${API_URL}/api/units/`, {
        number: newUnitNumber || null,
        title: newUnitTitle,
      });
      setNewUnitTitle("");
      fetchNextNumber();
      fetchUnits();
      setNewUnitError("");
      setError("");
    } catch (err) {
      console.error(err);
      setNewUnitError("خطا در ایجاد واحد جدید");
    }
  };

  const handleUpdate = async () => {
    if (!editingUnit?.title.trim()) {
      setError("نام واحد نمی‌تواند خالی باشد");
      return;
    }
    try {
      await axios.put(`${API_URL}/api/units/${editingUnit.id}/`, {
        number: editingUnit.number,
        title: editingUnit.title,
      });
      setEditingUnit(null);
      fetchUnits();
      setError("");
    } catch (err) {
      console.error(err);
      setError("خطا در بروزرسانی واحد");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("آیا مطمئن هستید می‌خواهید حذف کنید؟")) return;
    try {
      await axios.delete(`${API_URL}/api/units/${id}/`);
      fetchUnits();
      setError("");
    } catch (err) {
      console.error(err);
      setError("خطا در حذف واحد");
    }
  };

  // فیلتر واحدها بر اساس جستجو
  const filteredUnits = units.filter(
    (u) =>
      u.title.toLowerCase().includes(search.toLowerCase()) ||
      u.number.toString().includes(search)
  );

  return (
    <div className="unit-container" dir="rtl">
      <h2 className="text-center">مدیریت واحدها</h2>

      {/* ارور کلی */}
      {error && <p className="text-danger text-center">{error}</p>}

      {/* بخش جستجو */}
      <div className="form-section d-flex align-items-center gap-2 mb-3">
        <input
          type="text"
          className="form-input"
          placeholder="جستجو..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* فرم افزودن واحد جدید */}
      <div className="form-section d-flex align-items-center gap-2 mb-3">
        {/* شماره واحد کوچک */}
        <input
          type="number"
          className="form-input"
          placeholder="شماره واحد"
          value={newUnitNumber}
          onChange={(e) => setNewUnitNumber(e.target.value)}
          style={{ width: "80px" }}
        />

        {/* نام واحد بزرگ */}
        <div style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          <input
            type="text"
            className="form-input"
            placeholder="نام واحد جدید..."
            value={newUnitTitle}
            onChange={(e) => {
              setNewUnitTitle(e.target.value);
              if (newUnitError) setNewUnitError("");
            }}
            style={{ width: "100%" }}
          />
          {newUnitError && <p className="text-danger mt-1">{newUnitError}</p>}
        </div>

        {/* دکمه افزودن */}
        <button className="btn btn-add" onClick={handleCreate}>
          افزودن
        </button>
      </div>

      {/* جدول واحدها */}
      <div className="unit-table-wrapper">
        <table className="unit-table">
          <thead>
            <tr>
              <th>شماره واحد</th>
              <th>نام واحد</th>
              <th>عملیات</th>
            </tr>
          </thead>
          <tbody>
            {filteredUnits.map((u) => (
              <tr key={u.id}>
                <td>
                  {editingUnit?.id === u.id ? (
                    <input
                      type="number"
                      className="edit-input"
                      value={editingUnit.number}
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
                      className="edit-input"
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
                      <button className="btn btn-save" onClick={handleUpdate}>
                        ذخیره
                      </button>
                      <button
                        className="btn btn-cancel"
                        onClick={() => setEditingUnit(null)}
                      >
                        انصراف
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="btn btn-edit"
                        onClick={() => setEditingUnit(u)}
                      >
                        ویرایش
                      </button>
                      <button
                        className="btn btn-delete"
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

export default Unit;
