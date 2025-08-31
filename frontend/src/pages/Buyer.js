import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;

export default function BuyerForm() {
    const [selectedBuyer, setSelectedBuyer] = useState({
        number: "",
        name: "",
        contact_phone: "",
        national_id: "",
        economic_code: "",
        postal_code: "",
        address: ""
    });

    // گرفتن شماره بعدی از بک‌اند
    const fetchNextNumber = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/next-number/Buyer/`);
            setSelectedBuyer(prev => ({ ...prev, number: res.data.next_number }));
        } catch (err) {
            console.error("Error fetching next number:", err);
            setSelectedBuyer(prev => ({ ...prev, number: "" }));
        }
    };

    useEffect(() => {
        fetchNextNumber();
    }, []);

    const handleSave = async () => {
        try {
            const res = await axios.post(`${API_URL}/api/buyers/`, selectedBuyer, {
                headers: { "Content-Type": "application/json" }
            });
            alert(`خریدار ثبت شد. شماره: ${res.data.number}`);
            // ریست فرم و گرفتن شماره بعدی
            setSelectedBuyer({
                ...selectedBuyer,
                name: "",
                contact_phone: "",
                national_id: "",
                economic_code: "",
                postal_code: "",
                address: ""
            });
            fetchNextNumber();
        } catch (err) {
            console.error(err.response?.data || err);
            alert("ثبت خریدار با مشکل مواجه شد");
        }
    };

    return (
        <div className="container my-4 p-4 border rounded shadow-sm" dir="rtl">
            <div className="mb-3 text-start">
                <Link to="/buyerlist" className="btn btn-success">لیست خریداران</Link>
            </div>

            <h2 className="text-center mb-4">ثبت خریدار جدید</h2>

            <div className="row">
                {[
                    { field: "number", label: "شماره خریدار" },
                    { field: "name", label: "نام مرکز / نام شخص" },
                    { field: "contact_phone", label: "شماره تماس" },
                    { field: "national_id", label: "شناسه ملی" },
                    { field: "economic_code", label: "کد اقتصادی" },
                    { field: "postal_code", label: "کد پستی" },
                    { field: "address", label: "آدرس" }
                ].map(item => (
                    <div className="col-md-6 mb-3" key={item.field}>
                        <label className="form-label">{item.label}</label>
                        <input
                            type="text"
                            className="form-control"
                            value={selectedBuyer[item.field] || ""}
                            onChange={(e) =>
                                setSelectedBuyer(prev => ({ ...prev, [item.field]: e.target.value }))
                            }
                        />
                    </div>
                ))}

                <button className="btn btn-primary" onClick={handleSave}>
                    ثبت
                </button>
            </div>
        </div>
    );
}
