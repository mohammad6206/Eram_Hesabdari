// src/pages/Product.js
import React, { useState, useEffect } from "react";
import axios from "axios";

function Product() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("/api/product/");
      setProducts(res.data);
    } catch (err) { console.error(err); }
  };

  const handleCreate = async () => {
    try {
      await axios.post("/api/create_product/", { name: newProduct });
      setNewProduct("");
      fetchProducts();
    } catch (err) { console.error(err); }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`/api/update_product/${editingProduct.id}/`, {
        name: editingProduct.name,
      });
      setEditingProduct(null);
      fetchProducts();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/delete_product/${id}/`);
      fetchProducts();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="container mt-4">
      <h2>مدیریت کالاها</h2>
      <div className="mb-3 d-flex">
        <input type="text" className="form-control" placeholder="نام کالا جدید"
          value={newProduct} onChange={(e) => setNewProduct(e.target.value)} />
        <button className="btn btn-success ms-2" onClick={handleCreate}>افزودن</button>
      </div>

      <table className="table table-dark table-striped">
        <thead><tr><th>شناسه</th><th>نام کالا</th><th>عملیات</th></tr></thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>
                {editingProduct?.id === p.id ? (
                  <input type="text" value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })} />
                ) : (p.name)}
              </td>
              <td>
                {editingProduct?.id === p.id ? (
                  <>
                    <button className="btn btn-primary btn-sm me-2" onClick={handleUpdate}>ذخیره</button>
                    <button className="btn btn-secondary btn-sm" onClick={() => setEditingProduct(null)}>انصراف</button>
                  </>
                ) : (
                  <>
                    <button className="btn btn-warning btn-sm me-2" onClick={() => setEditingProduct(p)}>ویرایش</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}>حذف</button>
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
export default Product;
