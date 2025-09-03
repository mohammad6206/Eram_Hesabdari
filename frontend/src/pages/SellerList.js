import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;

export default function SellerList() {
    const [sellerList, setSellerList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedSeller, setSelectedSeller] = useState(null);

    // دریافت لیست فروشندگان
    const fetchSellers = () => {
        fetch(`${API_URL}/api/sellers/`)
            .then(res => res.json())
            .then(data => setSellerList(data))
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchSellers();
    }, []);

    // باز کردن مودال و انتخاب فروشنده
    const handleEdit = (seller) => {
        setSelectedSeller(seller);
        setShowModal(true);
    };

    // حذف فروشنده
    const handleDelete = (id) => {
        if (!window.confirm("آیا مطمئن هستید که می‌خواهید این تامین‌کننده را حذف کنید؟")) return;
        fetch(`${API_URL}/api/sellers/${id}/`, { method: "DELETE" })
            .then(res => {
                if (!res.ok) throw new Error("خطا در حذف فروشنده");
                fetchSellers(); // رفرش جدول
            })
            .catch(err => console.error(err));
    };

    // ذخیره تغییرات (ویرایش فروشنده)
    const handleUpdate = () => {
        if (!selectedSeller) return;

        fetch(`${API_URL}/api/sellers/${selectedSeller.id}/`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(selectedSeller),
        })
            .then(res => {
                if (!res.ok) throw new Error("خطا در ویرایش فروشنده");
                return res.json();
            })
            .then(() => {
                setShowModal(false);
                fetchSellers(); // بروزرسانی جدول
            })
            .catch(err => console.error(err));
    };

    return (
        <div className="container my-4 p-4 border rounded shadow-sm" dir="rtl">

            <div className="mb-3 text-start">
                <Link to="/seller" className="btn btn-success">
                    ثبت تامین کننده جدید
                </Link>
            </div>

            <h2 className="text-center mb-4">لیست تامین‌کنندگان</h2>

            <div className="table-responsive">
                <table className="table table-striped table-bordered text-end">
                    <thead className="table-primary">
                        <tr>
                            <th>شماره فروشنده</th>
                            <th>نام تامین‌کننده</th>
                            <th>شناسه ملی</th>
                            <th>کد اقتصادی</th>
                            <th>کد پستی</th>
                            <th>شهر</th>
                            <th>آدرس</th>
                            <th>ایمیل</th>
                            <th>شماره تماس</th>
                            <th>وبسایت</th>
                            <th>عملیات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sellerList.map(s => (
                            <tr key={s.id}>
                                <td>{s.number}</td>
                                <td>{s.name}</td>
                                <td>{s.national_id}</td>
                                <td>{s.economic_code}</td>
                                <td>{s.postal_code}</td>
                                <td>{s.city}</td>
                                <td>{s.address}</td>
                                <td>{s.email}</td>
                                <td>{s.phone}</td>
                                <td>{s.website}</td>
                                <td>
                                    <button
                                        className="btn btn-warning btn-sm me-2"
                                        onClick={() => handleEdit(s)}
                                    >
                                        ویرایش
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleDelete(s.id)}
                                    >
                                        حذف
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* مودال ویرایش فروشنده */}
            {showModal && selectedSeller && (
                <div className="modal show d-block" tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content" dir="rtl">
                            <div className="modal-header">
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                                <h5 className="modal-title text-center">ویرایش {selectedSeller.name}</h5>
                            </div>
                            <div className="modal-body">
                                {[
                                    { key: "name", label: "نام تامین‌کننده" },
                                    { key: "national_id", label: "شناسه ملی" },
                                    { key: "economic_code", label: "کد اقتصادی" },
                                    { key: "postal_code", label: "کد پستی" },
                                    { key: "city", label: "شهر" },
                                    { key: "address", label: "آدرس" },
                                    { key: "email", label: "ایمیل" },
                                    { key: "phone", label: "شماره تماس" },
                                    { key: "website", label: "وبسایت" },
                                ].map(({ key, label }) => (
                                    <div className="mb-3" key={key}>
                                        <label className="form-label">{label}</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={selectedSeller[key] || ""}
                                            onChange={(e) =>
                                                setSelectedSeller(prev => ({ ...prev, [key]: e.target.value }))
                                            }
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>لغو</button>
                                <button className="btn btn-primary" onClick={handleUpdate}>ذخیره تغییرات</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
