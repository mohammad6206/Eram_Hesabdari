// BuyerForm.js
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

const API_URL = process.env.REACT_APP_API_URL;

export default function BuyerForm() {
    const [selectedBuyer, setSelectedBuyer] = useState({
        number: "",
        name: "",
        contact_phone: "",
        national_id: "",
        economic_code: "",
        postal_code: "",
        address: "",
        created_at: null
    });
    const [errors, setErrors] = useState({});

    const fetchNextNumber = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/next-number/Buyer/`);
            setSelectedBuyer(prev => ({ ...prev, number: res.data.next_number }));
        } catch (err) {
            console.error(err);
            setSelectedBuyer(prev => ({ ...prev, number: "" }));
        }
    };

    useEffect(() => {
        fetchNextNumber();
    }, []);

    const handleSave = async () => {
        let newErrors = {};
        if (!selectedBuyer.name) newErrors.name = "نام الزامی است";
        if (!selectedBuyer.contact_phone) newErrors.contact_phone = "شماره تماس الزامی است";
        if (!selectedBuyer.national_id) newErrors.national_id = "شناسه ملی الزامی است";
        if (!selectedBuyer.economic_code) newErrors.economic_code = "کد اقتصادی الزامی است";
        if (!selectedBuyer.postal_code) newErrors.postal_code = "کد پستی الزامی است";
        if (!selectedBuyer.address) newErrors.address = "آدرس الزامی است";
        if (!selectedBuyer.created_at) newErrors.created_at = "تاریخ ایجاد الزامی است";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const payload = {
            ...selectedBuyer,
            created_at: selectedBuyer.created_at
                ? selectedBuyer.created_at.toDate().toISOString()
                : null,
            updated_at: null
        };


        try {
            const res = await axios.post(`${API_URL}/api/buyers/`, payload, {
                headers: { "Content-Type": "application/json" }
            });
            alert(`خریدار ثبت شد. شماره: ${res.data.number}`);
            setSelectedBuyer({
                number: "",
                name: "",
                contact_phone: "",
                national_id: "",
                economic_code: "",
                postal_code: "",
                address: "",
                created_at: null
            });
            fetchNextNumber();
            setErrors({});
        } catch (err) {
            console.error(err.response?.data || err);
            alert("ثبت خریدار با مشکل مواجه شد");
        }
    };

    return (
        <div className="container my-4 p-4 border rounded shadow-sm" dir="rtl">
            <div className="mb-3 d-flex justify-content-between align-items-center">
                <div className="col-md-4">
                    <label className="form-label mb-0">ساعت و تاریخ ایجاد:</label>
                    <DatePicker
                        calendar={persian}
                        locale={persian_fa}
                        value={selectedBuyer.created_at}
                        onChange={date => setSelectedBuyer(prev => ({ ...prev, created_at: date }))}
                        format="HH:mm            YYYY-MM-DD"
                        className="form-control"
                    />
                    {errors.created_at && <div className="text-danger">{errors.created_at}</div>}
                </div>
                <Link to="/buyerlist" className="btn btn-success">بازگشت</Link>
            </div>

            <h2 className="text-center mb-4">ثبت خریدار جدید</h2>

            <div className="row">
                {[
                    { field: "number", label: "شماره خریدار", disabled: true },
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
                            disabled={item.disabled || false}
                            onChange={e => setSelectedBuyer(prev => ({ ...prev, [item.field]: e.target.value }))}
                        />
                        {errors[item.field] && <div className="text-danger">{errors[item.field]}</div>}
                    </div>
                ))}
                <button className="btn btn-primary mt-2" onClick={handleSave}>ثبت</button>
            </div>
        </div>
    );
}
