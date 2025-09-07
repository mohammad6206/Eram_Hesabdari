import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/ProductGroup.css";

function ProductGroup() {
  const [groups, setGroups] = useState([]);
  const [newGroupNumber, setNewGroupNumber] = useState(""); // شماره اتوماتیک
  const [newGroup, setNewGroup] = useState("");
  const [editingGroup, setEditingGroup] = useState(null);

  const [error, setError] = useState(""); // ارور کلی
  const [newGroupError, setNewGroupError] = useState(""); // ارور فیلد جدید
  const [search, setSearch] = useState(""); // برای جستجو

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchGroups();
    fetchNextNumber();
  }, []);

  const fetchNextNumber = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/next-number/ProductGroup/`);
      setNewGroupNumber(res.data.next_number.toString());
      setError("");
    } catch (err) {
      console.error(err);
      setError("خطا در گرفتن شماره گروه بعدی");
      setNewGroupNumber("");
    }
  };

  const fetchGroups = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/product-groups/`);
      setGroups(res.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("خطا در دریافت گروه‌ها");
    }
  };

  const handleCreate = async () => {
    if (!newGroup.trim()) {
      setNewGroupError("نام گروه نمی‌تواند خالی باشد");
      return;
    }
    try {
      await axios.post(`${API_URL}/api/product-groups/`, {
        number: newGroupNumber || null,
        title: newGroup,
      });
      setNewGroup("");
      fetchNextNumber();
      fetchGroups();
      setNewGroupError("");
      setError("");
    } catch (err) {
      console.error(err);
      setNewGroupError("خطا در ایجاد گروه جدید");
    }
  };

  const handleUpdate = async () => {
    if (!editingGroup?.title.trim()) {
      setError("نام گروه نمی‌تواند خالی باشد");
      return;
    }
    try {
      await axios.put(`${API_URL}/api/product-groups/${editingGroup.id}/`, {
        number: editingGroup.number,
        title: editingGroup.title,
      });
      setEditingGroup(null);
      fetchGroups();
      setError("");
    } catch (err) {
      console.error(err);
      setError("خطا در بروزرسانی گروه");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("آیا مطمئن هستید می‌خواهید حذف کنید؟")) return;
    try {
      await axios.delete(`${API_URL}/api/product-groups/${id}/`);
      fetchGroups();
      setError("");
    } catch (err) {
      console.error(err);
      setError("خطا در حذف گروه");
    }
  };

  // فیلتر گروه‌ها بر اساس جستجو
  const filteredGroups = groups.filter(
    (g) =>
      g.title.toLowerCase().includes(search.toLowerCase()) ||
      g.number.toString().includes(search)
  );

  return (
    <div className="product-group-container">
      {/* هدر */}
      <div className="header text-center">
        <h2>مدیریت گروه کالا</h2>
      </div>

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

      {/* فرم افزودن گروه جدید */}
      <div className="form-section d-flex align-items-center gap-2 mb-3">
        {/* شماره گروه کوچک */}
        <input
          type="number"
          className="form-input"
          placeholder="شماره گروه"
          value={newGroupNumber}
          onChange={(e) => setNewGroupNumber(e.target.value)}
          style={{ width: "80px" }}
        />

        {/* نام گروه بزرگ */}
        <div style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          <input
            type="text"
            className="form-input"
            placeholder="نام گروه جدید..."
            value={newGroup}
            onChange={(e) => {
              setNewGroup(e.target.value);
              if (newGroupError) setNewGroupError("");
            }}
            style={{ width: "100%" }}
          />
          {newGroupError && <p className="text-danger mt-1">{newGroupError}</p>}
        </div>

        {/* دکمه افزودن */}
        <button className="btn btn-add" onClick={handleCreate}>
          افزودن
        </button>
      </div>

      {/* جدول گروه‌ها */}
      <div className="table-wrapper">
        <table className="custom-table">
          <thead>
            <tr>
              <th>شماره گروه</th>
              <th>نام گروه</th>
              <th>عملیات</th>
            </tr>
          </thead>
          <tbody>
            {filteredGroups.map((g) => (
              <tr key={g.id}>
                <td>
                  {editingGroup?.id === g.id ? (
                    <input
                      type="number"
                      className="edit-input"
                      value={editingGroup.number}
                      onChange={(e) =>
                        setEditingGroup({ ...editingGroup, number: e.target.value })
                      }
                    />
                  ) : (
                    g.number
                  )}
                </td>
                <td>
                  {editingGroup?.id === g.id ? (
                    <input
                      type="text"
                      className="edit-input"
                      value={editingGroup.title || ""}
                      onChange={(e) =>
                        setEditingGroup({ ...editingGroup, title: e.target.value })
                      }
                    />
                  ) : (
                    g.title
                  )}
                </td>
                <td>
                  {editingGroup?.id === g.id ? (
                    <>
                      <button className="btn btn-save" onClick={handleUpdate}>
                        ذخیره
                      </button>
                      <button
                        className="btn btn-cancel"
                        onClick={() => setEditingGroup(null)}
                      >
                        انصراف
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="btn btn-edit"
                        onClick={() => setEditingGroup(g)}
                      >
                        ویرایش
                      </button>
                      <button
                        className="btn btn-delete"
                        onClick={() => handleDelete(g.id)}
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

export default ProductGroup;
