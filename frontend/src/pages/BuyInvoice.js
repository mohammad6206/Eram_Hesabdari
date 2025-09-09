import React, { useState, useEffect, useRef } from "react";
import Logo from "../assets/Logo.svg";
import { Link } from "react-router-dom";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import axiosInstance from "../api/axiosInstance"; // حتما مسیر درست باشه

export default function BuyInvoice() {
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceData, setInvoiceData] = useState(null);
  const [rows, setRows] = useState([]);
  const [sellerId, setSellerId] = useState("");
  const [buyerId, setBuyerId] = useState("");
  const [sellers, setSellers] = useState([]);
  const [personnel, setPersonnel] = useState([]);
  const [products, setProducts] = useState([]);
  const [invoiceFile, setInvoiceFile] = useState(null);
  const [warehouses, setWarehouses] = useState([]);
  const fileInputRef = useRef(null);
  const [createdAt, setCreatedAt] = useState(null);
  const [errors, setErrors] = useState({});
  const [units, setUnits] = useState([]);
  const [selectedUnitId, setSelectedUnitId] = useState("");

  const thStyle = { border: "1px solid #ccc", padding: "12px", textAlign: "center" };
  const tdStyle = { border: "1px solid #ccc", padding: "4px", textAlign: "center" };

  // بارگذاری داده‌ها
  useEffect(() => {
    axiosInstance.get("/units/")
      .then(res => setUnits(res.data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const res = await axiosInstance.get("/sellers/");
        setSellers(res.data);
      } catch (err) {
        console.error("خطا در گرفتن فروشندگان:", err);
      }
    };
    fetchSellers();
  }, []);

  useEffect(() => {
    const fetchPersonnel = async () => {
      try {
        const res = await axiosInstance.get("/personnels/");
        setPersonnel(res.data);
      } catch (err) {
        console.error("خطا در گرفتن پرسنل:", err);
      }
    };
    fetchPersonnel();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axiosInstance.get("/products/");
        setProducts(res.data);
      } catch (err) {
        console.error("خطا در گرفتن محصولات:", err);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const res = await axiosInstance.get("/warehouses/");
        setWarehouses(res.data);
      } catch (err) {
        console.error("خطا در گرفتن انبارها:", err);
      }
    };
    fetchWarehouses();
  }, []);

  const handleInputChange = (index, field, value) => {
    const updatedRows = [...rows];

    if (field === "productId") {
      const selectedProduct = products.find(p => p.id === parseInt(value));
      updatedRows[index].productId = value;
      updatedRows[index].product_code = selectedProduct ? selectedProduct.product_code : "";
    } else {
      updatedRows[index][field] = value;
    }

    const quantity = parseFloat(updatedRows[index].quantity) || 0;
    const unitPrice = parseFloat(updatedRows[index].unitPrice) || 0;
    const taxRate = parseFloat(updatedRows[index].taxRate) || 0;

    const totalAmount = quantity * unitPrice;
    const taxAmount = totalAmount * (taxRate / 100);
    const finalAmount = totalAmount + taxAmount;

    updatedRows[index].totalAmount = totalAmount;
    updatedRows[index].taxAmount = taxAmount;
    updatedRows[index].finalAmount = finalAmount;

    setRows(updatedRows);
  };

  const removeRow = (index) => {
    setRows((prev) => prev.filter((_, i) => i !== index));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[`row_${index}_product`];
      delete next[`row_${index}_quantity`];
      delete next[`row_${index}_unitPrice`];
      return next;
    });
  };

  const addRow = () => setRows([...rows, {}]);

  const formatNumber = (value) => {
    if (value === null || value === undefined || value === "") return "";
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const createInvoice = async () => {
    try {
      const formData = new FormData();
      formData.append("invoice_number", invoiceNumber);
      formData.append("seller", parseInt(sellerId));
      formData.append("buyer", parseInt(buyerId));
      formData.append("destination", invoiceData?.destination?.id || null);
      if (createdAt) {
        const isoDate = createdAt.toDate().toISOString();
        formData.append("created_at", isoDate);
      }
      if (invoiceFile) formData.append("invoice_file", invoiceFile);

      const res = await axiosInstance.post("/buy-invoices/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Invoice created:", res.data);
      return res.data.id;
    } catch (err) {
      let errorMessage = "خطا در ثبت فاکتور!";
      if (err.response && err.response.data) {
        errorMessage = err.response.data.detail || JSON.stringify(err.response.data);
        console.error("Invoice creation error:", err.response.data);
      } else {
        console.error("Network or unknown error:", err);
      }
      alert(errorMessage);
      return null;
    }
  };

  const createInvoiceItems = async (invoiceId) => {
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const itemPayload = {
        buy_invoice: invoiceId,
        product: parseInt(row.productId),
        product_code: row.product_code || "",
        economic_code: row.economicCode || "",
        unit: parseInt(row.unitId) || null,   // 👈 اضافه شد
        quantity: parseFloat(row.quantity) || 0,
        unit_price: parseFloat(row.unitPrice) || 0,
        tax_rate: parseFloat(row.taxRate) || 0,
        description: row.description || "",
      };


      try {
        const res = await axiosInstance.post("/buy-invoice-items/", itemPayload);
        console.log(`Item ${i + 1} created:`, res.data);
      } catch (err) {
        let errorMessage = `خطا در ثبت آیتم ${i + 1}`;
        if (err.response && err.response.data) {
          errorMessage = err.response.data.detail || JSON.stringify(err.response.data);
          console.error(`Error creating item ${i + 1}:`, err.response.data);
        } else {
          console.error(`Network or unknown error on item ${i + 1}:`, err);
        }
        alert(errorMessage);
      }
    }
  };

  const handleSubmit = async () => {
    let newErrors = {};

    if (!invoiceNumber.trim()) newErrors.invoiceNumber = "لطفاً شماره فاکتور را وارد کنید.";
    if (!createdAt) newErrors.createdAt = "لطفاً تاریخ ایجاد را انتخاب کنید.";
    if (!sellerId) newErrors.sellerId = "لطفاً تامین‌کننده را انتخاب کنید.";
    if (!buyerId) newErrors.buyerId = "لطفاً خریدار را انتخاب کنید.";
    if (!invoiceData?.destination?.id) newErrors.destination = "لطفاً مقصد کالا را انتخاب کنید.";
    if (!invoiceFile) newErrors.invoiceFile = "لطفاً  فاکتور را آپلود کنید.";
    if (rows.length === 0) newErrors.rows = "حداقل یک ردیف کالا باید اضافه کنید.";
    else {
      rows.forEach((r, i) => {
        if (!r.productId) newErrors[`row_${i}_product`] = `ردیف ${i + 1}: کالا انتخاب نشده است.`;
        if (!r.quantity || r.quantity <= 0) newErrors[`row_${i}_quantity`] = `ردیف ${i + 1}: تعداد معتبر وارد کنید.`;
        if (!r.unitPrice || r.unitPrice <= 0) newErrors[`row_${i}_unitPrice`] = `ردیف ${i + 1}: مبلغ جزء معتبر وارد کنید.`;
      });
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const invoiceId = await createInvoice();
    if (invoiceId) {
      await createInvoiceItems(invoiceId);
      alert("فاکتور و آیتم‌ها با موفقیت ثبت شدند!");
      setInvoiceNumber("");
      setSellerId("");
      setBuyerId("");
      setInvoiceFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setInvoiceData({ destination: null });
      setRows([]);
      setCreatedAt(null);
      setErrors({});
    }
  };

  const selectedSeller = sellers.find(s => s.id === parseInt(sellerId));
  const selectedBuyer = personnel.find(p => p.id === parseInt(buyerId));

  return (
    <div style={{ direction: "rtl", fontFamily: "Tahoma, sans-serif", padding: "30px" }}>
      {/* سربرگ */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "30px", borderBottom: "3px solid #27ae60", paddingBottom: "15px" }}>
        <div style={{ textAlign: "right", flex: 1 }}>
          <h1 style={{ fontSize: "2.2rem", color: "#27ae60", margin: 0 }}>فاکتور خرید</h1>
        </div>
        <div style={{ textAlign: "center", flex: 1, fontSize: "1rem", color: "#34495e" }}>
          <b>شرکت تجهیزات پزشکی Medescop</b>
          <br />
          <a href="https://www.medescop-co.com" style={{ color: "#2980b9", textDecoration: "none" }}>www.medescop-co.com</a>
        </div>
        <div style={{ flex: 1, textAlign: "left" }}>
          <img src={Logo} alt="Logo" style={{ width: "90px", height: "90px" }} />
          <div className="mb-2 text-start">
            <Link to="/BuyInvoiceList" className="btn btn-success">بازگشت</Link>
          </div>
        </div>
      </div>

      {/* شماره فاکتور و تاریخ */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "20px" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontWeight: "bold" }}>شماره فاکتور:</span>
            <input
              type="text"
              value={invoiceNumber}
              onChange={e => setInvoiceNumber(e.target.value)}
              placeholder="شماره فاکتور"
              style={{ padding: "4px 8px", borderRadius: "4px", border: "1px solid #ccc", width: "200px" }}
            />
          </div>
          {errors.invoiceNumber && <p style={{ color: "red", fontSize: "0.8rem", marginTop: "4px" }}>{errors.invoiceNumber}</p>}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontWeight: "bold" }}>تاریخ ایجاد:</span>
            <DatePicker
              calendar={persian}
              locale={persian_fa}
              value={createdAt}
              onChange={setCreatedAt}
              format="HH:mm YYYY/MM/DD"
              calendarPosition="bottom-right"
              style={{ border: "1px solid #ccc", borderRadius: "4px", padding: "4px 8px", width: "200px" }}
              inputClass="form-input"
              placeholder="انتخاب تاریخ"
              timePicker
            />
          </div>
          {errors.createdAt && <p style={{ color: "red", fontSize: "0.8rem", marginTop: "4px" }}>{errors.createdAt}</p>}
        </div>
      </div>

      {/* بخش فروشنده و خریدار */}
      <SectionBox title="تامین کننده" selected={selectedSeller} setId={setSellerId} id={sellerId} data={sellers} type="seller" />
      <SectionBox title="خریدار" selected={selectedBuyer} setId={setBuyerId} id={buyerId} data={personnel} type="buyer" />

      {/* جدول ردیف‌ها */}
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px", fontSize: "0.9rem" }}>
        <thead style={{ backgroundColor: "#27ae60", color: "#fff" }}>
          <tr style={{ height: "50px" }}>
            <th style={thStyle}>ردیف</th>
            <th style={thStyle}>نام کالا</th>
            <th style={thStyle}>کد اختصاصی</th>
            <th style={thStyle}>واحد کالا</th>
            <th style={thStyle}>مبلغ جزء (ریال)</th>
            <th style={thStyle}>مبلغ کل (ریال)</th>
            <th style={thStyle}>مالیات (%)</th>
            <th style={thStyle}>مبلغ مالیات (ریال)</th>
            <th style={thStyle}>مبلغ بعد از مالیات (ریال)</th>
            <th style={thStyle}>توضیحات</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              <td style={tdStyle}>{index + 1}</td>
              <td style={tdStyle}>
                <select
                  value={row.productId || ""}
                  onChange={e => handleInputChange(index, "productId", e.target.value)}
                  style={{ width: "150px" }}
                >
                  <option value="" hidden>انتخاب کالا</option>
                  {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </td>
              <td style={tdStyle}>
                <input type="text" value={row.product_code || ""} readOnly style={{ width: "100px" }} />
              </td>
              <td style={tdStyle}>
                <select
                  value={row.unitId}
                  onChange={e => handleInputChange(index, "unitId", e.target.value)}
                  style={{ width: "100px", marginBottom: "5px" }}
                >
                  {units.map(u => <option key={u.id} value={u.id}>{u.title}</option>)}
                </select>
                <input
                  type="number"
                  value={row.quantity || ""}
                  onChange={e => handleInputChange(index, "quantity", e.target.value)}
                  style={{ width: "60px" }}
                />
              </td>
              <td style={tdStyle}>
                <input
                  type="text"
                  value={formatNumber(row.unitPrice)}
                  onChange={e => handleInputChange(index, "unitPrice", e.target.value.replace(/,/g, ""))}
                  style={{ width: "100px" }}
                />
              </td>
              <td style={tdStyle}>
                <input type="text" value={formatNumber(row.totalAmount)} readOnly style={{ width: "100px" }} />
              </td>
              <td style={tdStyle}>
                <input type="number" value={row.taxRate} onChange={e => handleInputChange(index, "taxRate", e.target.value)} style={{ width: "80px" }} />
              </td>
              <td style={tdStyle}>
                <input type="text" value={formatNumber(row.taxAmount)} readOnly style={{ width: "100px" }} />
              </td>
              <td style={tdStyle}>
                <input type="text" value={formatNumber(row.finalAmount)} readOnly style={{ width: "100px" }} />
              </td>
              <td style={tdStyle}>
                <input type="text" value={row.description} onChange={e => handleInputChange(index, "description", e.target.value)} style={{ width: "150px" }} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* دکمه‌های اضافه/حذف */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "30px" }}>
        <button
          onClick={addRow}
          style={{ backgroundColor: "#27ae60", color: "#fff", padding: "10px 25px", border: "none", borderRadius: "8px", cursor: "pointer" }}
        >
          + اضافه کردن ردیف
        </button>
        <button
          onClick={() => rows.length > 0 && removeRow(rows.length - 1)}
          style={{ backgroundColor: "#c0392b", color: "#fff", padding: "10px 25px", border: "none", borderRadius: "8px", cursor: rows.length > 0 ? "pointer" : "not-allowed" }}
          disabled={rows.length === 0}
        >
          - حذف آخرین ردیف
        </button>
      </div>

      {/* اطلاعات نهایی فاکتور */}
      {errors.rows && <p style={{ color: "red" }}>{errors.rows}</p>}
      <div style={{ marginTop: "30px", padding: "20px", border: "1px solid #27ae60", borderRadius: "10px", backgroundColor: "#f9fdfb", boxShadow: "0 3px 8px rgba(0,0,0,0.05)" }}>
        <h3 style={{ marginBottom: "20px", color: "#27ae60", borderBottom: "2px solid #27ae60", paddingBottom: "8px" }}>اطلاعات نهایی فاکتور</h3>
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "30px" }}>
          <div style={{ flex: 1, minWidth: "250px" }}>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}>مقصد کالا:</label>
            <select
              value={invoiceData?.destination?.id || ""}
              onChange={e =>
                setInvoiceData({
                  ...invoiceData,
                  destination: warehouses.find(w => w.id === parseInt(e.target.value))
                })
              }
              style={{ border: "1px solid #27ae60", borderRadius: "6px", padding: "8px 12px", fontWeight: "bold", width: "350px" }}
            >
              <option value="" hidden>انتخاب مقصد</option>
              {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
            </select>
            {errors.destination && <p style={{ color: "red", fontSize: "0.8rem" }}>{errors.destination}</p>}
          </div>
          <div style={{ flex: 1, minWidth: "250px" }}>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: "8px" }}>آپلود فاکتور :</label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={e => {
                const file = e.target.files[0];
                setInvoiceFile(file);
                if (file) {
                  setErrors(prev => {
                    const next = { ...prev };
                    delete next.invoiceFile;
                    return next;
                  });
                }
              }}
              style={{ border: errors.invoiceFile ? "1px solid red" : "1px solid #ccc", padding: "6px", borderRadius: "6px" }}
            />
            {errors.invoiceFile && <p style={{ color: "red", fontSize: "0.8rem" }}>{errors.invoiceFile}</p>}
          </div>
          <div style={{ flex: 1, minWidth: "200px" }}>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: "8px" }}>جمع کل(ریال) :</label>
            <div style={{ border: "1px solid #ccc", borderRadius: "6px", padding: "10px", width: "100%", backgroundColor: "#f8f9fa", fontWeight: "bold", textAlign: "center", fontSize: "1rem", userSelect: "none" }}>
              {formatNumber(rows.reduce((sum, r) => sum + (parseFloat(r.finalAmount) || 0), 0))}
            </div>
          </div>
        </div>
        <div style={{ marginTop: "30px" }}>
          <button
            style={{ backgroundColor: "#27ae60", color: "#fff", padding: "12px 0", fontSize: "1.3rem", fontWeight: "bold", border: "none", borderRadius: "8px", cursor: "pointer", width: "100%" }}
            onClick={handleSubmit}
          >
            ثبت فاکتور
          </button>
        </div>
      </div>
    </div>
  );
}

// بخش فروشنده/خریدار
function SectionBox({ title, selected, setId, id, data, type }) {
  return (
    <div style={{ margin: "20px 0" }}>
      <h3>{title}</h3>
      <select value={id || ""} onChange={e => setId(e.target.value)} style={{ padding: "8px", borderRadius: "5px", minWidth: "200px" }}>
        <option value="">انتخاب کنید...</option>
        {data.map(d => <option key={d.id} value={d.id}>{type === "seller" ? d.name : d.full_name}</option>)}
      </select>
      {selected && (
        <div style={{ marginTop: "15px", padding: "10px", border: "1px solid #ccc", borderRadius: "5px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 20px" }}>
          {type === "seller" ? (
            <>
              <p><strong>نام تامین‌کننده:</strong> {selected.name}</p>
              <p><strong>شناسه ملی:</strong> {selected.national_id}</p>
              <p><strong>کد اقتصادی:</strong> {selected.economic_code}</p>
              <p><strong>کد پستی:</strong> {selected.postal_code}</p>
              <p><strong>شهر:</strong> {selected.city}</p>
              <p><strong>آدرس:</strong> {selected.address}</p>
              <p><strong>ایمیل:</strong> {selected.email}</p>
              <p><strong>تلفن:</strong> {selected.phone}</p>
              <p><strong>وبسایت:</strong> {selected.website}</p>
            </>
          ) : (
            <>
              <p><strong>نام و نام خانوادگی:</strong> {selected.full_name}</p>
              <p><strong>کد پرسنلی:</strong> {selected.personnel_code}</p>
              <p><strong>کد ملی:</strong> {selected.national_id}</p>
              <p><strong>نام پدر:</strong> {selected.father_name}</p>
              <p><strong>آدرس:</strong> {selected.address}</p>
              <p><strong>کد پستی:</strong> {selected.postal_code}</p>
              <p><strong>ایمیل:</strong> {selected.email}</p>
              <p><strong>سمت:</strong> {selected.position || "-"}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
