import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import DatePicker from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

const API_URL = process.env.REACT_APP_API_URL;

export default function Seller() {
    const [selectedSeller, setSelectedSeller] = useState({
        number: "",
        name: "",
        national_id: "",
        economic_code: "",
        postal_code: "",
        city: "",
        address: "",
        email: "",
        phone: "",
        website: "",
        created_at: null
    });

    const [errors, setErrors] = useState({});

    // گرفتن شماره بعدی
    const fetchNextNumber = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/next-number/Seller/`);
            setSelectedSeller(prev => ({ ...prev, number: res.data.next_number }));
        } catch (err) {
            console.error(err);
            setSelectedSeller(prev => ({ ...prev, number: "" }));
        }
    };

    useEffect(() => {
        fetchNextNumber();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();

        let newErrors = {};
        if (!selectedSeller.name) newErrors.name = "نام تامین‌کننده الزامی است";
        if (!selectedSeller.national_id) newErrors.national_id = "شناسه ملی الزامی است";
        if (!selectedSeller.economic_code) newErrors.economic_code = "کد اقتصادی الزامی است";
        if (!selectedSeller.postal_code) newErrors.postal_code = "کد پستی الزامی است";
        if (!selectedSeller.city) newErrors.city = "شهر الزامی است";
        if (!selectedSeller.address) newErrors.address = "آدرس الزامی است";
        if (!selectedSeller.email) newErrors.email = "ایمیل الزامی است";
        if (!selectedSeller.phone) newErrors.phone = "شماره تماس الزامی است";
        if (!selectedSeller.website) newErrors.website = "آدرس وبسایت الزامی است";
        if (!selectedSeller.created_at) newErrors.created_at = "تاریخ ایجاد الزامی است";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const payload = {
            ...selectedSeller,
            created_at: selectedSeller.created_at?.format("YYYY-MM-DDTHH:mm:ss"),
        };

        try {
            await axios.post(`${API_URL}/api/sellers/`, payload, {
                headers: { "Content-Type": "application/json" }
            });

            alert("فروشنده با موفقیت ثبت شد ✅");

            // پاک‌سازی فرم
            setSelectedSeller({
                number: "",
                name: "",
                national_id: "",
                economic_code: "",
                postal_code: "",
                city: "",
                address: "",
                email: "",
                phone: "",
                website: "",
                created_at: null
            });
            setErrors({});
            fetchNextNumber();
        } catch (err) {
            console.error(err.response?.data || err);
            alert("ثبت فروشنده با مشکل مواجه شد");
        }
    };

    return (
        <div className="container my-4 p-4 border rounded shadow-sm" dir="rtl">

            <div className="mb-3 d-flex justify-content-between align-items-center">
                <div className="col-md-5 d-flex align-items-center gap-2">
                    <label className="form-label mb-0">تاریخ ایجاد</label>
                    <DatePicker
                        calendar={persian}
                        locale={persian_fa}
                        value={selectedSeller.created_at}
                        onChange={date => setSelectedSeller(prev => ({ ...prev, created_at: date }))}
                        format="HH:mm            YYYY-MM-DD"
                        plugins={[<TimePicker position="bottom" />]}
                        className="form-control"
                    />
                    {errors.created_at && <div className="text-danger small">{errors.created_at}</div>}
                </div>
                <Link to="/sellerList" className="btn btn-success">بازگشت</Link>
            </div>

            <h2 className="text-center mb-4">ثبت تامین‌کننده</h2>

            <form onSubmit={handleSave} className="row">
                {[
                    { field: "number", label: "شماره تامین‌کننده", disabled: true },
                    { field: "name", label: "نام تامین‌کننده" },
                    { field: "national_id", label: "شناسه ملی" },
                    { field: "economic_code", label: "کد اقتصادی" },
                    { field: "postal_code", label: "کد پستی" },
                    { field: "city", label: "شهر فروشگاه" },
                    { field: "address", label: "آدرس" },
                    { field: "email", label: "ایمیل" },
                    { field: "phone", label: "شماره تماس" },
                    { field: "website", label: "آدرس وبسایت" }
                ].map(item => (
                    <div className="col-md-6 mb-3" key={item.field}>
                        <label className="form-label">{item.label}</label>
                        <input
                            type="text"
                            className="form-control"
                            value={selectedSeller[item.field] || ""}
                            onChange={(e) =>
                                setSelectedSeller(prev => ({ ...prev, [item.field]: e.target.value }))
                            }
                            disabled={item.disabled || false}
                        />
                        {errors[item.field] && <div className="text-danger">{errors[item.field]}</div>}
                    </div>
                ))}
                <button type="submit" className="btn btn-primary mt-2">
                    ثبت
                </button>
            </form>
        </div>
    );
}
