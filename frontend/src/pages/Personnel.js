import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import DatePicker from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

export default function NewPersonnelForm() {
  const [formData, setFormData] = useState({
    personnel_code: "",
    full_name: "",
    national_id: "",
    father_name: "",
    address: "",
    postal_code: "",
    email: "",
    birth_certificate_number: "",
    position: "",
    national_card_files: [],
    birth_certificate_files: [],
    vehicle_card_files: [],
    created_at: null, // ➕ تاریخ ایجاد
  });

  const [errors, setErrors] = useState({});
  const [personnelList, setPersonnelList] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL;

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
    fetchPersonnel();
    fetchUniqueCode();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: Array.from(files) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};
    if (!formData.full_name) newErrors.full_name = "نام و نام خانوادگی الزامی است";
    if (!formData.national_id) newErrors.national_id = "کد ملی الزامی است";
    if (!formData.father_name) newErrors.father_name = "نام پدر الزامی است";
    if (!formData.address) newErrors.address = "آدرس الزامی است";
    if (!formData.postal_code) newErrors.postal_code = "کد پستی الزامی است";
    if (!formData.email) newErrors.email = "ایمیل الزامی است";
    if (!formData.birth_certificate_number) newErrors.birth_certificate_number = "شماره شناسنامه الزامی است";
    if (!formData.position) newErrors.position = "سمت الزامی است";
    if (!formData.created_at) newErrors.created_at = "تاریخ ایجاد الزامی است";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      // 1️⃣ ثبت پرسنل بدون فایل‌ها
      const data = new FormData();
      for (let key in formData) {
        if (!key.endsWith("_files") && formData[key]) {
          if (key === "created_at") {
            data.append(key, formData[key].toDate().toISOString()); // تاریخ به فرمت ISO
          } else {
            data.append(key, formData[key]);
          }
        }
      }

      const res = await fetch(`${API_URL}/api/personnels/`, {
        method: "POST",
        body: data,
      });

      if (!res.ok) throw new Error("خطا در ثبت پرسنل");

      const newPersonnel = await res.json();

      // 2️⃣ ثبت مدارک جداگانه
      const fileFields = [
        { field: "national_card_files", doc_type: "national_card" },
        { field: "birth_certificate_files", doc_type: "birth_certificate" },
        { field: "vehicle_card_files", doc_type: "vehicle_card" },
      ];

      for (let { field, doc_type } of fileFields) {
        const files = formData[field];
        if (files && files.length > 0) {
          for (let file of files) {
            const fileData = new FormData();
            fileData.append("file", file);
            fileData.append("personnel", newPersonnel.id);
            fileData.append("doc_type", doc_type);

            await fetch(`${API_URL}/api/documents/`, {
              method: "POST",
              body: fileData,
            });
          }
        }
      }

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
        position: "",
        national_card_files: [],
        birth_certificate_files: [],
        vehicle_card_files: [],
        created_at: null,
      });

      await fetchUniqueCode();

      alert("پرسنل و مدارک با موفقیت ثبت شدند!");
      setPersonnelList([newPersonnel, ...personnelList]);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="container my-4 p-4 border rounded shadow-sm bg-primary-100" dir="rtl">
      <div className="mt-4 text-start d-flex justify-content-between align-items-center">
        <div className="col-md-5 d-flex align-items-center gap-2">
          <label className="form-label mb-0">ساعت و تاریخ ایجاد:</label>
          <DatePicker
            calendar={persian}
            locale={persian_fa}
            plugins={[<TimePicker position="bottom" />]}
            value={formData.created_at}
            onChange={(date) => setFormData((prev) => ({ ...prev, created_at: date }))}
            format="HH:mm YYYY/MM/DD"
            className="form-control"
          />
          {errors.created_at && <div className="text-danger">{errors.created_at}</div>}
        </div>
        <Link to="/personnel-list" className="btn btn-success mb-3">
          بازگشت
        </Link>
      </div>

      <h2 className="text-center mb-4">تعریف پرسنل جدید</h2>
      <form onSubmit={handleSubmit}>
        {/* کد پرسنلی */}
        <div className="mb-3 text-end">
          <label className="form-label fw-bold">کد پرسنلی :</label>
          <input
            type="text"
            className="form-control text-center"
            value={formData.personnel_code}
            readOnly
          />
        </div>

        {/* نام و کدملی */}
        <div className="row mb-3 text-end">
          <div className="col-md-6 mb-3">
            <input
              type="text"
              name="full_name"
              className="form-control text-end"
              placeholder="نام و نام خانوادگی"
              value={formData.full_name}
              onChange={handleChange}
            />
            {errors.full_name && <div className="text-danger">{errors.full_name}</div>}
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
            {errors.national_id && <div className="text-danger">{errors.national_id}</div>}
          </div>
        </div>

        {/* نام پدر و آدرس */}
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
            {errors.father_name && <div className="text-danger">{errors.father_name}</div>}
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
            {errors.address && <div className="text-danger">{errors.address}</div>}
          </div>
        </div>

        {/* کد پستی و ایمیل */}
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
            {errors.postal_code && <div className="text-danger">{errors.postal_code}</div>}
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
            {errors.email && <div className="text-danger">{errors.email}</div>}
          </div>
        </div>

        {/* شماره شناسنامه و سمت */}
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
            {errors.birth_certificate_number && (
              <div className="text-danger">{errors.birth_certificate_number}</div>
            )}
          </div>
          <div className="col-md-6 mb-3">
            <input
              type="text"
              name="position"
              className="form-control text-end"
              placeholder="سمت"
              value={formData.position}
              onChange={handleChange}
            />
            {errors.position && <div className="text-danger">{errors.position}</div>}
          </div>
        </div>

        {/* آپلود فایل‌ها */}
        <div className="row mb-3 text-end">
          <div className="col-md-4 mb-3">
            <label className="form-label">آپلود کارت ملی:</label>
            <input
              type="file"
              name="national_card_files"
              className="form-control"
              onChange={handleChange}
              multiple
            />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">شناسنامه / کارت دانشجویی:</label>
            <input
              type="file"
              name="birth_certificate_files"
              className="form-control"
              onChange={handleChange}
              multiple
            />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">کارت خودرو (اختیاری):</label>
            <input
              type="file"
              name="vehicle_card_files"
              className="form-control"
              onChange={handleChange}
              multiple
            />
          </div>
        </div>

        <button type="submit" className="btn btn-success w-100 py-2" disabled={loading}>
          {loading ? "در حال ثبت..." : "ثبت پرسنل"}
        </button>
      </form>
    </div>
  );
}
