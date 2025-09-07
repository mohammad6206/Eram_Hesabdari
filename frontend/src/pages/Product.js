import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Product.css";
import DatePicker from "react-multi-date-picker";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

const API_URL = process.env.REACT_APP_API_URL;

// 📌 تابع کمکی برای نمایش تاریخ
const formatDateTime = (dateStr) => {
  if (!dateStr) return "-";
  return new DateObject({
    date: dateStr,
    calendar: persian,
    locale: persian_fa,
  }).format("YYYY-MM-DD  HH:mm");
};

export default function Product() {
  const [products, setProducts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [devices, setDevices] = useState([]);
  const [newProduct, setNewProduct] = useState({
    number: "",
    device: "",
    name: "",
    product_code: "",
    group: "",
    created_at: "",
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [errors, setErrors] = useState({});

  // 🔎 جستجو و فیلتر
  const [searchText, setSearchText] = useState("");
  const [dateFilter, setDateFilter] = useState({ from: null, to: null });
  const [dateField, setDateField] = useState("created_at");

  useEffect(() => {
    fetchProducts();
    fetchGroups();
    fetchDevices();
    fetchNextProductNumber();
  }, []);

  const fetchNextProductNumber = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/next-number/Product/`);
      const nextNum = res.data.next_number || res.data;
      setNewProduct((prev) => ({ ...prev, number: nextNum.toString() }));
    } catch (err) {
      console.error(err);
    }
  };

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

  const fetchDevices = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/devices/`);
      setDevices(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const validate = (product) => {
    const errs = {};
    if (!product.number.trim()) errs.number = "شماره کالا الزامی است";
    if (!product.name.trim()) errs.name = "نام کالا الزامی است";
    if (!product.device) errs.device = "انتخاب دستگاه الزامی است";
    if (!product.group) errs.group = "انتخاب گروه الزامی است";
    if (!product.created_at) errs.created_at = "تاریخ ثبت الزامی است";
    if (!product.product_code) errs.product_code = "کد اختصاصی الزامی است";
    return errs;
  };

  const handleCreate = async () => {
    const errs = validate(newProduct);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const payload = {
      ...newProduct,
      device: newProduct.device ? Number(newProduct.device) : null,
      group: newProduct.group ? Number(newProduct.group) : null,
      created_at: newProduct.created_at
        ? newProduct.created_at.format("YYYY-MM-DD HH:mm")
        : null,
    };

    try {
      await axios.post(`${API_URL}/api/products/`, payload);
      setNewProduct({
        number: "",
        device: "",
        name: "",
        product_code: "",
        group: "",
        created_at: "",
      });
      setErrors({});
      fetchProducts();
      fetchNextProductNumber();
    } catch (err) {
      console.error("Create Error:", err.response?.data || err.message);
    }
  };

  const handleUpdate = async () => {
    const errs = validate(editingProduct);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const payload = {
      ...editingProduct,
      device: editingProduct.device ? Number(editingProduct.device) : null,
      group: editingProduct.group ? Number(editingProduct.group) : null,
      created_at: editingProduct.created_at
        ? editingProduct.created_at.format("YYYY-MM-DD HH:mm")
        : null,
      updated_at: new DateObject({ date: new Date(), calendar: persian, locale: persian_fa }).format(
        "YYYY-MM-DD HH:mm"
      ),
    };

    try {
      await axios.put(`${API_URL}/api/products/${editingProduct.id}/`, payload);
      setEditingProduct(null);
      setErrors({});
      fetchProducts();
    } catch (err) {
      console.error("Update Error:", err.response?.data || err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("آیا مطمئن هستید می‌خواهید حذف کنید؟")) return;
    try {
      await axios.delete(`${API_URL}/api/products/${id}/`);
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredProducts = products.filter((p) => {
    let matchesSearch = searchText
      ? Object.values(p).some((val) =>
        String(val).toLowerCase().includes(searchText.toLowerCase())
      )
      : true;

    let matchesDate = true;
    const dateValue = p[dateField] ? new Date(p[dateField]) : null;
    if ((dateFilter.from || dateFilter.to) && dateValue) {
      if (dateFilter.from)
        matchesDate =
          matchesDate && dateValue >= new Date(dateFilter.from.toDate());
      if (dateFilter.to)
        matchesDate =
          matchesDate && dateValue <= new Date(dateFilter.to.toDate());
    } else if (!dateValue && (dateFilter.from || dateFilter.to)) {
      matchesDate = false;
    }

    return matchesSearch && matchesDate;
  });

  const nameOf = (value, list, key = "title") => {
    if (!value) return "-";
    const found = list.find((x) => String(x.id) === String(value));
    return found ? found[key] : String(value);
  };

  return (
    <div className="product-page-container" dir="rtl">
      <h2 className="text-center mb-4">مدیریت کالاها</h2>

      {/* جستجو و فیلتر */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
          alignItems: "center",
          flexWrap: "nowrap",
        }}
      >
        <input
          type="text"
          placeholder="جستجو در همه فیلدها..."
          className="form-input"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ flexGrow: 1, minWidth: "250px" }}
        />

        <select
          className="form-select small-select"
          value={dateField}
          onChange={(e) => setDateField(e.target.value)}
        >
          <option value="created_at">تاریخ ایجاد</option>
          <option value="updated_at">تاریخ آخرین ویرایش</option>
        </select>

        <span>از:</span>
        <DatePicker
          calendar={persian}
          locale={persian_fa}
          value={dateFilter.from}
          onChange={(date) =>
            setDateFilter((prev) => ({ ...prev, from: date }))
          }
          inputClass="form-input"
          placeholder="تاریخ شروع"
          style={{ minWidth: "150px" }}
        />

        <span>تا:</span>
        <DatePicker
          calendar={persian}
          locale={persian_fa}
          value={dateFilter.to}
          onChange={(date) => setDateFilter((prev) => ({ ...prev, to: date }))}
          inputClass="form-input"
          placeholder="تاریخ پایان"
          style={{ minWidth: "150px" }}
        />
      </div>

      {/* فرم ورود/ویرایش */}
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "6px",
          padding: "15px",
          display: "flex",
          gap: "10px",
          flexWrap: "nowrap",
          alignItems: "flex-start",
          marginBottom: "30px",
          overflowX: "auto",
        }}
      >
        {["number", "device", "name", "product_code", "group", "created_at"].map(
          (field) => {
            let label =
              field === "number"
                ? "شماره کالا"
                : field === "name"
                  ? "نام کالا"
                  : field === "device"
                    ? "دستگاه"
                    : field === "group"
                      ? "گروه کالا"
                      : field === "created_at"
                        ? "تاریخ ایجاد"
                        : "کد اختصاصی";

            let value = editingProduct ? editingProduct[field] : newProduct[field];
            const onChange = (val) => {
              if (editingProduct)
                setEditingProduct({ ...editingProduct, [field]: val });
              else setNewProduct({ ...newProduct, [field]: val });
            };

            const baseStyle = {
              display: "flex",
              flexDirection: "column",
              minWidth: "120px",
            };

            if (field === "device") {
              return (
                <div key={field} style={baseStyle}>
                  <select
                    className="form-input"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                  >
                    <option value="">دستگاه</option>
                    {devices.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.title}
                      </option>
                    ))}
                  </select>
                  <small style={{ minHeight: "18px", color: "red" }}>
                    {errors.device}
                  </small>
                </div>
              );
            }

            if (field === "group") {
              return (
                <div key={field} style={baseStyle}>
                  <select
                    className="form-input"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                  >
                    <option value="">گروه کالا</option>
                    {groups.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.title}
                      </option>
                    ))}
                  </select>
                  <small style={{ minHeight: "18px", color: "red" }}>
                    {errors.group}
                  </small>
                </div>
              );
            }

            if (field === "created_at") {
              return (
                <div key={field} style={{ ...baseStyle, minWidth: "140px" }}>
                  <DatePicker
                    calendar={persian}
                    locale={persian_fa}
                    value={value || null}
                    onChange={(date) => onChange(date || "")}
                    inputClass="form-input"
                    placeholder="تاریخ ایجاد"
                    format="YYYY-MM-DD  HH:mm"
                    timePicker   // 👈 اینو اضافه کن

                  />
                  <small style={{ minHeight: "18px", color: "red" }}>
                    {errors.created_at}
                  </small>
                </div>
              );
            }

            return (
              <div key={field} style={baseStyle}>
                <input
                  className="form-input"
                  placeholder={label}
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                />
                <small style={{ minHeight: "18px", color: "red" }}>
                  {errors[field]}
                </small>
              </div>
            );
          }
        )}

        <div style={{ alignSelf: "flex-end" }}>
          {editingProduct ? (
            <button className="btn-fullheight" onClick={handleUpdate}>
              ذخیره تغییرات
            </button>
          ) : (
            <div className="input-row">
              <button className="btn-fullheight" onClick={handleCreate}>
                افزودن کالا
              </button>
            </div>
          )}
        </div>
      </div>

      {/* جدول کالاها */}
      <div className="table-wrapper">
        <table className="custom-table text-center">
          <thead>
            <tr>
              <th>شماره کالا</th>
              <th>دستگاه</th>
              <th>نام کالا</th>
              <th>کد اختصاصی</th>
              <th>گروه کالا</th>
              <th>تاریخ ایجاد</th>
              <th>آخرین ویرایش</th>
              <th>عملیات</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((p) => (
              <tr key={p.id}>
                <td>{p.number}</td>
                <td>{nameOf(p.device, devices)}</td>
                <td>{p.name}</td>
                <td>{p.product_code || "-"}</td>
                <td>{nameOf(p.group, groups)}</td>
                <td>{formatDateTime(p.created_at)}</td>
                <td>{formatDateTime(p.updated_at)}</td>
                <td>
                  <button
                    className="btn btn-edit"
                    onClick={() => setEditingProduct(p)}
                  >
                    ویرایش
                  </button>
                  <button
                    className="btn btn-delete"
                    onClick={() => handleDelete(p.id)}
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))}
            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center text-muted">
                  کالایی ثبت نشده است.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

