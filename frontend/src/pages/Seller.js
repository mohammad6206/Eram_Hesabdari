import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

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
        website: ""
    });

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
        e.preventDefault(); // جلوگیری از رفرش شدن فرم
        try {
            const { number, ...payload } = selectedSeller;

            if (!number) {
                alert("شماره تامین‌کننده هنوز آماده نشده!");
                return;
            }

            console.log("Payload:", { ...payload, number });

            const res = await axios.post(`${API_URL}/api/sellers/`, { ...payload, number }, {
                headers: { "Content-Type": "application/json" }
            });


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
                website: ""
            });

            fetchNextNumber();
        } catch (err) {
            console.error(err.response?.data || err);
            alert("ثبت فروشنده با مشکل مواجه شد");
        }
    };

    return (
        <div className="container my-4 p-4 border rounded shadow-sm" dir="rtl">
            <div className="mb-3 text-start">
                <Link to="/sellerlist" className="btn btn-success">
                    لیست فروشندگان
                </Link>
            </div>

            <h2 className="text-center mb-4">ثبت تامین‌کننده</h2>

            <form onSubmit={handleSave} className="row">
                {[
                    { field: "number", label: "شماره تامین‌کننده" },
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
                            disabled={item.field === "number"} // شماره تامین‌کننده قابل ویرایش نباشه
                        />
                    </div>
                ))}
                <button type="submit" className="btn btn-primary">
                    ثبت
                </button>


            </form>
        </div>
    );
}
