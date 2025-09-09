import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import axiosInstance from "../api/axiosInstance";


const API_URL = process.env.REACT_APP_API_URL;

// فرمت تاریخ/ساعت
const formatDateTime = (dateString) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    const faDate = d.toLocaleDateString("fa-IR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
    const faTime = d.toLocaleTimeString("fa-IR", {
        hour: "2-digit",
        minute: "2-digit",
    });
    return `${faTime} ${faDate}`;
};

export default function SellerList() {
    const [sellerList, setSellerList] = useState([]);
    const [filteredList, setFilteredList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedSeller, setSelectedSeller] = useState(null);

    // جستجو و فیلتر تاریخ
    const [search, setSearch] = useState("");
    const [dateFilter, setDateFilter] = useState({ from: null, to: null });
    const [dateField, setDateField] = useState("created_at");

    const fetchSellers = async () => {
        try {
            const res = await axiosInstance.get("sellers/"); // baseURL تو axiosInstance تنظیم شده
            const sellersArray = Array.isArray(res.data) ? res.data : res.data.results || [];
            setSellerList(sellersArray);
            setFilteredList(sellersArray);
        } catch (err) {
            console.error("خطا در دریافت فروشندگان:", err);
            setSellerList([]);
            setFilteredList([]);
        }
    };

    useEffect(() => {
        fetchSellers();
    }, []);

    // اعمال فیلتر و جستجو
    useEffect(() => {
        let result = sellerList;

        if (search.trim() !== "") {
            result = result.filter(s =>
                Object.values(s).some(val =>
                    String(val).toLowerCase().includes(search.toLowerCase())
                )
            );
        }

        if (dateFilter.from || dateFilter.to) {
            result = result.filter(s => {
                const dateValue = s[dateField] ? new Date(s[dateField]) : null;
                if (!dateValue) return false;

                let isValid = true;
                if (dateFilter.from) isValid = isValid && dateValue >= new Date(dateFilter.from.toDate());
                if (dateFilter.to) isValid = isValid && dateValue <= new Date(dateFilter.to.toDate());
                return isValid;
            });
        }

        setFilteredList(result);
    }, [search, dateFilter, dateField, sellerList]);

    // باز کردن مودال و انتخاب فروشنده
    const handleEdit = (seller) => {
        setSelectedSeller({
            ...seller,
            created_at: seller.created_at ? new Date(seller.created_at) : null,
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("آیا مطمئن هستید که می‌خواهید این تامین‌کننده را حذف کنید؟")) return;

        try {
            await axiosInstance.delete(`sellers/${id}/`);
            // بعد از حذف موفق، لیست را بروزرسانی کن
            fetchSellers();
        } catch (err) {
            console.error("خطا در حذف فروشنده:", err.response?.data || err);
            alert("حذف فروشنده با مشکل مواجه شد");
        }
    };

    return (
        <div className="container my-4 p-4 border rounded shadow-sm" dir="rtl">
            {/* سرچ و فیلتر تاریخ */}
            <div className="d-flex justify-content-between align-items-center mb-3 gap-3">
                <input
                    type="text"
                    placeholder="جستجو در همه فیلدها..."
                    className="form-control w-25"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <div className="d-flex align-items-center gap-2">
                    <select
                        className="form-select"
                        value={dateField}
                        onChange={(e) => setDateField(e.target.value)}
                    >
                        <option value="created_at">تاریخ ایجاد</option>
                        <option value="updated_at">تاریخ آخرین ویرایش</option>
                    </select>

                    <span>از:</span>
                    <DatePicker
                        calendar={persian}
                        locale={persian_fa}
                        value={dateFilter.from}
                        onChange={date => setDateFilter(prev => ({ ...prev, from: date }))}
                        format="YYYY/MM/DD"
                        className="form-control"
                    />

                    <span>تا:</span>
                    <DatePicker
                        calendar={persian}
                        locale={persian_fa}
                        value={dateFilter.to}
                        onChange={date => setDateFilter(prev => ({ ...prev, to: date }))}
                        format="YYYY/MM/DD"
                        className="form-control"
                    />
                </div>

                <Link to="/seller" className="btn btn-success">ثبت تامین‌کننده جدید</Link>
            </div>

            {/* جدول فروشندگان */}
            <h2 className="text-center mb-4">لیست تامین‌کنندگان</h2>
            <div className="table-responsive">
                <table className="table table-striped table-bordered text-end">
                    <thead className="table-primary text-center">
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
                            <th>تاریخ ایجاد</th>
                            <th>تاریخ ویرایش</th>
                            <th>عملیات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredList.map(s => (
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
                                <td>{formatDateTime(s.created_at)}</td>
                                <td>{formatDateTime(s.updated_at)}</td>
                                <td className="text-center align-middle">
                                    <div className="d-flex flex-column justify-content-center align-items-center gap-2">
                                        <button
                                            className="btn btn-warning btn-sm w-100"
                                            onClick={() => handleEdit(s)}
                                        >
                                            ویرایش
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm w-100"
                                            onClick={() => handleDelete(s.id)}
                                        >
                                            حذف
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* مودال ویرایش */}
            {showModal && selectedSeller && (
                <div className="modal show d-block" tabIndex="-1" role="dialog">
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content" dir="rtl">
                            <div className="modal-header">
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                                <h5 className="modal-title text-center w-100">ویرایش {selectedSeller.name}</h5>
                            </div>
                            <div className="modal-body">
                                <div className="row">
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
                                        <div className="col-md-6 mb-3" key={key}>
                                            <label className="form-label">{label}</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={selectedSeller[key] || ""}
                                                onChange={(e) =>
                                                    setSelectedSeller(prev => ({
                                                        ...prev,
                                                        [key]: e.target.value,
                                                        updated_at: new Date().toISOString()
                                                    }))
                                                }
                                            />
                                        </div>
                                    ))}
                                </div>

                                <div className="d-flex gap-3 mt-4">
                                    {/* تاریخ ایجاد */}
                                    <div className="flex-grow-1">
                                        <label className="form-label">تاریخ ایجاد</label>
                                        <DatePicker
                                            calendar={persian}
                                            locale={persian_fa}
                                            value={selectedSeller.created_at}
                                            onChange={date =>
                                                setSelectedSeller(prev => ({
                                                    ...prev,
                                                    created_at: date,
                                                    updated_at: new Date().toISOString()
                                                }))
                                            }
                                            format="HH:mm YYYY/MM/DD"
                                            render={(value, openCalendar) => (
                                                <input
                                                    className="form-control"
                                                    value={value}
                                                    onFocus={openCalendar}
                                                    readOnly
                                                />
                                            )}
                                        />

                                    </div>
                                    {/* تاریخ آخرین ویرایش */}
                                    <div className="flex-grow-1">
                                        <label className="form-label">تاریخ آخرین ویرایش</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={formatDateTime(selectedSeller.updated_at)}
                                            readOnly
                                        />
                                    </div>
                                </div>

                            </div>

                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>لغو</button>
                                <button
                                    className="btn btn-primary"
                                    onClick={async () => {
                                        if (!selectedSeller) return;

                                        // آماده‌سازی payload
                                        const payload = {
                                            ...selectedSeller,
                                            created_at:
                                                selectedSeller.created_at instanceof Date
                                                    ? selectedSeller.created_at.toISOString()
                                                    : selectedSeller.created_at,
                                            updated_at: new Date().toISOString(),
                                        };

                                        try {
                                            // درخواست PUT با axiosInstance (توکن خودکار اضافه میشه)
                                            await axiosInstance.put(`sellers/${selectedSeller.id}/`, payload);

                                            // بستن مودال
                                            setShowModal(false);

                                            // بروزرسانی لیست فروشندگان
                                            fetchSellers();
                                        } catch (err) {
                                            console.error("خطا در ویرایش فروشنده:", err.response?.data || err);
                                            alert("ویرایش فروشنده با مشکل مواجه شد");
                                        }
                                    }}
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
