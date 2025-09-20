import React, { useState } from "react";
import "../styles/WarehouseTransfer.css";

export default function WarehouseTransfer() {
    const [transferRows, setTransferRows] = useState([]);
    const [fromWarehouse, setFromWarehouse] = useState("");
    const [toWarehouse, setToWarehouse] = useState("");
    const [transferMessage, setTransferMessage] = useState("");
    const [transferHistory, setTransferHistory] = useState([]);
    const [showDetails, setShowDetails] = useState(null);
    const [invoiceNumber, setInvoiceNumber] = useState("");

    // فرضی: لیست انبارها و کالاها
    const warehouses = ["انبار اصلی", "انبار فرعی", "انبار فروشگاه"];
    const products = [
        { serial: "12345", name: "کالا A", device: "دستگاه ۱" },
        { serial: "12346", name: "کالا B", device: "دستگاه ۲" },
    ];

    // ====================== مدیریت ردیف‌ها ======================
    const handleAddRow = () => {
        setTransferRows([...transferRows, { serial: "", product: null, fromInvoice: false, selected: false }]);
    };

    const handleSerialChange = (index, serial) => {
        const product = products.find((p) => p.serial === serial);
        const updated = [...transferRows];
        updated[index] = { serial, product: product || null, fromInvoice: false, selected: !!product };
        setTransferRows(updated);
        if (product) setFromWarehouse("انبار اصلی"); // فرضی
    };

    const toggleTransferItem = (index) => {
        const updated = [...transferRows];
        updated[index].selected = !updated[index].selected;
        setTransferRows(updated);
    };

    // ====================== مدیریت شماره فاکتور ======================
    const handleLoadInvoice = () => {
        if (!invoiceNumber) return;
        const invoiceProducts = products; // اینجا باید API بزنی برای بارگذاری کالاهای فاکتور
        const rows = invoiceProducts.map((p) => ({
            serial: p.serial,
            product: p,
            fromInvoice: true,
            selected: true,
        }));
        setTransferRows(rows);
        setFromWarehouse("انبار اصلی"); // فرضی
    };

    // ====================== انتقال کالا ======================
    const handleTransfer = () => {
        if (!toWarehouse) return;
        const transferredItems = transferRows.filter((r) => r.product && r.selected);
        if (!transferredItems.length) return;

        const historyItem = {
            id: Date.now(),
            from: fromWarehouse,
            to: toWarehouse,
            items: transferredItems,
            date: new Date(),
        };
        setTransferHistory([historyItem, ...transferHistory]);
        setTransferMessage(`${transferredItems.length} کالا از ${fromWarehouse} به ${toWarehouse} منتقل شد`);
        setTransferRows([]);
        setInvoiceNumber("");
        setToWarehouse("");
    };

    // ====================== JSX ======================
    return (
        <div className="warehouse-transfer-container">
            <h2 className="text-center mb-4">انتقال بین انبار</h2>
            {/* شماره فاکتور */}
            <div className="warehouse-transfer-invoice" style={{ marginBottom: "-50px" }}>
                <input
                    type="text"
                    placeholder="شماره فاکتور"
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    className="warehouse-transfer-input"
                    style={{ flex: 1, padding: "8px 12px", border: "1px solid #27ae60", borderRadius: "6px" }}
                />
                <button
                    className="warehouse-transfer-btn"
                    onClick={handleLoadInvoice}
                    style={{ marginLeft: "10px", padding: "8px 16px", borderRadius: "6px", background: "#27ae60", color: "#fff", border: "none", cursor: "pointer" }}
                >
                    بارگذاری کالاهای فاکتور
                </button>
            </div>
            {/* ردیف‌ها */}
            <div
                className="warehouse-transfer-rows"
                style={{
                    maxHeight: "250px",       // ارتفاع کوچیک‌تر
                    overflowY: "auto",        // اسکرول عمودی فعال
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    padding: "10px",
                    marginTop: "10px",
                    backgroundColor: "#fafafa",

                    width: "fit-content",     // فقط به اندازه محتوا
                    minWidth: "900px",        // حداقل عرض (هم‌عرض با input شماره فاکتور)
                    alignSelf: "flex-end"   // بچسبه به چپ/راست، نه کل صفحه
                }}
            >
                {transferRows.map((row, index) => (
                    <div
                        key={index}
                        className="warehouse-transfer-row"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            padding: "6px 0",
                            borderBottom: "1px solid #eee"
                        }}
                    >
                        <input
                            type="text"
                            placeholder="سریال کالا"
                            className="warehouse-transfer-input"
                            value={row.serial}
                            onChange={(e) => handleSerialChange(index, e.target.value)}
                            disabled={row.fromInvoice}
                            style={{
                                flex: 1,
                                padding: "6px 10px",
                                border: "1px solid #27ae60",
                                borderRadius: "6px"
                            }}
                        />
                        {row.product && (
                            <div
                                className="warehouse-transfer-product-info"
                                style={{ display: "flex", alignItems: "center", gap: "10px" }}
                            >
                                <span>{row.product.name}</span>
                                <span>{row.product.device}</span>
                                <button
                                    className={`warehouse-transfer-btn-toggle ${row.selected ? "remove" : ""}`}
                                    onClick={() => toggleTransferItem(index)}
                                    style={{
                                        padding: "4px 10px",
                                        borderRadius: "6px",
                                        border: "none",
                                        cursor: "pointer",
                                        background: row.selected ? "#e74c3c" : "#27ae60",
                                        color: "#fff"
                                    }}
                                >
                                    {row.selected ? "−" : "+"}
                                </button>
                            </div>
                        )}
                    </div>
                ))}

                {!invoiceNumber && (
                    <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                        {/* افزودن ردیف */}
                        <button
                            className="warehouse-transfer-btn-add"
                            onClick={handleAddRow}
                            style={{
                                flex: 1,  // دکمه‌ها هم‌اندازه بشن
                                padding: "8px 12px",
                                borderRadius: "6px",
                                background: "#2980b9",
                                color: "#fff",
                                border: "none",
                                cursor: "pointer"
                            }}
                        >
                            افزودن ردیف
                        </button>

                        {/* حذف ردیف */}
                        <button
                            className="warehouse-transfer-btn-remove"
                            onClick={() => {
                                if (transferRows.length === 0) return;
                                setTransferRows(prev => prev.slice(0, prev.length - 1));
                            }}
                            style={{
                                flex: 1,  // دکمه‌ها هم‌اندازه بشن
                                padding: "8px 12px",
                                borderRadius: "6px",
                                background: "#e74c3c",
                                color: "#fff",
                                border: "none",
                                cursor: "pointer"
                            }}
                        >
                            حذف ردیف
                        </button>
                    </div>
                )}
            </div>
            <hr className="warehouse-transfer-divider" />
            <div className="warehouse-transfer-from-to">
                {/* مبدا (ثابت و غیرقابل تغییر) */}
                <div className="warehouse-transfer-from text-center">
                    <label>از</label>
                    <input
                        className="warehouse-transfer-input"
                        value={fromWarehouse || "انبار اصلی"} // فرضی: انبار پیش‌فرض
                        disabled
                    />
                </div>

                {/* مقصد (قابل انتخاب) */}
                <div className="warehouse-transfer-to text-center">
                    <label>به</label>
                    <select
                        className="warehouse-transfer-input"
                        value={toWarehouse}
                        onChange={(e) => setToWarehouse(e.target.value)}
                    >
                        <option value="">انتخاب انبار مقصد</option>
                        {warehouses.map((w) => (
                            <option key={w} value={w}>
                                {w}
                            </option>
                        ))}
                    </select>
                </div>

                <button className="warehouse-transfer-btn-transfer" onClick={handleTransfer}>
                    انتقال
                </button>
            </div>

            {transferMessage && <p className="warehouse-transfer-message">{transferMessage}</p>}

            {/* جدول گزارش انتقال */}
            <div className="warehouse-transfer-table-wrapper">
                <h5>گزارش انتقال‌ها</h5>
                <table className="warehouse-transfer-table">
                    <thead>
                        <tr>
                            <th>تاریخ</th>
                            <th>از</th>
                            <th>به</th>
                            <th>تعداد کالا</th>
                            <th>عملیات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transferHistory.map((h) => (
                            <tr key={h.id}>
                                <td>{h.date.toLocaleString("fa-IR")}</td>
                                <td>{h.from}</td>
                                <td>{h.to}</td>
                                <td>{h.items.length}</td>
                                <td>
                                    <button className="warehouse-transfer-btn warehouse-transfer-btn-save" onClick={() => setShowDetails(h)}>
                                        جزئیات
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {transferHistory.length === 0 && (
                            <tr>
                                <td colSpan="5" className="text-muted">
                                    هنوز انتقالی ثبت نشده
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* مودال جزئیات */}
            {showDetails && (
                <div className="modal fade show d-block warehouse-transfer-modal" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog modal-md">
                        <div className="modal-content" dir="rtl">
                            <div className="modal-header">
                                <h5 className="modal-title w-100 text-center">جزئیات انتقال</h5>
                                <button type="button" className="btn-close" onClick={() => setShowDetails(null)}></button>
                            </div>
                            <div className="modal-body">
                                <p>از: {showDetails.from}</p>
                                <p>به: {showDetails.to}</p>
                                <p>تعداد کالا: {showDetails.items.length}</p>
                                <ul>
                                    {showDetails.items.map((item, i) => (
                                        <li key={i}>
                                            {item.product.name} - {item.product.device} (سریال: {item.serial})
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="modal-footer">
                                <button className="warehouse-transfer-btn warehouse-transfer-btn-cancel" onClick={() => setShowDetails(null)}>
                                    بستن
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
