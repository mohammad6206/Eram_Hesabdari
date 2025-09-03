import React, { useState, useEffect, useRef } from "react";
import Logo from "../assets/Logo.svg";
import { Link } from "react-router-dom";

export default function BuyInvoice() {
    const API_URL = process.env.REACT_APP_API_URL;

    const [invoiceNumber, setInvoiceNumber] = useState("");
    const [invoiceData, setInvoiceData] = useState(null);
    const [rows, setRows] = useState([]);
    const [sellerId, setSellerId] = useState("");
    const [buyerId, setBuyerId] = useState("");
    const [sellers, setSellers] = useState([]);
    const [personnel, setPersonnel] = useState([]);
    const [products, setProducts] = useState([]);
    const [invoiceFile, setInvoiceFile] = useState(null);
    const fileInputRef = useRef(null);

    // گرفتن داده‌های فروشنده
    useEffect(() => {
        fetch(`${API_URL}/api/sellers/`)
            .then(res => res.json())
            .then(data => setSellers(data))
            .catch(err => console.error(err));
    }, []);

    // گرفتن داده‌های خریدار
    useEffect(() => {
        fetch(`${API_URL}/api/personnels/`)
            .then(res => res.json())
            .then(data => setPersonnel(data))
            .catch(err => console.error(err));
    }, []);

    // گرفتن محصولات
    useEffect(() => {
        fetch(`${API_URL}/api/products/`)
            .then(res => res.json())
            .then(data => setProducts(data))
            .catch(err => console.error(err));
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

        // ✅ محاسبات خودکار
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




    const createInvoice = async () => {
        try {
            const formData = new FormData();
            formData.append("invoice_number", invoiceNumber);
            formData.append("seller", parseInt(sellerId));
            formData.append("buyer", parseInt(buyerId));
            formData.append("destination", invoiceData?.destination?.id || null);
            if (invoiceFile) formData.append("invoice_file", invoiceFile);

            const res = await fetch(`${API_URL}/api/buy-invoices/`, {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                const err = await res.json();
                console.error("Invoice creation error:", err);
                alert("خطا در ثبت فاکتور! جزئیات را Console ببینید.");
                return null;
            }

            const invoice = await res.json();
            console.log("Invoice created:", invoice);
            return invoice.id; // برگردوندن ID فاکتور
        } catch (err) {
            console.error("Network error:", err);
            alert("خطای شبکه یا سرور!");
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
                quantity: parseFloat(row.quantity) || 0,
                unit_price: parseFloat(row.unitPrice) || 0,
                tax_rate: parseFloat(row.taxRate) || 0,
                description: row.description || "",
            };

            const res = await fetch(`${API_URL}/api/buy-invoice-items/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(itemPayload),
            });

            if (!res.ok) {
                const err = await res.json();
                console.error(`Error creating item ${i + 1}:`, err);
            } else {
                const data = await res.json();
                console.log(`Item ${i + 1} created:`, data);
            }
        }
    };


    const handleSubmit = async () => {
        const invoiceId = await createInvoice();
        if (invoiceId) {
            await createInvoiceItems(invoiceId);
            alert("فاکتور و آیتم‌ها با موفقیت ثبت شدند!");

            // پاک کردن فرم
            setInvoiceNumber("");
            setSellerId("");
            setBuyerId("");
            setInvoiceFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
            setInvoiceData({ destination: null });
            setRows([]);
        }
    };








    // فقط جداکننده سه‌رقمی
    const formatNumber = (value) => {
        if (value === null || value === undefined || value === "") return "";
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    const [warehouses, setWarehouses] = useState([]);

    // گرفتن لیست انبارها
    useEffect(() => {
        fetch(`${API_URL}/api/warehouses/`)
            .then(res => res.json())
            .then(data => setWarehouses(data))
            .catch(err => console.error("خطا در گرفتن انبارها:", err));
    }, []);




    const addRow = () => setRows([...rows, {}]);


    const selectedSeller = sellers.find(s => s.id === parseInt(sellerId));
    const selectedBuyer = personnel.find(p => p.id === parseInt(buyerId));

    return (
        <div style={{ direction: "rtl", fontFamily: "Tahoma, sans-serif", padding: "30px" }}>
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
                    <Link to="/BuyInvoiceList" className="btn btn-success">
                        بازگشت
                    </Link>
                </div>
                </div>
            </div>


            <div style={{ marginBottom: "25px", display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "10px" }}>
                <span style={{ fontWeight: "bold" }}>شماره فاکتور:</span>
                <input
                    type="text"
                    value={invoiceNumber}
                    onChange={e => setInvoiceNumber(e.target.value)}
                    placeholder="شماره فاکتور"
                    style={{
                        padding: "4px 8px",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                        width: "200px"  // میتونی اندازه دلخواهت رو بدی
                    }}
                />
            </div>

            <SectionBox title="تامین کننده" selected={selectedSeller} setId={setSellerId} id={sellerId} data={sellers} type="seller" />
            <SectionBox title="خریدار" selected={selectedBuyer} setId={setBuyerId} id={buyerId} data={personnel} type="buyer" />

            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px", fontSize: "0.9rem" }}>
                <thead style={{ backgroundColor: "#27ae60", color: "#fff" }}>
                    <tr style={{ height: "50px" }}>
                        {["ردیف", "نام کالا", "کد اختصاصی", "تعداد", "مبلغ جزء (ریال)", "مبلغ کل (ریال)", "مالیات (%)", "مبلغ مالیات (ریال)", "مبلغ بعد از مالیات (ریال)", "توضیحات"].map((title, i) => (
                            <th key={i} style={{ border: "1px solid #ccc", padding: "12px", textAlign: "center" }}>{title}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, index) => (
                        <tr key={index}>
                            <td style={{ border: "1px solid #ccc", padding: "4px", textAlign: "center" }}>{index + 1}</td>
                            <td>
                                <select
                                    value={row.productId || ""}
                                    onChange={e => handleInputChange(index, "productId", e.target.value)}
                                    style={inputStyleWidth(150)}
                                >
                                    <option value="" hidden>انتخاب کالا</option>
                                    {products.map(p => (
                                        <option key={p.id} value={p.id}>
                                            {p.name}
                                        </option>
                                    ))}
                                </select>
                            </td>
                            <td>
                                <input
                                    type="text"
                                    value={row.product_code || ""}
                                    readOnly
                                    style={inputStyleWidth(100)}
                                />
                            </td>

                            <td>
                                <input
                                    type="number"
                                    value={row.quantity || ""}
                                    onChange={e => handleInputChange(index, "quantity", e.target.value)}
                                    style={inputStyleWidth(80)}
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    value={formatNumber(row.unitPrice) || ""}
                                    onChange={e => handleInputChange(index, "unitPrice", e.target.value.replace(/,/g, ""))}
                                    style={inputStyleWidth(100)}
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    value={formatNumber(row.totalAmount) || "0"}
                                    readOnly
                                    style={inputStyleWidth(100)}
                                />
                            </td>

                            <td>
                                <input
                                    type="number"
                                    value={row.taxRate || ""}
                                    onChange={e => handleInputChange(index, "taxRate", e.target.value)}
                                    style={inputStyleWidth(80)}
                                />
                            </td>

                            <td>
                                <input
                                    type="text"
                                    value={formatNumber(row.taxAmount) || "0"}
                                    readOnly
                                    style={inputStyleWidth(100)}
                                />
                            </td>

                            <td>
                                <input
                                    type="text"
                                    value={formatNumber(row.finalAmount) || "0"}
                                    readOnly
                                    style={inputStyleWidth(100)}
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    value={row.description || ""}
                                    onChange={e => handleInputChange(index, "description", e.target.value)}
                                    style={inputStyleWidth(150)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={addRow} style={{ backgroundColor: "#27ae60", color: "#fff", padding: "10px 25px", border: "none", borderRadius: "8px", cursor: "pointer", marginBottom: "30px" }}>+ اضافه کردن ردیف</button>

            <div style={{ marginTop: "30px", padding: "20px", border: "1px solid #27ae60", borderRadius: "10px", backgroundColor: "#f9fdfb", boxShadow: "0 3px 8px rgba(0,0,0,0.05)" }}>
                <h3 style={{ marginBottom: "20px", color: "#27ae60", borderBottom: "2px solid #27ae60", paddingBottom: "8px" }}>اطلاعات نهایی فاکتور</h3>
                <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "30px" }}>
                    <div style={{ flex: 1, minWidth: "250px" }}>
                        <label style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}>
                            مقصد کالا:
                        </label>
                        <select
                            value={invoiceData?.destination?.id || ""}
                            onChange={e =>
                                setInvoiceData({
                                    ...invoiceData,
                                    destination: warehouses.find(w => w.id === parseInt(e.target.value))
                                })
                            }
                            style={{
                                border: "1px solid #27ae60",
                                borderRadius: "6px",
                                padding: "8px 12px",
                                fontWeight: "bold",
                                width: "350 px",
                            }}
                        >
                            <option value="" hidden>انتخاب مقصد</option>
                            {warehouses.map(w => (
                                <option key={w.id} value={w.id}>
                                    {w.name}
                                </option>
                            ))}
                        </select>

                    </div>
                    <div style={{ flex: 1, minWidth: "250px" }}>
                        <label style={{ fontWeight: "bold", display: "block", marginBottom: "8px" }}>آپلود فاکتور فروشنده:</label>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={e => setInvoiceFile(e.target.files[0])}
                        />
                    </div>
                    <div style={{ flex: 1, minWidth: "200px" }}>
                        <label style={{ fontWeight: "bold", display: "block", marginBottom: "8px" }}>
                            جمع کل(ریال) :
                        </label>
                        <div
                            style={{
                                border: "1px solid #ccc",
                                borderRadius: "6px",
                                padding: "10px",
                                width: "100%",
                                backgroundColor: "#f8f9fa",
                                fontWeight: "bold",
                                textAlign: "center",
                                fontSize: "1rem",
                                userSelect: "none",
                            }}
                        >
                            {formatNumber(
                                rows.reduce((sum, r) => sum + (parseFloat(r.finalAmount) || 0), 0)
                            )}
                        </div>
                    </div>
                </div>
                <div style={{ marginTop: "30px" }}>
                    <button
                        style={{
                            backgroundColor: "#27ae60",
                            color: "#fff",
                            padding: "12px 0",
                            fontSize: "1.3rem",
                            fontWeight: "bold",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            width: "100%"
                        }}
                        onClick={handleSubmit} // اینجا تابع ارسال فرم صدا زده میشه
                    >
                        ثبت فاکتور
                    </button>
                </div>
            </div>
        </div>
    );
}

// استایل ورودی‌ها
const inputStyleWidth = (width) => ({
    border: "1px solid #ccc",
    padding: "6px",
    width: `${width}px`,
    borderRadius: "6px",
    outline: "none"
});

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
