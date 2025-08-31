import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;

export default function SellerList() {
    const [sellerList, setSellerList] = useState([]);
    const navigate = useNavigate();

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

    // هدایت به صفحه ویرایش
    const handleEdit = (id) => {
        navigate(`/seller/${id}`);
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

    return (
        <div className="container my-4 p-4 border rounded shadow-sm" dir="rtl">
            {/* لینک بازگشت */}
            <div className="mb-3 text-start">
                <Link to="/seller" className="btn btn-success">
                    بازگشت
                </Link>
            </div>

            <h2 className="text-center mb-4">لیست فروشندگان ثبت شده</h2>

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
                            <th>تلفن</th>
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
                                        onClick={() => handleEdit(s.id)}
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
        </div>
    );
}
