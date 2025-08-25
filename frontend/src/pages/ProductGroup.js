// src/pages/ProductGroup.js
import React, { useState, useEffect } from "react";
import axios from "axios";

function ProductGroup() {
  const [groups, setGroups] = useState([]);
  const [newGroup, setNewGroup] = useState("");
  const [editingGroup, setEditingGroup] = useState(null);

  useEffect(() => { fetchGroups(); }, []);

  const fetchGroups = async () => {
    try {
      const res = await axios.get("/api/product_group/");
      setGroups(res.data);
    } catch (err) { console.error(err); }
  };

  const handleCreate = async () => {
    try {
      await axios.post("/api/create_product_group/", { name: newGroup });
      setNewGroup("");
      fetchGroups();
    } catch (err) { console.error(err); }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`/api/update_product_group/${editingGroup.id}/`, {
        name: editingGroup.name,
      });
      setEditingGroup(null);
      fetchGroups();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/delete_product_group/${id}/`);
      fetchGroups();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="container mt-4">
      <h2>مدیریت گروه کالا</h2>
      <div className="mb-3 d-flex">
        <input type="text" className="form-control" placeholder="نام گروه جدید"
          value={newGroup} onChange={(e) => setNewGroup(e.target.value)} />
        <button className="btn btn-success ms-2" onClick={handleCreate}>افزودن</button>
      </div>

      <table className="table table-dark table-striped">
        <thead><tr><th>شناسه</th><th>نام گروه</th><th>عملیات</th></tr></thead>
        <tbody>
          {groups.map((g) => (
            <tr key={g.id}>
              <td>{g.id}</td>
              <td>
                {editingGroup?.id === g.id ? (
                  <input type="text" value={editingGroup.name}
                    onChange={(e) => setEditingGroup({ ...editingGroup, name: e.target.value })} />
                ) : (g.name)}
              </td>
              <td>
                {editingGroup?.id === g.id ? (
                  <>
                    <button className="btn btn-primary btn-sm me-2" onClick={handleUpdate}>ذخیره</button>
                    <button className="btn btn-secondary btn-sm" onClick={() => setEditingGroup(null)}>انصراف</button>
                  </>
                ) : (
                  <>
                    <button className="btn btn-warning btn-sm me-2" onClick={() => setEditingGroup(g)}>ویرایش</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(g.id)}>حذف</button>
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
export default ProductGroup;
