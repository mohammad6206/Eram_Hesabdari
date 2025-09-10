import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

export default function Inventory() {
    const [inventoryItems, setInventoryItems] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [invRes, whRes] = await Promise.all([
                    axiosInstance.get("/inventory-items/"),
                    axiosInstance.get("/warehouses/"),
                ]);
                setInventoryItems(invRes.data);
                setWarehouses(whRes.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, []);

    const warehouseStock = warehouses.map((w) => {
        const count = inventoryItems.filter((item) => item.warehouse === w.id).length;
        return { ...w, count };
    });

    // فیلتر کردن بر اساس همه فیلدها به جز تعداد و واحد
    const filteredItems = inventoryItems.filter((item) => {
        const searchLower = search.toLowerCase();
        return (
            item.product_name?.toLowerCase().includes(searchLower) ||
            item.product_code?.toLowerCase().includes(searchLower) ||
            item.invoice_number?.toLowerCase().includes(searchLower) ||
            item.serial_number?.toLowerCase().includes(searchLower) ||
            warehouses.find((w) => w.id === item.warehouse)?.name.toLowerCase().includes(searchLower)
        );
    });

    return (
        <div style={{ padding: "30px", fontFamily: "Tahoma, sans-serif", direction: "rtl", backgroundColor: "#f4f6f8" }}>
            <div style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "center",
                position: "relative",
                marginBottom: "25px"
            }}>
                {/* عنوان وسط */}
                <h2 style={{
                    color: "#27ae60",
                    fontSize: "3rem",
                    margin: 0,
                    textAlign: "center",
                }}>
                    ورودی انبار
                </h2>

                {/* باکس موجودی انبار کنار عنوان */}
                <div style={{
                    position: "absolute",
                    left: 0,
                    minWidth: "180px",
                    backgroundColor: "#fff",
                    borderRadius: "10px",
                    padding: "15px",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                    fontSize: "0.95rem",
                    lineHeight: "1.5",
                    height: "fit-content"
                }}>
                    <h4 style={{ marginBottom: "10px", color: "#27ae60", fontSize: "1rem", borderBottom: "1px solid #eee", paddingBottom: "5px",textAlign: "center"}}>موجودی انبارها</h4>
                    {warehouseStock.map((w, idx) => (
                        <div key={w.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                            <span>{w.name}:</span>
                            <span style={{ color: "#34495e",fontSize:"14px",fontWeight:"bold" }}>{w.count} کالا</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* بخش پایین: سرچ و جدول */}
            <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "150px" }}>
                <input
                    type="text"
                    placeholder="جستجو در نام کالا، کد اختصاصی، شماره فاکتور، سریال یا انبار..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{
                        padding: "12px 15px",
                        borderRadius: "10px",
                        border: "1px solid #ccc",
                        fontSize: "1rem",
                        boxShadow: "inset 0 2px 5px rgba(0,0,0,0.05)",
                        outline: "none"
                    }}
                />

                <div style={{ overflowX: "auto", borderRadius: "10px", backgroundColor: "#fff", boxShadow: "0 3px 8px rgba(0,0,0,0.05)" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead style={{ backgroundColor: "#27ae60", color: "#fff", fontSize: "0.95rem" }}>
                            <tr>
                                <th style={{ padding: "12px", textAlign: "center" }}>ردیف</th>
                                <th style={{ padding: "12px", textAlign: "center" }}>نام کالا</th>
                                <th style={{ padding: "12px", textAlign: "center" }}>کد اختصاصی</th>
                                <th style={{ padding: "12px", textAlign: "center" }}>شماره فاکتور</th>
                                <th style={{ padding: "12px", textAlign: "center" }}>انبار مقصد</th>
                                <th style={{ padding: "12px", textAlign: "center" }}>سریال کالا</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredItems.length > 0 ? (
                                filteredItems.map((item, idx) => (
                                    <tr key={item.id} style={{
                                        borderBottom: "1px solid #eee",
                                        fontSize: "0.9rem",
                                        color: "#34495e",
                                        backgroundColor: idx % 2 === 0 ? "#f9f9f9" : "#fff"
                                    }}>
                                        <td style={{ padding: "10px", textAlign: "center" }}>{idx + 1}</td>
                                        <td style={{ padding: "10px", textAlign: "center" }}>{item.product_name}</td>
                                        <td style={{ padding: "10px", textAlign: "center" }}>{item.product_code}</td>
                                        <td style={{ padding: "10px", textAlign: "center" }}>{item.invoice_number}</td>
                                        <td style={{ padding: "10px", textAlign: "center" }}>
                                            {warehouses.find((w) => w.id === item.warehouse)?.name || "-"}
                                        </td>
                                        <td style={{ padding: "10px", textAlign: "center" }}>{item.serial_number}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" style={{ padding: "15px", textAlign: "center", color: "#999" }}>
                                        موردی یافت نشد
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
