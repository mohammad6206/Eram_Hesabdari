import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Product.css";

function Product() {
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [groups, setGroups] = useState([]);
  const [units, setUnits] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL;

  // فرم افزودن
  const [newProduct, setNewProduct] = useState({
    code: "",
    name: "",
    group: "",            // id
    unit: "",             // id
    min_quantity: "",
    max_quantity: "",
    registration_date: "",
    expiration_date: "",
    purchase_price: "",
    sale_price: "",
    warehouse: "",        // id (اختیاری)
    discount_percent: "",
    model: "",
    tax_percent: "",
    duty_percent: "",
    final_tax_percent: "",
    description: "",
  });

  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchGroups();
    fetchUnits();
    fetchWarehouses();
  }, []);

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
      const res = await axios.get(`${API_URL}/api/product_group/`);
      setGroups(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUnits = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/unit/`);
      setUnits(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };


  const fetchWarehouses = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/warehouse/`);
      setWarehouses(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    axios.get(`${API_URL}/api/warehouses/`).then((res) => setWarehouses(res.data));
    axios.get(`${API_URL}/api/product-groups/`).then((res) => setGroups(res.data));
    axios.get(`${API_URL}/api/units/`).then((res) => setUnits(res.data));
  }, []);

  // کمکی‌ها برای تبدیل عددی
  const toInt = (v) => (v === "" || v === null ? 0 : parseInt(v, 10));
  const toDec = (v) => (v === "" || v === null ? "0" : String(v));

  const handleCreate = async () => {
    // حداقل اعتبارسنجی
    if (!newProduct.code.trim() || !newProduct.name.trim()) return;

    const payload = {
      code: newProduct.code,
      name: newProduct.name,
      group: newProduct.group || null,
      unit: newProduct.unit || null,
      min_quantity: toInt(newProduct.min_quantity),
      max_quantity: toInt(newProduct.max_quantity),
      expiration_date: newProduct.expiration_date || null,
      purchase_price: toDec(newProduct.purchase_price),
      sale_price: toDec(newProduct.sale_price),
      warehouse: newProduct.warehouse || null,
      discount_percent: toDec(newProduct.discount_percent),
      model: newProduct.model || "",
      tax_percent: toDec(newProduct.tax_percent),
      duty_percent: toDec(newProduct.duty_percent),
      final_tax_percent: toDec(newProduct.final_tax_percent),
      description: newProduct.description || "",
    };

    try {
      await axios.post(`${API_URL}/api/products/`, payload);
      setNewProduct({
        code: "",
        name: "",
        group: "",
        unit: "",
        min_quantity: "",
        max_quantity: "",
        expiration_date: "",
        purchase_price: "",
        sale_price: "",
        warehouse: "",
        discount_percent: "",
        model: "",
        tax_percent: "",
        duty_percent: "",
        final_tax_percent: "",
        description: "",
      });
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async () => {
    if (!editingProduct) return;

    const payload = {
      code: editingProduct.code,
      name: editingProduct.name,
      group: editingProduct.group || null,
      unit: editingProduct.unit || null,
      min_quantity: toInt(editingProduct.min_quantity),
      max_quantity: toInt(editingProduct.max_quantity),
      expiration_date: editingProduct.expiration_date || null,
      purchase_price: toDec(editingProduct.purchase_price),
      sale_price: toDec(editingProduct.sale_price),
      warehouse: editingProduct.warehouse || null,
      discount_percent: toDec(editingProduct.discount_percent),
      model: editingProduct.model || "",
      tax_percent: toDec(editingProduct.tax_percent),
      duty_percent: toDec(editingProduct.duty_percent),
      final_tax_percent: toDec(editingProduct.final_tax_percent),
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

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/products/${id}/`);
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  // کمکی برای نمایش نام/عنوان FKها (چه آبجکت باشد چه id)
  const nameOf = (value, list, key = "name") => {
    if (!value) return "-";
    if (typeof value === "object") return value[key] || value.id || "-";
    const found = list.find((x) => String(x.id) === String(value));
    return found ? found[key] : String(value);
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
          placeholder="کد کالا *"
          value={newProduct.code}
          onChange={(e) => setNewProduct({ ...newProduct, code: e.target.value })}
        />
        <input
          type="text"
          className="form-input"
          placeholder="نام کالا *"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
        />

        {/* انتخاب گروه */}
        <select
          className="form-input"
          value={newProduct.group}
          onChange={(e) => setNewProduct({ ...newProduct, group: e.target.value })}
        >
          <option value="">گروه کالا</option>
          {groups.map((g) => (
            <option key={g.id} value={g.id}>
              {g.title}
            </option>
          ))}
        </select>
        <select
          className="form-input"
          value={newProduct.unit}
          onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
        >
          <option value="">واحد کالا</option>
          {units.map((u) => (
            <option key={u.id} value={u.id}>
              {u.title}   {/* چون فیلدش title هست */}
            </option>
          ))}
        </select>


        <input
          type="number"
          className="form-input"
          placeholder="حداقل تعداد"
          value={newProduct.min_quantity}
          onChange={(e) => setNewProduct({ ...newProduct, min_quantity: e.target.value })}
        />
        <input
          type="number"
          className="form-input"
          placeholder="حداکثر تعداد"
          value={newProduct.max_quantity}
          onChange={(e) => setNewProduct({ ...newProduct, max_quantity: e.target.value })}
        />


        <input
          type="date"
          className="form-input"
          placeholder="تاریخ انقضا"
          value={newProduct.expiration_date}
          onChange={(e) => setNewProduct({ ...newProduct, expiration_date: e.target.value })}
        />

        <input
          type="number"
          step="0.01"
          className="form-input"
          placeholder="قیمت خرید"
          value={newProduct.purchase_price}
          onChange={(e) => setNewProduct({ ...newProduct, purchase_price: e.target.value })}
        />
        <input
          type="number"
          step="0.01"
          className="form-input"
          placeholder="قیمت فروش"
          value={newProduct.sale_price}
          onChange={(e) => setNewProduct({ ...newProduct, sale_price: e.target.value })}
        />{/* انتخاب انبار */}
        <select
          className="form-input"
          value={newProduct.warehouse}
          onChange={(e) => setNewProduct({ ...newProduct, warehouse: e.target.value })}
        >
          <option value="">مکان کالا (انبار)</option>
          {warehouses.map((w) => (
            <option key={w.id} value={w.id}>
              {w.name} {/* ← اصلاح شد */}
            </option>
          ))}
        </select>

        <input
          type="number"
          step="0.01"
          className="form-input"
          placeholder="درصد تخفیف فروش"
          value={newProduct.discount_percent}
          onChange={(e) => setNewProduct({ ...newProduct, discount_percent: e.target.value })}
        />

        <input
          type="text"
          className="form-input"
          placeholder="مدل"
          value={newProduct.model}
          onChange={(e) => setNewProduct({ ...newProduct, model: e.target.value })}
        />

        <input
          type="number"
          step="0.01"
          className="form-input"
          placeholder="درصد مالیات"
          value={newProduct.tax_percent}
          onChange={(e) => setNewProduct({ ...newProduct, tax_percent: e.target.value })}
        />
        <input
          type="number"
          step="0.01"
          className="form-input"
          placeholder="درصد عوارض"
          value={newProduct.duty_percent}
          onChange={(e) => setNewProduct({ ...newProduct, duty_percent: e.target.value })}
        />
        <input
          type="number"
          step="0.01"
          className="form-input"
          placeholder="مالیات بر مصرف نهایی"
          value={newProduct.final_tax_percent}
          onChange={(e) => setNewProduct({ ...newProduct, final_tax_percent: e.target.value })}
        />

        <input
          className="form-input form-textarea"
          placeholder="توضیحات"
          rows="2"
          value={newProduct.description}
          onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
        />

        <div className="form-actions">
          <button className="btn btn-add" onClick={handleCreate}>افزودن کالا</button>
        </div>
      </div>

      {/* جدول کالاها */}
      <div className="table-wrapper">
        <table className="custom-table">
          <thead>
            <tr>
              <th>کد</th>
              <th>نام</th>
              <th>گروه</th>
              <th>واحد</th>
              <th>حداقل</th>
              <th>حداکثر</th>
              <th>تاریخ ثبت</th>
              <th>تاریخ انقضا</th>
              <th>ق.خرید</th>
              <th>ق.فروش</th>
              <th>انبار</th>
              <th>تخفیف٪</th>
              <th>مدل</th>
              <th>مالیات٪</th>
              <th>عوارض٪</th>
              <th>مصرف نهایی٪</th>
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
                        className="edit-input"
                        value={editingProduct.code}
                        onChange={(e) => setEditingProduct({ ...editingProduct, code: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        className="edit-input"
                        value={editingProduct.name}
                        onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                      />
                    </td>
                    <td>
                      <select
                        className="edit-input"
                        value={editingProduct.group || ""}
                        onChange={(e) => setEditingProduct({ ...editingProduct, group: e.target.value })}
                      >
                        <option value="">—</option>
                        {groups.map((g) => (
                          <option key={g.id} value={g.id}>{g.title}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <select
                        className="edit-input"
                        value={editingProduct.unit || ""}
                        onChange={(e) => setEditingProduct({ ...editingProduct, unit: e.target.value })}
                      >
                        <option value="">—</option>
                        {units.map((u) => (
                          <option key={u.id} value={u.id}>{u.title}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        className="edit-input"
                        type="number"
                        value={editingProduct.min_quantity ?? ""}
                        onChange={(e) => setEditingProduct({ ...editingProduct, min_quantity: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        className="edit-input"
                        type="number"
                        value={editingProduct.max_quantity ?? ""}
                        onChange={(e) => setEditingProduct({ ...editingProduct, max_quantity: e.target.value })}
                      />
                    </td>

                    {/* تاریخ ثبت فقط نمایش */}
                    <td>{p.registration_date || "-"}</td>

                    <td>
                      <input
                        className="edit-input"
                        type="date"
                        value={editingProduct.expiration_date || ""}
                        onChange={(e) => setEditingProduct({ ...editingProduct, expiration_date: e.target.value })}
                      />
                    </td>

                    <td>
                      <input
                        className="edit-input"
                        type="number"
                        step="0.01"
                        value={editingProduct.purchase_price ?? ""}
                        onChange={(e) => setEditingProduct({ ...editingProduct, purchase_price: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        className="edit-input"
                        type="number"
                        step="0.01"
                        value={editingProduct.sale_price ?? ""}
                        onChange={(e) => setEditingProduct({ ...editingProduct, sale_price: e.target.value })}
                      />
                    </td>
                    <td>
                      <select
                        className="edit-input"
                        value={editingProduct.warehouse || ""}
                        onChange={(e) => setEditingProduct({ ...editingProduct, warehouse: e.target.value })}
                      >
                        <option value="">—</option>
                        {warehouses.map((w) => (
                          <option key={w.id} value={w.id}>{w.name}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        className="edit-input"
                        type="number"
                        step="0.01"
                        value={editingProduct.discount_percent ?? ""}
                        onChange={(e) => setEditingProduct({ ...editingProduct, discount_percent: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        className="edit-input"
                        value={editingProduct.model || ""}
                        onChange={(e) => setEditingProduct({ ...editingProduct, model: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        className="edit-input"
                        type="number"
                        step="0.01"
                        value={editingProduct.tax_percent ?? ""}
                        onChange={(e) => setEditingProduct({ ...editingProduct, tax_percent: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        className="edit-input"
                        type="number"
                        step="0.01"
                        value={editingProduct.duty_percent ?? ""}
                        onChange={(e) => setEditingProduct({ ...editingProduct, duty_percent: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        className="edit-input"
                        type="number"
                        step="0.01"
                        value={editingProduct.final_tax_percent ?? ""}
                        onChange={(e) => setEditingProduct({ ...editingProduct, final_tax_percent: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        className="edit-input"
                        value={editingProduct.description || ""}
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
                    <td>{p.code}</td>
                    <td>{p.name}</td>
                    <td>{nameOf(p.group, groups)}</td>
                    <td>{nameOf(p.unit, units)}</td>
                    <td>{p.min_quantity}</td>
                    <td>{p.max_quantity}</td>
                    <td>{p.registration_date || "-"}</td>
                    <td>{p.expiration_date || "-"}</td>
                    <td>{p.purchase_price}</td>
                    <td>{p.sale_price}</td>
                    <td>{nameOf(p.warehouse, warehouses)}</td>
                    <td>{p.discount_percent}%</td>
                    <td>{p.model || "-"}</td>
                    <td>{p.tax_percent}%</td>
                    <td>{p.duty_percent}%</td>
                    <td>{p.final_tax_percent}%</td>
                    <td className="text-muted">{p.description || "-"}</td>
                    <td className="nowrap">
                      <button
                        className="btn btn-edit"
                        onClick={() =>
                          setEditingProduct({
                            ...p,
                            group: p.group?.id || p.group || "",
                            unit: p.unit?.id || p.unit || "",
                            warehouse: p.warehouse?.id || p.warehouse || "",
                          })
                        }
                      >
                        ویرایش
                      </button>
                      <button className="btn btn-delete" onClick={() => handleDelete(p.id)}>
                        حذف
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="18" className="text-center text-muted">کالایی ثبت نشده است.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Product;
