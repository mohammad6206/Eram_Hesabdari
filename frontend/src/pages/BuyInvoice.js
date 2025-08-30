import React, { useState } from "react";
import Logo from "../assets/Logo.svg";

export default function PurchaseInvoice() {
    const [rows, setRows] = useState([{}]);
    const [sellerId, setSellerId] = useState("");
    const [buyerId, setBuyerId] = useState("");

    const personnel = [
        { id: 1, name: "علی رضایی", phone: "09120000001", email: "ali@email.com", address: "تهران - خیابان آزادی", position: "مدیر فروش" },
        { id: 2, name: "زهرا موسوی", phone: "09120000002", email: "zahra@email.com", address: "اصفهان - چهارباغ بالا", position: "کارشناس خرید" },
        { id: 3, name: "محمد کریمی", phone: "09120000003", email: "mohammad@email.com", address: "شیراز - خیابان زند", position: "مدیرعامل" },
    ];

    const selectedSeller = personnel.find((p) => p.id === parseInt(sellerId)) || {};
    const selectedBuyer = personnel.find((p) => p.id === parseInt(buyerId)) || {};

    const addRow = () => setRows([...rows, {}]);

    return (
        <div
            style={{
                direction: "rtl",
                fontFamily: "Tahoma, sans-serif",
                backgroundColor: "#fff",
                padding: "30px",
                border: "1px solid #dcdcdc",
                borderRadius: "12px",
                maxWidth: "1200px",
                margin: "30px auto",
                color: "#2c3e50",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
        >
            {/* هدر */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "30px",
                    borderBottom: "3px solid #27ae60",
                    paddingBottom: "15px",
                }}
            >
                <div style={{ textAlign: "right" }}>
                    <h1 style={{ fontSize: "2.2rem", color: "#27ae60", margin: 0 }}>فاکتور خرید</h1>
                </div>
                <div style={{ textAlign: "center", fontSize: "1rem", color: "#34495e" }}>
                    <b>شرکت تجهیزات پزشکی Medescop</b>
                    <br />
                    <a href="https://www.medescop-co.com" style={{ color: "#2980b9", textDecoration: "none" }}>
                        www.medescop-co.com
                    </a>
                </div>
                <div>
                    <img src={Logo} alt="Logo" style={{ width: "90px", height: "90px" }} />
                </div>
            </div>

            {/* شماره فاکتور */}
            <div
                style={{
                    marginBottom: "25px",
                    textAlign: "left",
                    fontSize: "1rem",
                    color: "#2c3e50",
                }}
            >
                <span style={{ fontWeight: "bold" }}>شماره فاکتور:</span>{" "}
                <span style={{ color: "#27ae60" }}>۱۲۳۴۵</span>
            </div>

            {/* فروشنده */}
            <SectionBox title="فروشنده" selected={selectedSeller} setId={setSellerId} id={sellerId} personnel={personnel} />

            {/* خریدار */}
            <SectionBox title="خریدار" selected={selectedBuyer} setId={setBuyerId} id={buyerId} personnel={personnel} />

            {/* جدول کالاها */}
            <table
                style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    marginBottom: "20px",
                    fontSize: "0.9rem",
                }}
            >
                <thead style={{ backgroundColor: "#27ae60", color: "#fff" }}>
                    <tr>
                        {[
                            "ردیف",
                            "نام کالا",
                            "کد اختصاصی",
                            "کد اقتصادی",
                            "تعداد",
                            "مبلغ جزء",
                            "مبلغ کل",
                            "مالیات (%)",
                            "مبلغ مالیات",
                            "مبلغ بعد از مالیات",
                            "توضیحات",
                        ].map((title, i) => (
                            <th
                                key={i}
                                style={{
                                    border: "1px solid #ccc",
                                    padding: "8px",
                                    textAlign: "center",
                                    fontWeight: "bold",
                                }}
                            >
                                {title}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((_, rowIndex) => (
                        <tr key={rowIndex}>
                            {Array(11)
                                .fill(0)
                                .map((_, colIndex) => {
                                    let inputType = "text";
                                    if ([0, 2, 3, 4, 5, 6, 7, 8, 9].includes(colIndex)) {
                                        inputType = "number";
                                    }
                                    return (
                                        <td key={colIndex} style={{ border: "1px solid #ccc", padding: "4px" }}>
                                            <input
                                                type={inputType}
                                                style={{
                                                    width: "100%",
                                                    padding: "6px",
                                                    border: "1px solid #d9d9d9",
                                                    borderRadius: "6px",
                                                    outline: "none",
                                                }}
                                            />
                                        </td>
                                    );
                                })}
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* دکمه اضافه کردن ردیف */}
            <button
                onClick={addRow}
                style={{
                    backgroundColor: "#27ae60",
                    color: "#fff",
                    padding: "10px 25px",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    marginBottom: "30px",
                    fontSize: "1rem",
                    boxShadow: "0 3px 6px rgba(0,0,0,0.2)",
                }}
            >
                + اضافه کردن ردیف
            </button>
            {/* بخش اطلاعات نهایی */}
            <div
                style={{
                    marginTop: "30px",
                    padding: "20px",
                    border: "1px solid #27ae60",
                    borderRadius: "10px",
                    backgroundColor: "#f9fdfb",
                    boxShadow: "0 3px 8px rgba(0,0,0,0.05)",
                }}
            >
                <h3
                    style={{
                        marginBottom: "20px",
                        color: "#27ae60",
                        borderBottom: "2px solid #27ae60",
                        paddingBottom: "8px",
                        fontSize: "1.2rem",
                    }}
                >
                    اطلاعات نهایی فاکتور
                </h3>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: "30px",
                        flexWrap: "wrap",
                    }}
                >
                    {/* مقصد کالا */}
                    <div style={{ flex: 1, minWidth: "250px" }}>
                        <label style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}>
                            مقصد کالا:
                        </label>
                        <span
                            style={{
                                display: "inline-block",
                                padding: "8px 12px",
                                background: "#ecfdf5",
                                border: "1px solid #27ae60",
                                borderRadius: "6px",
                                fontWeight: "bold",
                            }}
                        >
                            انبار قرنطینه
                        </span>
                    </div>

                    {/* آپلود فاکتور فروشنده */}
                    <div style={{ flex: 1, minWidth: "250px" }}>
                        <label style={{ fontWeight: "bold", display: "block", marginBottom: "8px" }}>
                            آپلود فاکتور فروشنده:
                        </label>
                        <input
                            type="file"
                            style={{
                                display: "block",
                                border: "1px solid #ccc",
                                borderRadius: "6px",
                                padding: "6px",
                                width: "100%",
                                cursor: "pointer",
                            }}
                        />
                    </div>

                    {/* جمع کل */}
                    <div style={{ flex: 1, minWidth: "200px" }}>
                        <label
                            style={{ fontWeight: "bold", display: "block", marginBottom: "8px" }}
                        >
                            جمع کل:
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
                            ---
                        </div>
                    </div>
                </div>

                {/* دکمه ثبت فاکتور تمام عرض و ارتفاع کم */}
                <div style={{ marginTop: "30px" }}>
                    <button
                        style={{
                            backgroundColor: "#27ae60",
                            color: "#fff",
                            padding: "12px 0",       // ارتفاع کم
                            fontSize: "1.3rem",
                            fontWeight: "bold",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                            transition: "0.3s",
                            width: "100%",           // عرض کل فرم
                        }}
                        onMouseEnter={e => (e.target.style.backgroundColor = "#219150")}
                        onMouseLeave={e => (e.target.style.backgroundColor = "#27ae60")}
                    >
                        ثبت فاکتور
                    </button>
                </div>
            </div>
        </div>
    );
}


// باکس فروشنده/خریدار
function SectionBox({ title, selected, setId, id, personnel }) {
    return (
        <div
            style={{
                marginBottom: "25px",
                border: "1px solid #27ae60",
                borderRadius: "10px",
                padding: "20px",
                backgroundColor: "#f9fdfb",
                boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
            }}
        >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px" }}>
                <label style={{ fontWeight: "bold" }}>{title}:</label>
                <select
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    style={{
                        padding: "6px",
                        minWidth: "200px",
                        border: "1px solid #ccc",
                        borderRadius: "6px",
                    }}
                >
                    <option value="">انتخاب {title}</option>
                    {personnel.map((p) => (
                        <option key={p.id} value={p.id}>
                            {p.name}
                        </option>
                    ))}
                </select>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                <input type="text" value={selected.id || ""} placeholder="کد پرسنلی" style={inputStyle} readOnly />
                <input type="text" value={selected.name || ""} placeholder="نام و نام خانوادگی" style={inputStyle} readOnly />
                <input type="text" value={selected.nationalId || ""} placeholder="کد ملی" style={inputStyle} />
                <input type="text" value={selected.phone || ""} placeholder="تلفن" style={inputStyle} />
                <input type="text" value={selected.email || ""} placeholder="ایمیل" style={inputStyle} />
                <input type="text" value={selected.address || ""} placeholder="آدرس" style={inputStyle} />
                <input type="text" value={selected.position || ""} placeholder="سمت" style={inputStyle} />
            </div>
        </div>
    );
}

// استایل ورودی‌ها
const inputStyle = {
    border: "1px solid #ccc",
    padding: "6px",
    width: "200px",
    borderRadius: "6px",
    outline: "none",
};

const inputStyleWidth = (width) => ({
    border: "1px solid #ccc",
    padding: "6px",
    width: `${width}px`,
    borderRadius: "6px",
    outline: "none",
});
