import { useEffect, useState } from "react";

export default function BuyInvoiceList() {
    const API_URL = process.env.REACT_APP_API_URL;
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_URL}/api/buy-invoices/`)
            .then((res) => res.json())
            .then((data) => {
                setInvoices(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching invoices:", err);
                setLoading(false);
            });
    }, []);

    const handleDelete = (id) => {
        if (!window.confirm("آیا مطمئن هستید می‌خواهید حذف کنید؟")) return;

        fetch(`${API_URL}/api/buy-invoices/${id}/`, { method: "DELETE" })
            .then(() => {
                setInvoices((prev) => prev.filter((inv) => inv.id !== id));
            })
            .catch((err) => console.error("Error deleting invoice:", err));
    };

    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // 🟢 باز کردن مدال ویرایش
    const handleEdit = (invoice) => {
        setSelectedInvoice(invoice);
        setShowModal(true);
    };

    // 🟢 ذخیره تغییرات
    const handleSaveEdit = () => {
        fetch(`${API_URL}/api/buy-invoices/${selectedInvoice.id}/`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(selectedInvoice),
        })
            .then((res) => res.json())
            .then((data) => {
                setInvoices((prev) =>
                    prev.map((inv) => (inv.id === data.id ? data : inv))
                );
                setShowModal(false);
            })
            .catch((err) => console.error("Error updating invoice:", err));
    };


    if (loading) return <p>در حال بارگذاری...</p>;

    return (
        <div className="container my-4 p-4 border rounded shadow-sm" dir="rtl">
            <div className="mb-3 text-start">
                <button
                    className="btn btn-success"
                    onClick={() => (window.location.href = "/buy-invoice")}
                >
                    ثبت فاکتور جدید
                </button>
            </div>

            <h2 className="text-center mb-4">لیست فاکتورهای خرید</h2>

            <div className="table-responsive">
                <table className="table table-striped table-bordered text-end">
                    <thead className="table-primary">
                        <tr>
                            <th>شماره فاکتور</th>
                            <th>تامین‌کننده</th>
                            <th>خریدار</th>
                            <th>مقصد کالا</th>
                            <th>جمع کل (ریال)</th>
                            <th>فایل فاکتور</th>
                            <th>عملیات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices.length > 0 ? (
                            invoices.map((inv) => (
                                <tr key={inv.id}>
                                    <td>{inv.invoice_number}</td>
                                    <td>{inv.seller}</td>
                                    <td>{inv.buyer}</td>
                                    <td>{inv.destination}</td>
                                    <td>{inv.total_amount ? Number(inv.total_amount).toLocaleString("en-US") : "-"}</td>

                                    <td>
                                        {inv.invoice_file ? (
                                            <button
                                                className="btn btn-sm btn-info"
                                                onClick={() => {
                                                    const fileUrl = inv.invoice_file.startsWith("http")
                                                        ? inv.invoice_file // URL کامل
                                                        : `${API_URL}${inv.invoice_file}`; // مسیر نسبی
                                                    window.open(
                                                        fileUrl,
                                                        "_blank",
                                                        "width=900,height=600,scrollbars=yes,resizable=yes"
                                                    );
                                                }}
                                            >
                                                مشاهده فایل
                                            </button>
                                        ) : (
                                            "-"
                                        )}
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-warning me-2"
                                            onClick={() => handleEdit(inv)}
                                        >
                                            ویرایش
                                        </button>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleDelete(inv.id)}
                                        >
                                            حذف
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center">
                                    فاکتوری ثبت نشده است.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {showModal && selectedInvoice && (
                <div className="modal show d-block" tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content" dir="rtl">
                            <div className="modal-header">
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowModal(false)}
                                ></button>
                                <h5 className="modal-title">ویرایش فاکتور {selectedInvoice.invoice_number}</h5>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">شماره فاکتور</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={selectedInvoice.invoice_number}
                                        onChange={(e) =>
                                            setSelectedInvoice((prev) => ({
                                                ...prev,
                                                invoice_number: e.target.value,
                                            }))
                                        }
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">تامین‌کننده</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={selectedInvoice.seller}
                                        onChange={(e) =>
                                            setSelectedInvoice((prev) => ({
                                                ...prev,
                                                invoice_number: e.target.value,
                                            }))
                                        }
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">خریدار</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={selectedInvoice.buyer}
                                        onChange={(e) =>
                                            setSelectedInvoice((prev) => ({
                                                ...prev,
                                                invoice_number: e.target.value,
                                            }))
                                        }
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">مقصد کالا</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={selectedInvoice.destination}
                                        onChange={(e) =>
                                            setSelectedInvoice((prev) => ({
                                                ...prev,
                                                invoice_number: e.target.value,
                                            }))
                                        }
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">مبلغ کل (ریال)</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={
                                            selectedInvoice.invoice_number
                                                ? Number(selectedInvoice.total_amount).toLocaleString("en-US") // سه‌رقمی کردن
                                                : ""
                                        }
                                        onChange={(e) => {
                                            // حذف ویرگول‌های قبلی
                                            const rawValue = e.target.value.replace(/,/g, "");
                                            // فقط عدد مجاز باشه
                                            if (!isNaN(rawValue)) {
                                                setSelectedInvoice((prev) => ({
                                                    ...prev,
                                                    invoice_number: rawValue, // ذخیره بدون ویرگول
                                                }));
                                            }
                                        }}
                                    />

                                </div>

                                {/* اینجا می‌تونی seller/buyer/destination رو هم با selectbox بذاری */}
                            </div>

                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowModal(false)}
                                >
                                    لغو
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-success"
                                    onClick={handleSaveEdit}
                                >
                                    ذخیره تغییرات
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
