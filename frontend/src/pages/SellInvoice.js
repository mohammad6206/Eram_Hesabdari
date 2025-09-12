import React, { useState, useEffect, useRef } from "react";
import Logo from "../assets/Logo.svg";
import { Link } from "react-router-dom";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import axiosInstance from "../api/axiosInstance";

export default function SellInvoice() {
    const [invoiceNumber, setInvoiceNumber] = useState("");
    const [invoiceData, setInvoiceData] = useState({ destination: null });
    const [rows, setRows] = useState([]);
    const [sellerId, setSellerId] = useState("");
    const [buyerId, setBuyerId] = useState("");
    const [sellers, setSellers] = useState([]);
    const [products, setProducts] = useState([]);
    const [invoiceFile, setInvoiceFile] = useState(null);
    const [warehouses, setWarehouses] = useState([]);
    const fileInputRef = useRef(null);
    const [createdAt, setCreatedAt] = useState(null);
    const [errors, setErrors] = useState({});
    const [units, setUnits] = useState([]);
    const [buyers, setBuyers] = useState([]);
    const [inventory, setInventory] = useState({});
    const [inventoryTooltipIndex, setInventoryTooltipIndex] = useState(null);
    const [productUnits, setProductUnits] = useState({}); // key: index, value: units array


    const thStyle = { border: "1px solid #ccc", padding: "12px", textAlign: "center" };
    const tdStyle = { border: "1px solid #ccc", padding: "4px", textAlign: "center" };

    // بارگذاری داده‌ها
    useEffect(() => {
        axiosInstance.get("/units/")
            .then(res => setUnits(res.data))
            .catch(err => console.error(err));

        axiosInstance.get("/sellers/")
            .then(res => setSellers(res.data))
            .catch(err => console.error(err));

        axiosInstance.get("/buyers/")
            .then(res => setBuyers(res.data))
            .catch(err => console.error(err));

        axiosInstance.get("/products/")
            .then(res => setProducts(res.data))
            .catch(err => console.error(err));

        axiosInstance.get("/warehouses/")
            .then(res => setWarehouses(res.data))
            .catch(err => console.error(err));
    }, []);

    const fetchProductUnits = async (index, productId) => {
        if (!productId) return;
        try {
            const res = await axiosInstance.get("/product_units/", { params: { product_id: productId } });
            setProductUnits(prev => ({ ...prev, [index]: res.data.units }));
        } catch (err) {
            console.error(err);
            setProductUnits(prev => ({ ...prev, [index]: [] }));
        }
    };

    useEffect(() => {
        const fetchInventory = async () => {
            if (!invoiceData?.destination?.id) return;

            const updatedInventory = {};
            for (let i = 0; i < rows.length; i++) {
                const productId = rows[i].productId;
                if (!productId) continue;

                updatedInventory[i] = null; // حالت لودینگ
                try {
                    const res = await axiosInstance.get(`/check-inventory/`, {
                        params: {
                            product_id: productId,
                            warehouse_id: invoiceData.destination.id
                        }
                    });
                    updatedInventory[i] = res.data.available_quantity;
                } catch (err) {
                    console.error(`خطا در گرفتن موجودی ردیف ${i + 1}:`, err);
                    updatedInventory[i] = 0;
                }
            }
            setInventory(updatedInventory);
        };

        fetchInventory();
    }, [rows.map(r => r.productId).join(","), invoiceData?.destination?.id]);

    const handleInputChange = async (index, field, value) => {
        const updatedRows = [...rows];

        if (field === "productId") {
            const selectedProduct = products.find(p => p.id === parseInt(value));
            updatedRows[index].productId = value;
            updatedRows[index].product_code = selectedProduct ? selectedProduct.product_code : "";
            fetchProductUnits(index, value);

        } else {
            updatedRows[index][field] = value;
        }

        // محاسبه مالیات و جمع
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
            if (createdAt) formData.append("created_at", createdAt.toDate().toISOString());
            if (invoiceFile) formData.append("invoice_file", invoiceFile);

            const res = await axiosInstance.post("/sell-invoices/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": "Bearer " + localStorage.getItem("access_token")
                }
            });

            return res.data.id;
        } catch (err) {
            alert("خطا در ثبت فاکتور!");
            console.error(err);
            return null;
        }
    };

    const createInvoiceItems = async (invoiceId) => {
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const itemPayload = {
                sell_invoice: invoiceId,
                product: parseInt(row.productId),
                product_code: row.product_code || "",
                unit: parseInt(row.unitId) || null,
                quantity: parseFloat(row.quantity) || 0,
                unit_price: parseFloat(row.unitPrice) || 0,
                tax_rate: parseFloat(row.taxRate) || 0,
                description: row.description || "",
            };

            try {
                await axiosInstance.post("/sell-invoice-items/", itemPayload);
            } catch (err) {
                console.error(`خطا در ثبت آیتم ${i + 1}`, err);
            }
        }
    };

    const handleSubmit = async () => {
        let newErrors = {};

        if (!invoiceNumber.trim()) newErrors.invoiceNumber = "لطفاً شماره فاکتور را وارد کنید.";
        if (!createdAt) newErrors.createdAt = "لطفاً تاریخ ایجاد را انتخاب کنید.";
        if (!sellerId) newErrors.sellerId = "لطفاً تامین‌کننده را انتخاب کنید.";
        if (!buyerId) newErrors.buyerId = "لطفاً خریدار را انتخاب کنید.";
        if (!invoiceData?.destination?.id) newErrors.destination = "لطفاً خروج از انبار را انتخاب کنید.";
        if (!invoiceFile) newErrors.invoiceFile = "لطفاً فاکتور را آپلود کنید.";
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
    const selectedBuyer = buyers.find(b => b.id === parseInt(buyerId));

    return (
        <div style={{ direction: "rtl", fontFamily: "Tahoma, sans-serif", padding: "30px" }}>
            {/* سربرگ */}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "30px", borderBottom: "3px solid #27ae60", paddingBottom: "15px" }}>
                <div style={{ textAlign: "right", flex: 1 }}>
                    <h1 style={{ fontSize: "2.2rem", color: "#27ae60", margin: 0 }}>فاکتور فروش</h1>
                </div>
                <div style={{ textAlign: "center", flex: 1, fontSize: "1rem", color: "#34495e" }}>
                    <b>شرکت تجهیزات پزشکی Tebnology</b>
                    <br />
                    <a href="https://www.Tebnology-co.com" style={{ color: "#2980b9", textDecoration: "none" }}>www.Tebnology-co.com</a>
                </div>
                <div style={{ flex: 1, textAlign: "left" }}>
                    <img src={Logo} alt="Logo" style={{ width: "90px", height: "90px" }} />
                    <div className="mt-5 mb-4 text-start">
                        <Link to="/SellInvoiceList" className="btn btn-success">بازگشت</Link>
                    </div>
                </div>
            </div>

            {/* شماره فاکتور و تاریخ */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "20px" }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ fontWeight: "bold" }}>شماره فاکتور:</span>
                        <input type="text" value={invoiceNumber} onChange={e => setInvoiceNumber(e.target.value)} placeholder="شماره فاکتور" style={{ padding: "4px 8px", borderRadius: "4px", border: "1px solid #ccc", width: "200px" }} />
                    </div>
                    {errors.invoiceNumber && <p style={{ color: "red", fontSize: "0.8rem", marginTop: "4px" }}>{errors.invoiceNumber}</p>}
                </div>

                <div style={{ display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ fontWeight: "bold" }}>تاریخ ایجاد:</span>
                        <DatePicker calendar={persian} locale={persian_fa} value={createdAt} onChange={setCreatedAt} format="HH:mm YYYY/MM/DD" calendarPosition="bottom-right" style={{ border: "1px solid #ccc", borderRadius: "4px", padding: "4px 8px", width: "200px" }} inputClass="form-input" placeholder="انتخاب تاریخ" timePicker />
                    </div>
                    {errors.createdAt && <p style={{ color: "red", fontSize: "0.8rem", marginTop: "4px" }}>{errors.createdAt}</p>}
                </div>
            </div>

            {/* بخش فروشنده و خریدار */}
            <SectionBox title="خریدار" selected={selectedBuyer} setId={setBuyerId} id={buyerId} data={buyers} type="buyer" />
            <SectionBox title="تامین کننده" selected={selectedSeller} setId={setSellerId} id={sellerId} data={sellers} type="seller" />

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
                                <div style={{ position: "relative", display: "inline-block" }}>
                                    <select
                                        value={row.productId || ""}
                                        onChange={e => handleInputChange(index, "productId", e.target.value)}
                                        style={{ width: "150px" }}
                                        onFocus={() => setInventoryTooltipIndex(index)}
                                        onBlur={() => setInventoryTooltipIndex(null)}
                                    >
                                        <option value="" hidden>انتخاب کالا</option>
                                        {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                    </select>

                                    {inventoryTooltipIndex === index && row.productId && (
                                        <div style={{
                                            position: "absolute",
                                            bottom: "125%",
                                            left: "50%",
                                            transform: "translateX(-50%)",
                                            padding: "6px 10px",
                                            backgroundColor: "rgba(0,0,0,0.75)",
                                            color: "#fff",
                                            borderRadius: "6px",
                                            fontSize: "0.8rem",
                                            whiteSpace: "nowrap",
                                            zIndex: 1000,
                                            boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
                                        }}>
                                            موجودی: {inventory[index] !== undefined ? inventory[index] : "در حال بارگذاری..."}
                                        </div>
                                    )}
                                </div>
                            </td>
                            <td style={tdStyle}><input type="text" value={row.product_code || ""} readOnly style={{ width: "100px" }} /></td>
                            <td style={tdStyle}>
                                {/* سلکت واحد */}
                                <div style={{ position: "relative", display: "inline-block" }}>
                                    <select
                                        value={row.unitId || ""}
                                        onChange={e => handleInputChange(index, "unitId", e.target.value)}
                                        style={{ width: "100px", marginBottom: "5px" }}
                                        onFocus={() => setInventoryTooltipIndex(index)}  // استفاده از همان state برای کنترل tooltip
                                        onBlur={() => setInventoryTooltipIndex(null)}
                                    >
                                        {units.map(u => <option key={u.id} value={u.id}>{u.title}</option>)}
                                    </select>

                                    {/* نمایش پیشنهاد واحد */}
                                    {inventoryTooltipIndex === index && row.productId && (
                                        <div style={{
                                            position: "absolute",
                                            bottom: "125%",
                                            left: "50%",
                                            transform: "translateX(-50%)",
                                            padding: "6px 10px",
                                            backgroundColor: "rgba(0,0,0,0.75)",
                                            color: "#fff",
                                            borderRadius: "6px",
                                            fontSize: "0.8rem",
                                            whiteSpace: "nowrap",
                                            zIndex: 1000,
                                            boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
                                        }}>
                                            واحدهای ثبت شده: {productUnits[index]?.length ? productUnits[index].map(u => u.title).join(", ") : "-"}
                                        </div>
                                    )}
                                </div>

                                {/* تعداد */}
                                <input
                                    type="number"
                                    value={row.quantity || ""}
                                    onChange={e => {
                                        const value = parseFloat(e.target.value) || 0;

                                        // بررسی موجودی همزمان با تایپ
                                        if (value > (inventory[index] || 0)) {
                                            setErrors(prev => ({
                                                ...prev,
                                                [`row_${index}_quantity`]: `تعداد وارد شده بیشتر از موجودی است! (${inventory[index] || 0})`
                                            }));
                                        } else {
                                            // پاک کردن خطا اگر درست بود
                                            setErrors(prev => {
                                                const next = { ...prev };
                                                delete next[`row_${index}_quantity`];
                                                return next;
                                            });
                                        }

                                        handleInputChange(index, "quantity", value);
                                    }}
                                    style={{ width: "60px" }}
                                />

                                {/* نمایش خطا */}
                                {errors[`row_${index}_quantity`] && (
                                    <p style={{ color: "red", fontSize: "0.8rem", marginTop: "2px" }}>
                                        {errors[`row_${index}_quantity`]}
                                    </p>
                                )}
                            </td>
                            <td style={tdStyle}><input type="text" value={formatNumber(row.unitPrice)} onChange={e => handleInputChange(index, "unitPrice", e.target.value.replace(/,/g, ""))} style={{ width: "100px" }} /></td>
                            <td style={tdStyle}><input type="text" value={formatNumber(row.totalAmount)} readOnly style={{ width: "100px" }} /></td>
                            <td style={tdStyle}><input type="number" value={row.taxRate} onChange={e => handleInputChange(index, "taxRate", e.target.value)} style={{ width: "80px" }} /></td>
                            <td style={tdStyle}><input type="text" value={formatNumber(row.taxAmount)} readOnly style={{ width: "100px" }} /></td>
                            <td style={tdStyle}><input type="text" value={formatNumber(row.finalAmount)} readOnly style={{ width: "100px" }} /></td>
                            <td style={tdStyle}><input type="text" value={row.description} onChange={e => handleInputChange(index, "description", e.target.value)} style={{ width: "150px" }} /></td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* دکمه‌ها */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "30px" }}>
                <button onClick={addRow} style={{ backgroundColor: "#27ae60", color: "#fff", padding: "10px 25px", border: "none", borderRadius: "8px", cursor: "pointer" }}>+ اضافه کردن ردیف</button>
                <button onClick={() => rows.length > 0 && removeRow(rows.length - 1)} style={{ backgroundColor: "#c0392b", color: "#fff", padding: "10px 25px", border: "none", borderRadius: "8px", cursor: rows.length > 0 ? "pointer" : "not-allowed" }} disabled={rows.length === 0}>- حذف آخرین ردیف</button>
            </div>

            {/* اطلاعات نهایی */}
            {errors.rows && <p style={{ color: "red" }}>{errors.rows}</p>}
            <div style={{ marginTop: "30px", padding: "20px", border: "1px solid #27ae60", borderRadius: "10px", backgroundColor: "#f9fdfb", boxShadow: "0 3px 8px rgba(0,0,0,0.05)" }}>
                <h3 style={{ marginBottom: "20px", color: "#27ae60", borderBottom: "2px solid #27ae60", paddingBottom: "8px" }}>اطلاعات نهایی فاکتور</h3>
                <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "30px" }}>
                    <div style={{ flex: 1, minWidth: "250px" }}>
                        <label style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}>خروج از انبار:</label>
                        <select value={invoiceData?.destination?.id || ""} onChange={e => setInvoiceData({ ...invoiceData, destination: warehouses.find(w => w.id === parseInt(e.target.value)) })} style={{ border: "1px solid #27ae60", borderRadius: "6px", padding: "8px 12px", fontWeight: "bold", width: "350px" }}>
                            <option value="" hidden>انتخاب انبار</option>
                            {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                        </select>
                        {errors.destination && <p style={{ color: "red", fontSize: "0.8rem" }}>{errors.destination}</p>}
                    </div>
                    <div style={{ flex: 1, minWidth: "250px" }}>
                        <label style={{ fontWeight: "bold", display: "block", marginBottom: "8px" }}>آپلود فاکتور :</label>
                        <input type="file" ref={fileInputRef} onChange={e => { const file = e.target.files[0]; setInvoiceFile(file); if (file) { setErrors(prev => { const next = { ...prev }; delete next.invoiceFile; return next; }) } }} style={{ border: errors.invoiceFile ? "1px solid red" : "1px solid #ccc", padding: "6px", borderRadius: "6px" }} />
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
                    <button style={{ backgroundColor: "#27ae60", color: "#fff", padding: "12px 0", fontSize: "1.3rem", fontWeight: "bold", border: "none", borderRadius: "8px", cursor: "pointer", width: "100%" }} onClick={handleSubmit}>
                        ثبت فاکتور
                    </button>
                </div>
            </div>
        </div>
    );
}

function SectionBox({ title, selected, setId, id, data, type }) {
    return (
        <div style={{ margin: "20px 0" }}>
            <h3>{title}</h3>
            <select value={id || ""} onChange={e => setId(e.target.value)} style={{ padding: "8px", borderRadius: "5px", minWidth: "200px" }}>
                <option value="">انتخاب کنید...</option>
                {data.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>

            {selected && (
                <div style={{ marginTop: "15px", padding: "10px", border: "1px solid #ccc", borderRadius: "5px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 20px" }}>
                    {type === "buyer" ? (
                        <>
                            <p><strong>نام مرکز / نام شخص :</strong> {selected.name}</p>
                            <p><strong>شماره تماس :</strong> {selected.contact_phone}</p>
                            <p><strong>شناسه ملی :</strong> {selected.national_id}</p>
                            <p><strong>کد اقتصادی:</strong> {selected.economic_code}</p>
                            <p><strong>کد پستی:</strong> {selected.postal_code}</p>
                            <p><strong>آدرس:</strong> {selected.address}</p>
                        </>
                    ) : (
                        <>
                            <p><strong>نام تامین‌کننده:</strong> {selected.name}</p>
                            <p><strong>شناسه ملی:</strong> {selected.national_id}</p>
                            <p><strong>کد اقتصادی:</strong> {selected.economic_code}</p>
                            <p><strong>کد پستی:</strong> {selected.postal_code}</p>
                            <p><strong>شهر :</strong> {selected.city}</p>
                            <p><strong>آدرس:</strong> {selected.address}</p>
                            <p><strong>ایمیل:</strong> {selected.email}</p>
                            <p><strong>شماره تماس:</strong> {selected.phone}</p>
                            <p><strong>آدرس وبسایت :</strong> {selected.website}</p>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
