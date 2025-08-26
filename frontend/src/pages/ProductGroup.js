import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/ProductGroup.css";

function ProductGroup() {
  const [groups, setGroups] = useState([]);
  const [newGroup, setNewGroup] = useState("");
  const [editingGroup, setEditingGroup] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/product-groups/`);
      setGroups(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async () => {
    if (!newGroup.trim()) return;
    try {
      await axios.post(`${API_URL}/api/product-groups/`, { title: newGroup });
      setNewGroup("");
      fetchGroups();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async () => {
    if (!editingGroup?.title.trim()) return;
    try {
      await axios.put(`${API_URL}/api/product-groups/${editingGroup.id}/`, {
        title: editingGroup.title,
      });
      setEditingGroup(null);
      fetchGroups();
    } catch (err) {
      console.error(err);
    }
  };

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
              <th>شناسه</th>
              <th>نام گروه</th>
              <th>عملیات</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((g) => (
              <tr key={g.id}>
                <td>{g.id}</td>
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
