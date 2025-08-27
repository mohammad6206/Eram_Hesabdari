import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/ProductGroup.css";

function ProductGroup() {
  const [groups, setGroups] = useState([]);
  const [newGroupNumber, setNewGroupNumber] = useState(""); // شماره اتوماتیک
  const [newGroup, setNewGroup] = useState("");
  const [editingGroup, setEditingGroup] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL;

  // --- هنگام mount صفحه، لیست و شماره بعدی را بگیر
  useEffect(() => {
    fetchGroups();
    fetchNextNumber();
  }, []);

  // --- گرفتن شماره بعدی از سرور
  const fetchNextNumber = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/next-number/ProductGroup/`);
      setNewGroupNumber(res.data.next_number.toString());
    } catch (err) {
      console.error("Error fetching next number:", err);
      setNewGroupNumber("");
    }
  };

  // --- گرفتن لیست گروه‌ها
  const fetchGroups = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/product-groups/`);
      setGroups(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // --- ایجاد رکورد جدید
  const handleCreate = async () => {
    if (!newGroup.trim()) return;
    try {
      await axios.post(`${API_URL}/api/product-groups/`, {
        number: newGroupNumber || null, // اگر کاربر خالی گذاشت، سرور خودش شماره میده
        title: newGroup,
      });
      setNewGroup("");
      fetchNextNumber(); // شماره بعدی دوباره از سرور گرفته شود
      fetchGroups();
    } catch (err) {
      console.error(err);
    }
  };

  // --- ویرایش رکورد
  const handleUpdate = async () => {
    if (!editingGroup?.title.trim()) return;
    try {
      await axios.put(`${API_URL}/api/product-groups/${editingGroup.id}/`, {
        number: editingGroup.number,
        title: editingGroup.title,
      });
      setEditingGroup(null);
      fetchGroups();
    } catch (err) {
      console.error(err);
    }
  };

  // --- حذف رکورد
  const handleDelete = async (id) => {
    if (!window.confirm("آیا مطمئن هستید می‌خواهید حذف کنید؟")) return;
    try {
      await axios.delete(`${API_URL}/api/product-groups/${id}/`);
      fetchGroups();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="product-group-container">
      <div className="header">
        <h2>مدیریت گروه کالا</h2>
      </div>
      {/* فرم افزودن گروه */}
      <div className="form-section">
        <input
          type="number"
          className="form-input"
          placeholder="شماره گروه"
          value={newGroupNumber}
          onChange={(e) => setNewGroupNumber(e.target.value)}
        />
        <input
          type="text"
          className="form-input"
          placeholder="نام گروه جدید..."
          value={newGroup}
          onChange={(e) => setNewGroup(e.target.value)}
        />
        <button className="btn btn-add" onClick={handleCreate}>
          افزودن
        </button>
      </div>

      {/* جدول */}
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
            {groups.map((g) => (
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
                      <button className="btn btn-edit" onClick={() => setEditingGroup(g)}>
                        ویرایش
                      </button>
                      <button className="btn btn-delete" onClick={() => handleDelete(g.id)}>
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
