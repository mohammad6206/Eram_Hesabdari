import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function NewPersonnelForm() {
    const [formData, setFormData] = useState({
        personnel_code: "",  // <-- اضافه شد
        full_name: "",
        national_id: "",
        father_name: "",
        address: "",
        postal_code: "",
        email: "",
        birth_certificate_number: "",
        national_card_file: null,
        birth_certificate_file: null,
        vehicle_card_file: null,
    });
    const API_URL = process.env.REACT_APP_API_URL;
    const [personnelList, setPersonnelList] = useState([]);
    const [loading, setLoading] = useState(false);

    // گرفتن لیست پرسنل
    const fetchPersonnel = async () => {
        const res = await fetch(`${API_URL}/api/personnels/`);
        const data = await res.json();
        setPersonnelList(data);
    };

    // گرفتن کد پرسنلی یونیک از سرور
    const fetchUniqueCode = async () => {
        const res = await fetch(`${API_URL}/api/personnels/generate_code/`);
        const data = await res.json();
        setFormData((prev) => ({ ...prev, personnel_code: data.personnel_code }));
    };
    useEffect(() => {
        // گرفتن لیست پرسنل
        fetchPersonnel();

        // گرفتن کد پرسنلی یونیک از سرور
        fetch(`${API_URL}/api/personnels/generate_code/`)
            .then(res => res.json())
            .then(data => setFormData(prev => ({ ...prev, personnel_code: data.personnel_code })))
            .catch(err => console.error(err));
    }, []);


    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            setFormData({ ...formData, [name]: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        for (let key in formData) {
            if (formData[key]) data.append(key, formData[key]);
        }

        try {
            const res = await fetch(`${API_URL}/api/personnels/`, {
                method: "POST",
                body: data,
            });

            if (!res.ok) throw new Error("خطا در ثبت پرسنل");

            const newPersonnel = await res.json();
            setPersonnelList([newPersonnel, ...personnelList]);

            // پاک کردن فرم و گرفتن کد پرسنلی جدید
            setFormData({
                personnel_code: "",
                full_name: "",
                national_id: "",
                father_name: "",
                address: "",
                postal_code: "",
                email: "",
                birth_certificate_number: "",
                national_card_file: null,
                birth_certificate_file: null,
                vehicle_card_file: null,
            });
            await fetchUniqueCode();

            alert("پرسنل با موفقیت ثبت شد!");
        } catch (err) {
            console.error(err);
            alert(err.message);
        }

        setLoading(false);
    };

    return (
        <div className="container my-4 p-4 border rounded shadow-sm" dir="rtl">
            <h2 className="text-center mb-4">تعریف پرسنل جدید</h2>

            <form onSubmit={handleSubmit}>
                {/* نمایش کد پرسنلی تولید شده توسط سرور */}
                <div className="mb-3 text-end">
                    <label className="form-label fw-bold">کد پرسنلی :</label>
                    <input
                        type="text"
                        className="form-control text-end"
                        value={formData.personnel_code}
                        readOnly
                    />
                </div>
                {/* سایر فیلدهای فرم */}
                <div className="row mb-3 text-end">
                    <div className="col-md-6 mb-3">
                        <input
                            type="text"
                            name="full_name"
                            className="form-control text-end"
                            placeholder="نام و نام خانوادگی"
                            value={formData.full_name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <input
                            type="text"
                            name="national_id"
                            className="form-control text-end"
                            placeholder="کد ملی"
                            value={formData.national_id}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="row mb-3 text-end">
                    <div className="col-md-6 mb-3">
                        <input
                            type="text"
                            name="father_name"
                            className="form-control text-end"
                            placeholder="نام پدر"
                            value={formData.father_name}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <input
                            type="text"
                            name="address"
                            className="form-control text-end"
                            placeholder="آدرس"
                            value={formData.address}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="row mb-3 text-end">
                    <div className="col-md-6 mb-3">
                        <input
                            type="text"
                            name="postal_code"
                            className="form-control text-end"
                            placeholder="کد پستی"
                            value={formData.postal_code}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <input
                            type="email"
                            name="email"
                            className="form-control text-end"
                            placeholder="ایمیل"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="row mb-3 text-end">
                    <div className="col-md-6 mb-3">
                        <input
                            type="text"
                            name="birth_certificate_number"
                            className="form-control text-end"
                            placeholder="شماره شناسنامه"
                            value={formData.birth_certificate_number}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="row mb-3 text-end">
                    <div className="col-md-4 mb-3">
                        <label className="form-label">آپلود کارت ملی:</label>
                        <input
                            type="file"
                            name="national_card_file"
                            className="form-control"
                            onChange={handleChange}
                        />
                    </div>
                    <div className="col-md-4 mb-3">
                        <label className="form-label">
                            عکس شناسنامه / کارت دانشجویی / آخرین مدرک تحصیلی:
                        </label>
                        <input
                            type="file"
                            name="birth_certificate_file"
                            className="form-control"
                            onChange={handleChange}
                        />
                    </div>
                    <div className="col-md-4 mb-3">
                        <label className="form-label">عکس کارت خودرو (اختیاری):</label>
                        <input
                            type="file"
                            name="vehicle_card_file"
                            className="form-control"
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <button type="submit" className="btn btn-success w-100 py-2" disabled={loading}>
                    {loading ? "در حال ثبت..." : "ثبت پرسنل"}
                </button>
            </form>

            {/* جدول نمایش پرسنل‌ها */}
            <div className="mt-4">
                <h4 className="text-end mb-3">لیست پرسنل ثبت شده</h4>
                <table className="table table-striped table-bordered text-end">
                    <thead className="table-dark">
                        <tr>
                            <th>کد پرسنلی</th>
                            <th>نام و نام خانوادگی</th>
                            <th>کد ملی</th>
                            <th>نام پدر</th>
                            <th>آدرس</th>
                            <th>کد پستی</th>
                            <th>ایمیل</th>
                        </tr>
                    </thead>
                    <tbody>
                        {personnelList.map((p) => (
                            <tr key={p.id}>
                                <td>{p.personnel_code}</td>
                                <td>{p.full_name}</td>
                                <td>{p.national_id}</td>
                                <td>{p.father_name}</td>
                                <td>{p.address}</td>
                                <td>{p.postal_code}</td>
                                <td>{p.email}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
