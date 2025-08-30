import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Product.css";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

function Product() {
  const [products, setProducts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [units, setUnits] = useState([]);
  const [devices, setDevices] = useState([]);
  const [newProductNumber, setNewProductNumber] = useState("");

  const API_URL = process.env.REACT_APP_API_URL;

  const [newProduct, setNewProduct] = useState({
    number: "",
    device: "",
    name: "",
    model: "",
    group: "",
    quantity: "",
    unit: "",
    registration_date: "",
    description: "",
  });

  const [editingProduct, setEditingProduct] = useState(null);

  // 📌 گرفتن شماره بعدی محصول
  const fetchNextProductNumber = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/next-number/Product/`);
      const nextNum = res.data.next_number || res.data;
      setNewProductNumber(nextNum.toString());
      setNewProduct((prev) => ({ ...prev, number: nextNum.toString() }));
    } catch (err) {
      console.error(err);
    }
  };

  // 📌 گرفتن داده‌ها از API
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/products/`);
      setProducts(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchGroups = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/product-groups/`);
      setGroups(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUnits = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/units/`);
      setUnits(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDevices = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/devices/`);
      setDevices(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  // 📌 اجرای اولیه
  useEffect(() => {
    fetchProducts();
    fetchGroups();
    fetchUnits();
    fetchDevices();
    fetchNextProductNumber();
  }, []);

  // 📌 توابع کمکی
  const toInt = (v) => (v === "" || v === null ? 0 : parseInt(v, 10));

  const nameOf = (value, list, key = "name") => {
    if (!value) return "-";
    if (typeof value === "object") return value[key] || value.id || "-";
    const found = list.find((x) => String(x.id) === String(value));
    return found ? found[key] : String(value);
  };

  // 📌 افزودن کالا
  const handleCreate = async () => {
    if (!newProduct.number.trim() || !newProduct.name.trim()) return;

    const payload = {
      number: newProduct.number,
      name: newProduct.name,
      model: newProduct.model || "",
      device: newProduct.device || null,
      group: newProduct.group || null,
      unit: newProduct.unit || null,
      quantity: toInt(newProduct.quantity),
      registration_date: newProduct.registration_date || null,
      description: newProduct.description || "",
    };

    try {
      await axios.post(`${API_URL}/api/products/`, payload);
      setNewProduct({
        number: newProductNumber,
        device: "",
        name: "",
        model: "",
        group: "",
        unit: "",
        quantity: "",
        registration_date: "",
        description: "",
      });
      fetchProducts();
      fetchNextProductNumber();
    } catch (err) {
      console.error(err);
    }
  };

  // 📌 ویرایش کالا
  const handleUpdate = async () => {
    if (!editingProduct) return;

    const payload = {
      number: editingProduct.number,
      name: editingProduct.name,
      model: editingProduct.model || "",
      device: editingProduct.device || null,
      group: editingProduct.group || null,
      unit: editingProduct.unit || null,
      quantity: toInt(editingProduct.quantity),
      registration_date: editingProduct.registration_date || null,
      description: editingProduct.description || "",
    };

    try {
      await axios.put(`${API_URL}/api/products/${editingProduct.id}/`, payload);
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  // 📌 حذف کالا
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/products/${id}/`);
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="product-page-container" dir="rtl">
      <div className="header">
        <h2>مدیریت کالاها</h2>
      </div>

      {/* فرم افزودن کالا */}
      <div className="form-grid">
        <input
          type="text"
          className="form-input"
          placeholder="شماره کالا *"
          value={newProduct.number}
          onChange={(e) => setNewProduct({ ...newProduct, number: e.target.value })}
        />

        <select
          className="form-input"
          value={newProduct.device}
          onChange={(e) => setNewProduct({ ...newProduct, device: e.target.value })}
        >
          <option value="" hidden>دستگاه</option>
          {devices.map((d) => (
            <option key={d.id} value={d.id}>{d.title}</option>
          ))}
        </select>

        <input
          type="text"
          className="form-input"
          placeholder="نام کالا *"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
        />

        <input
          type="text"
          className="form-input"
          placeholder="مدل"
          value={newProduct.model}
          onChange={(e) => setNewProduct({ ...newProduct, model: e.target.value })}
        />

        <select
          className="form-input"
          value={newProduct.group}
          onChange={(e) => setNewProduct({ ...newProduct, group: e.target.value })}
        >
          <option value="" hidden>گروه کالا</option>
          {groups.map((g) => (
            <option key={g.id} value={g.id}>{g.title}</option>
          ))}
        </select>

        <input
          type="number"
          className="form-input"
          placeholder="تعداد"
          value={newProduct.quantity}
          onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
        />
        <select
          className="form-input"
          value={newProduct.unit}
          onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
        >
          <option value="" hidden>واحد کالا</option>
          {units.map((u) => (
            <option key={u.id} value={u.id}>{u.title}</option>
          ))}
        </select>


        <DatePicker
          value={newProduct.registration_date}
          onChange={(date) =>
            setNewProduct({
              ...newProduct,
              registration_date: date ? date.format("YYYY-MM-DD") : "",
            })
          }
          calendar={persian}
          locale={persian_fa}
          inputClass="form-input"
          placeholder="تاریخ ثبت"
        />

        <input
          className="form-input form-textarea"
          placeholder="توضیحات"
          value={newProduct.description}
          onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
        />

        <button className="btn btn-add" onClick={handleCreate}>افزودن کالا</button>

      </div>

      {/* جدول کالاها */}
      <div className="table-wrapper">
        <table className="custom-table">
          <thead>
            <tr>
              <th>شماره کالا</th>
              <th>دستگاه</th>
              <th>نام کالا</th>
              <th>مدل</th>
              <th>گروه کالا</th>
              <th>تعداد</th>
              <th>واحد کالا</th>
              <th>تاریخ ثبت</th>
              <th>توضیحات</th>
              <th>عملیات</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                {editingProduct?.id === p.id ? (
                  <>
                    <td>
                      <input
                        type="text"
                        className="edit-input"
                        value={editingProduct?.number || ""}
                        onChange={(e) => setEditingProduct({ ...editingProduct, number: e.target.value })}
                      />
                    </td>
                    <td>
                      <select
                        className="edit-input"
                        value={editingProduct?.device || ""}
                        onChange={(e) => setEditingProduct({ ...editingProduct, device: e.target.value })}
                      >
                        <option value="">—</option>
                        {devices.map((d) => (
                          <option key={d.id} value={d.id}>{d.title}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        className="edit-input"
                        value={editingProduct?.name || ""}
                        onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        className="edit-input"
                        value={editingProduct?.model || ""}
                        onChange={(e) => setEditingProduct({ ...editingProduct, model: e.target.value })}
                      />
                    </td>
                    <td>
                      <select
                        className="edit-input"
                        value={editingProduct?.group || ""}
                        onChange={(e) => setEditingProduct({ ...editingProduct, group: e.target.value })}
                      >
                        <option value="">—</option>
                        {groups.map((g) => (
                          <option key={g.id} value={g.id}>{g.title}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        type="number"
                        className="edit-input"
                        value={editingProduct?.quantity ?? ""}
                        onChange={(e) => setEditingProduct({ ...editingProduct, quantity: e.target.value })}
                      />
                    </td>
                    <td>
                      <select
                        className="edit-input"
                        value={editingProduct?.unit || ""}
                        onChange={(e) => setEditingProduct({ ...editingProduct, unit: e.target.value })}
                      >
                        <option value="">—</option>
                        {units.map((u) => (
                          <option key={u.id} value={u.id}>{u.title}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <DatePicker
                        value={editingProduct?.registration_date}
                        onChange={(date) =>
                          setEditingProduct({
                            ...editingProduct,
                            registration_date: date ? date.format("YYYY-MM-DD") : "",
                          })
                        }
                        calendar={persian}
                        locale={persian_fa}
                        inputClass="edit-input"
                        placeholder="تاریخ ثبت"
                      />
                    </td>

                    <td>
                      <input
                        className="edit-input"
                        value={editingProduct?.description || ""}
                        onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                      />
                    </td>
                    <td className="nowrap">
                      <button className="btn btn-save" onClick={handleUpdate}>ذخیره</button>
                      <button className="btn btn-cancel" onClick={() => setEditingProduct(null)}>انصراف</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{p.number}</td>
                    <td>{nameOf(p.device, devices, "title")}</td>
                    <td>{p.name}</td>
                    <td>{p.model || "-"}</td>
                    <td>{nameOf(p.group, groups, "title")}</td>
                    <td>{p.quantity}</td>
                    <td>{nameOf(p.unit, units, "title")}</td>
                    <td>{p.registration_date || "-"}</td>
                    <td className="text-muted">{p.description || "-"}</td>
                    <td className="nowrap">
                      <button
                        className="btn btn-edit"
                        onClick={() =>
                          setEditingProduct({
                            ...p,
                            group: p.group?.id || p.group || "",
                            unit: p.unit?.id || p.unit || "",
                          })
                        }
                      >
                        ویرایش
                      </button>
                      <button
                        className="btn btn-delete"
                        onClick={() => {
                          if (window.confirm("آیا مطمئن هستید که می‌خواهید این کالا را حذف کنید؟")) {
                            handleDelete(p.id);
                          }
                        }}
                      >
                        حذف
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="11" className="text-center text-muted">کالایی ثبت نشده است.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Product;
