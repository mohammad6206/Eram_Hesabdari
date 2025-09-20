import React, { useState } from "react";
import "../styles/productpakage.css";

export default function ProductPakage() {
    const [packages, setPackages] = useState([]);
    const [newPackage, setNewPackage] = useState({
        number: "",
        name: "",
        device: "",
        items: [],
    });
    const [showModal, setShowModal] = useState(false);
    const [viewPackage, setViewPackage] = useState(null);

    // فرضی: لیست دستگاه‌ها و کالاها
    const devices = [
        {
            id: 1,
            title: "دستگاه ۱",
            products: ["قطعه A", "قطعه B", "قطعه C"],
        },
        {
            id: 2,
            title: "دستگاه ۲",
            products: ["قطعه X", "قطعه Y"],
        },
    ];

    const handleCreatePackage = () => {
        if (!newPackage.name.trim() || !newPackage.device) return;
        setPackages([...packages, { ...newPackage, id: Date.now() }]);
        setNewPackage({ number: "", name: "", device: "", items: [] });
        setShowModal(false);
    };

    const handleDeletePackage = (id) => {
        if (!window.confirm("آیا مطمئن هستید می‌خواهید حذف کنید؟")) return;
        setPackages(packages.filter((p) => p.id !== id));
    };

    const toggleItem = (item) => {
        if (newPackage.items.includes(item)) {
            setNewPackage({
                ...newPackage,
                items: newPackage.items.filter((i) => i !== item),
            });
        } else {
            setNewPackage({
                ...newPackage,
                items: [...newPackage.items, item],
            });
        }
    };

    return (
        <div className="product-pakage-container">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>مدیریت پک کالا</h2>
                <button
                    className="product-pakage-btn product-pakage-btn-add"
                    onClick={() => setShowModal(true)}
                >
                    ایجاد پک جدید
                </button>
            </div>

            {/* جدول لیست پک‌ها */}
            <div className="product-pakage-table-wrapper">
                <table className="product-pakage-table text-center">
                    <thead>
                        <tr>
                            <th>شماره پک</th>
                            <th>نام پک</th>
                            <th>دستگاه</th>
                            <th>تعداد قطعات</th>
                            <th>عملیات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {packages.length > 0 ? (
                            packages.map((p) => (
                                <tr key={p.id}>
                                    <td>{p.number || "-"}</td>
                                    <td>{p.name}</td>
                                    <td>
                                        {devices.find((d) => d.id === Number(p.device))?.title ||
                                            "-"}
                                    </td>
                                    <td>{p.items.length}</td>
                                    <td>
                                        <button
                                            className="product-pakage-btn product-pakage-btn-save"
                                            onClick={() => setViewPackage(p)}
                                        >
                                            مشاهده
                                        </button>
                                        <button className="product-pakage-btn product-pakage-btn-edit">
                                            ویرایش
                                        </button>
                                        <button
                                            className="product-pakage-btn product-pakage-btn-delete"
                                            onClick={() => handleDeletePackage(p.id)}
                                        >
                                            حذف
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-muted">
                                    هیچ پکی ثبت نشده است.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* مودال ایجاد پک */}
            {showModal && (
                <div
                    className="modal fade show d-block"
                    tabIndex="-1"
                    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                >
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content" dir="rtl">
                            <div className="modal-header">
                                <h5 className="modal-title text-center w-100">ایجاد پک جدید</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                {/* فرم ایجاد پک */}
                                <div className="product-pakage-form-section">
                                    <input
                                        className="product-pakage-input"
                                        placeholder="شماره پک"
                                        value={newPackage.number}
                                        onChange={(e) =>
                                            setNewPackage({ ...newPackage, number: e.target.value })
                                        }
                                    />
                                    <input
                                        className="product-pakage-input"
                                        placeholder="نام پک"
                                        value={newPackage.name}
                                        onChange={(e) =>
                                            setNewPackage({ ...newPackage, name: e.target.value })
                                        }
                                    />
                                    <select
                                        className="product-pakage-input"
                                        value={newPackage.device}
                                        onChange={(e) =>
                                            setNewPackage({
                                                ...newPackage,
                                                device: e.target.value,
                                                items: [],
                                            })
                                        }
                                    >
                                        <option value="">انتخاب دستگاه</option>
                                        {devices.map((d) => (
                                            <option key={d.id} value={d.id}>
                                                {d.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* لیست کالاهای دستگاه */}
                                {newPackage.device && (
                                    <div className="product-pakage-item-list">
                                        {devices
                                            .find((d) => String(d.id) === newPackage.device)
                                            ?.products.map((prod) => (
                                                <div key={prod} className="product-pakage-item-row">
                                                    <span>{prod}</span>
                                                    <button
                                                        className={`product-pakage-btn-toggle ${newPackage.items.includes(prod) ? "remove" : ""
                                                            }`}
                                                        onClick={() => toggleItem(prod)}
                                                    >
                                                        {newPackage.items.includes(prod) ? "−" : "+"}
                                                    </button>
                                                </div>
                                            ))}
                                    </div>
                                )}

                                {/* لیست قطعات انتخابی */}
                                {newPackage.items.length > 0 && (
                                    <div className="product-pakage-item-list mt-3">
                                        <h6>قطعات انتخاب‌شده:</h6>
                                        {newPackage.items.map((item, idx) => (
                                            <div key={idx} className="product-pakage-item-row">
                                                <span>{item}</span>
                                                <button
                                                    className="product-pakage-btn-toggle remove"
                                                    onClick={() => toggleItem(item)}
                                                >
                                                    −
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button
                                    className="product-pakage-btn product-pakage-btn-cancel"
                                    onClick={() => setShowModal(false)}
                                >
                                    لغو
                                </button>
                                <button
                                    className="product-pakage-btn product-pakage-btn-save"
                                    onClick={handleCreatePackage}
                                >
                                    ذخیره پک
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* مودال مشاهده پک */}
            {viewPackage && (
                <div
                    className="modal fade show d-block"
                    tabIndex="-1"
                    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                >
                    <div className="modal-dialog modal-md">
                        <div className="modal-content" dir="rtl">
                            <div className="modal-header">
                                <h5 className="modal-title">مشاهده پک</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setViewPackage(null)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <p>شماره پک: {viewPackage.number}</p>
                                <p>نام پک: {viewPackage.name}</p>
                                <p>
                                    دستگاه:{" "}
                                    {devices.find((d) => d.id === Number(viewPackage.device))
                                        ?.title || "-"}
                                </p>
                                <h6>لیست قطعات:</h6>
                                {viewPackage.items.length > 0 ? (
                                    <ul>
                                        {viewPackage.items.map((item, i) => (
                                            <li key={i}>{item}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>هیچ قطعه‌ای انتخاب نشده.</p>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button
                                    className="product-pakage-btn product-pakage-btn-cancel"
                                    onClick={() => setViewPackage(null)}
                                >
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
