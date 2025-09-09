import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { PhotoProvider, PhotoSlider } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import axiosInstance from "../api/axiosInstance";

const API_URL = process.env.REACT_APP_API_URL;

// 📌 فرمت نمایش تاریخ و ساعت
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

export default function PersonnelList() {
    const [personnelList, setPersonnelList] = useState([]);
    const [filteredList, setFilteredList] = useState([]);

    const [selectedPersonnel, setSelectedPersonnel] = useState(null);
    const [activeDoc, setActiveDoc] = useState("national_card");
    const [personnelDocs, setPersonnelDocs] = useState([]);
    const [selectedFileIndex, setSelectedFileIndex] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isEditModal, setIsEditModal] = useState(false);
    const [showLargeImage, setShowLargeImage] = useState(false);

    // 🔍 سرچ و فیلتر تاریخ
    const [search, setSearch] = useState("");
    const [dateFilter, setDateFilter] = useState({ from: null, to: null });
    const [dateField, setDateField] = useState("created_at"); // created_at یا updated_at

    const activeDocs = personnelDocs.filter((doc) => doc.doc_type === activeDoc);

    const fetchPersonnels = async () => {
        try {
            const res = await axiosInstance.get("personnels/");
            setPersonnelList(res.data);
            setFilteredList(res.data);
        } catch (err) {
            console.error(err.response?.data || err);
            setPersonnelList([]);
            setFilteredList([]);
        }
    };


    useEffect(() => {
        fetchPersonnels();
    }, []);

    // 📌 اعمال سرچ و فیلتر
    useEffect(() => {
        let result = personnelList;

        // 🔎 سرچ در همه فیلدها
        if (search.trim() !== "") {
            result = result.filter((p) =>
                Object.values(p).some((val) =>
                    String(val).toLowerCase().includes(search.toLowerCase())
                )
            );
        }

        // 📅 فیلتر بر اساس تاریخ
        if (dateFilter.from || dateFilter.to) {
            result = result.filter((p) => {
                const dateValue = p[dateField] ? new Date(p[dateField]) : null;
                if (!dateValue) return false;

                let isValid = true;
                if (dateFilter.from)
                    isValid =
                        isValid && dateValue >= new Date(dateFilter.from.toDate());
                if (dateFilter.to)
                    isValid = isValid && dateValue <= new Date(dateFilter.to.toDate());
                return isValid;
            });
        }

        setFilteredList(result);
    }, [search, dateFilter, dateField, personnelList]);

    // 📌 انتخاب پرسنل برای مشاهده مدارک
    const handleSelect = (person) => {
        setSelectedPersonnel(person);
        setActiveDoc("national_card");
        setSelectedFileIndex(null);
        setIsEditModal(false);
        setShowModal(true);
        loadPersonnelDocs(person.id, "national_card");
    };

    // 📌 انتخاب پرسنل برای ویرایش
    const handleEdit = (person) => {
        setSelectedPersonnel(person);
        setIsEditModal(true);
        setShowModal(true);
    };


    const loadPersonnelDocs = async (personId, docType) => {
        try {
            const res = await axiosInstance.get(`documents/?personnels=${personId}&doc_type=${docType}`);
            setPersonnelDocs(res.data);
            setSelectedFileIndex(null);
        } catch (err) {
            console.error(err.response?.data || err);
        }
    };

    // 📌 تغییر تب مدارک
    const handleTabChange = (docType) => {
        setActiveDoc(docType);
        if (selectedPersonnel) {
            loadPersonnelDocs(selectedPersonnel.id, docType);
        }
    };

    const handleUploadNewDocs = async (e) => {
        if (!selectedPersonnel) return;
        const files = Array.from(e.target.files);
        const newDocs = [];

        for (let file of files) {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("personnel", selectedPersonnel.id);
            formData.append("doc_type", activeDoc);

            try {
                const res = await axiosInstance.post("documents/", formData);
                newDocs.push(res.data);
            } catch (err) {
                console.error(err.response?.data || err);
            }
        }

        setPersonnelDocs((prev) => [...prev, ...newDocs]);
    };

    const handleDeleteDoc = async (docId) => {
        try {
            await axiosInstance.delete(`documents/${docId}/`);
            setPersonnelDocs((prev) => prev.filter((d) => d.id !== docId));
            setSelectedFileIndex(null);
        } catch (err) {
            console.error(err.response?.data || err);
        }
    };

    const handleDeletePersonnel = async (id) => {
        if (!window.confirm("آیا مطمئن هستید می‌خواهید حذف کنید؟")) return;
        try {
            await axiosInstance.delete(`personnels/${id}/`);
            setPersonnelList((prev) => prev.filter((p) => p.id !== id));
        } catch (err) {
            console.error(err.response?.data || err);
        }
    };

    return (
        <div className="container my-4 p-4 border rounded shadow-sm" dir="rtl">
            {/* سرچ و فیلتر */}
            <div className="d-flex justify-content-between align-items-center mb-3 gap-3">
                {/* 🔎 سرچ */}
                <input
                    type="text"
                    placeholder="جستجو در همه فیلدها..."
                    className="form-control w-25"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                {/* 📅 فیلتر تاریخ */}
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
                        onChange={(date) =>
                            setDateFilter((prev) => ({ ...prev, from: date }))
                        }
                        format="YYYY/MM/DD"
                        className="form-control"
                    />

                    <span>تا:</span>
                    <DatePicker
                        calendar={persian}
                        locale={persian_fa}
                        value={dateFilter.to}
                        onChange={(date) =>
                            setDateFilter((prev) => ({ ...prev, to: date }))
                        }
                        format="YYYY/MM/DD"
                        className="form-control"
                    />
                </div>

                <Link to="/personnel" className="btn btn-success">
                    ثبت پرسنل جدید
                </Link>
            </div>

            <h2 className="text-center mb-4">لیست پرسنل</h2>

            {/* جدول */}
            <div className="table-responsive">
                <table className="table table-striped table-bordered text-end">
                    <thead className="table-primary text-center">
                        <tr>
                            <th>کد پرسنلی</th>
                            <th>نام و نام خانوادگی</th>
                            <th>کد ملی</th>
                            <th>شماره شناسنامه</th>
                            <th>نام پدر</th>
                            <th>آدرس</th>
                            <th>کد پستی</th>
                            <th>ایمیل</th>
                            <th>سمت</th>
                            <th>تاریخ ایجاد</th>
                            <th>تاریخ ویرایش</th>
                            <th>عملیات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredList.map((p) => (
                            <tr key={p.id}>
                                <td>{p.personnel_code}</td>
                                <td>{p.full_name}</td>
                                <td>{p.national_id}</td>
                                <td>{p.birth_certificate_number}</td>
                                <td>{p.father_name}</td>
                                <td>{p.address}</td>
                                <td>{p.postal_code}</td>
                                <td>{p.email}</td>
                                <td>{p.position}</td>
                                <td>{formatDateTime(p.created_at)}</td>
                                <td>{formatDateTime(p.updated_at)}</td>
                                <td className="text-center align-middle">
                                    <div className="d-flex flex-column justify-content-center align-items-center gap-2">
                                        <button
                                            className="btn btn-success btn-sm w-100"
                                            onClick={() => handleSelect(p)}
                                        >
                                            مدارک
                                        </button>
                                        <button
                                            className="btn btn-warning btn-sm w-100"
                                            onClick={() => handleEdit(p)}
                                        >
                                            ویرایش
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm w-100"
                                            onClick={() => handleDeletePersonnel(p.id)}
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

            {/* مدال */}
            {showModal && selectedPersonnel && (
                <div className="modal show d-block" tabIndex="-1" role="dialog">
                    <div
                        className="modal-dialog w-[90vw] max-w-[1100px] max-h-[80vh] m-auto"
                        role="document"
                    >
                        <div className="modal-content flex flex-col" dir="rtl">
                            {/* هدر */}
                            <div className="modal-header">
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowModal(false)}
                                ></button>
                                <h5 className="modal-title text-center w-100">
                                    {isEditModal
                                        ? `ویرایش ${selectedPersonnel.full_name}`
                                        : `مدارک ${selectedPersonnel.full_name}`}
                                </h5>
                            </div>

                            {/* بدنه */}
                            <div className="modal-body flex-1 overflow-auto flex flex-col items-center gap-3">
                                {isEditModal ? (
                                    <form className="flex flex-col gap-3 w-full">
                                        {/* نام و نام خانوادگی */}
                                        <div>
                                            <label className="form-label">نام و نام خانوادگی</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={selectedPersonnel.full_name || ""}
                                                onChange={(e) =>
                                                    setSelectedPersonnel((prev) => ({
                                                        ...prev,
                                                        full_name: e.target.value,
                                                        updated_at: new Date().toISOString(),
                                                    }))
                                                }
                                            />
                                        </div>

                                        {/* کد ملی */}
                                        <div>
                                            <label className="form-label">کد ملی</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={selectedPersonnel.national_id || ""}
                                                onChange={(e) =>
                                                    setSelectedPersonnel((prev) => ({
                                                        ...prev,
                                                        national_id: e.target.value,
                                                        updated_at: new Date().toISOString(),
                                                    }))
                                                }
                                            />
                                        </div>
                                        {/* شماره شناسنامه */}
                                        <div>
                                            <label className="form-label">شماره شناسنامه</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={selectedPersonnel.birth_certificate_number || ""}
                                                onChange={(e) =>
                                                    setSelectedPersonnel((prev) => ({
                                                        ...prev,
                                                        birth_certificate_number: e.target.value,
                                                        updated_at: new Date().toISOString(),
                                                    }))
                                                }
                                            />
                                        </div>

                                        {/* نام پدر */}
                                        <div>
                                            <label className="form-label">نام پدر</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={selectedPersonnel.father_name || ""}
                                                onChange={(e) =>
                                                    setSelectedPersonnel((prev) => ({
                                                        ...prev,
                                                        father_name: e.target.value,
                                                        updated_at: new Date().toISOString(),
                                                    }))
                                                }
                                            />
                                        </div>

                                        {/* آدرس */}
                                        <div>
                                            <label className="form-label">آدرس</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={selectedPersonnel.address || ""}
                                                onChange={(e) =>
                                                    setSelectedPersonnel((prev) => ({
                                                        ...prev,
                                                        address: e.target.value,
                                                        updated_at: new Date().toISOString(),
                                                    }))
                                                }
                                            />
                                        </div>

                                        {/* کد پستی */}
                                        <div>
                                            <label className="form-label">کد پستی</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={selectedPersonnel.postal_code || ""}
                                                onChange={(e) =>
                                                    setSelectedPersonnel((prev) => ({
                                                        ...prev,
                                                        postal_code: e.target.value,
                                                        updated_at: new Date().toISOString(),
                                                    }))
                                                }
                                            />
                                        </div>

                                        {/* ایمیل */}
                                        <div>
                                            <label className="form-label">ایمیل</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                value={selectedPersonnel.email || ""}
                                                onChange={(e) =>
                                                    setSelectedPersonnel((prev) => ({
                                                        ...prev,
                                                        email: e.target.value,
                                                        updated_at: new Date().toISOString(),
                                                    }))
                                                }
                                            />
                                        </div>

                                        {/* سمت */}
                                        <div>
                                            <label className="form-label">سمت</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={selectedPersonnel.position || ""}
                                                onChange={(e) =>
                                                    setSelectedPersonnel((prev) => ({
                                                        ...prev,
                                                        position: e.target.value,
                                                        updated_at: new Date().toISOString(),
                                                    }))
                                                }
                                            />
                                        </div>



                                        {/* تاریخ ثبت */}
                                        <div className="mb-3">
                                            <label className="form-label">تاریخ ثبت</label>
                                            <DatePicker
                                                calendar={persian}
                                                locale={persian_fa}
                                                value={selectedPersonnel.created_at ? new Date(selectedPersonnel.created_at) : null}
                                                onChange={(date) =>
                                                    setSelectedPersonnel((prev) => ({
                                                        ...prev,
                                                        created_at: date.toDate(),        // ذخیره JS Date
                                                        updated_at: new Date().toISOString(), // آپدیت خودکار تاریخ ویرایش
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

                                        {/* تاریخ ویرایش */}
                                        <div>
                                            <label className="form-label">تاریخ آخرین ویرایش</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={formatDateTime(selectedPersonnel.updated_at)}
                                                readOnly
                                            />
                                        </div>
                                    </form>
                                ) : (
                                    <>
                                        {/* تب‌ها */}
                                        <ul className="nav nav-tabs mb-2 flex gap-2 flex-wrap justify-center w-full">
                                            {[
                                                { key: "national_card", label: "کارت ملی" },
                                                {
                                                    key: "birth_certificate",
                                                    label: "شناسنامه/کارت دانشجویی",
                                                },
                                                { key: "vehicle_card", label: "کارت خودرو" },
                                            ].map((tab) => (
                                                <li key={tab.key}>
                                                    <button
                                                        className={`nav-link ${activeDoc === tab.key ? "active" : ""
                                                            }`}
                                                        onClick={() => handleTabChange(tab.key)}
                                                    >
                                                        {tab.label}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>

                                        {/* مدارک */}
                                        <div className="flex flex-wrap justify-center gap-4 mt-2">
                                            {activeDocs.length > 0 ? (
                                                activeDocs.map((doc, index) => (
                                                    <div
                                                        key={doc.id}
                                                        className={`relative inline-flex justify-center items-center border rounded-lg shadow cursor-pointer transition-all duration-200
                              ${selectedFileIndex === index
                                                                ? "border-4 border-blue-500"
                                                                : "border-gray-300"
                                                            }`}
                                                        style={{ width: 200, height: 150 }}
                                                        onClick={() => setSelectedFileIndex(index)}
                                                    >
                                                        {doc.file.toLowerCase().endsWith(".pdf") ? (
                                                            <iframe
                                                                src={`${doc.file}`}
                                                                style={{
                                                                    width: "100%",
                                                                    height: "100%",
                                                                    objectFit: "cover",
                                                                }}
                                                                frameBorder="0"
                                                                title={`مدرک ${index}`}
                                                            />
                                                        ) : (
                                                            <img
                                                                src={`${doc.file}`}
                                                                alt="مدرک"
                                                                style={{
                                                                    maxWidth: "100%",
                                                                    maxHeight: "100%",
                                                                    objectFit: "contain",
                                                                }}
                                                            />
                                                        )}

                                                        {/* Overlay انتخاب */}
                                                        {selectedFileIndex === index && (
                                                            <div className="absolute inset-0 bg-blue-200 bg-opacity-20 flex justify-center items-center pointer-events-none"></div>
                                                        )}
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-gray-500 mt-4">مدرکی آپلود نشده</p>
                                            )}
                                        </div>

                                        {/* دکمه‌ها */}
                                        <div className="mt-3 flex gap-2 flex-wrap justify-center items-center w-full">
                                            <a
                                                href={
                                                    selectedFileIndex !== null
                                                        ? activeDocs[selectedFileIndex]?.file
                                                        : "#"
                                                }
                                                download
                                                className={`btn btn-primary ${selectedFileIndex === null
                                                    ? "opacity-50 pointer-events-none"
                                                    : ""
                                                    }`}
                                            >
                                                دانلود
                                            </a>

                                            <button
                                                className={`btn btn-danger ${selectedFileIndex === null
                                                    ? "opacity-50 pointer-events-none"
                                                    : ""
                                                    }`}
                                                onClick={() =>
                                                    handleDeleteDoc(activeDocs[selectedFileIndex]?.id)
                                                }
                                            >
                                                حذف
                                            </button>

                                            <button
                                                className={`btn btn-info ${selectedFileIndex === null
                                                    ? "opacity-50 pointer-events-none"
                                                    : ""
                                                    }`}
                                                onClick={() => setShowLargeImage(true)}
                                            >
                                                نمایش بزرگ
                                            </button>

                                            <label className="btn btn-success cursor-pointer">
                                                آپلود فایل
                                                <input
                                                    type="file"
                                                    className="d-none"
                                                    multiple
                                                    onChange={handleUploadNewDocs}
                                                />
                                            </label>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* فوتر */}
                            <div className="modal-footer flex justify-center gap-3">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setShowModal(false)}
                                >
                                    بستن
                                </button>
                                {isEditModal && (
                                    <button
                                        className="btn btn-primary"
                                        onClick={async () => {
                                            try {
                                                await axiosInstance.put(
                                                    `personnels/${selectedPersonnel.id}/`,
                                                    selectedPersonnel
                                                );
                                                fetchPersonnels();
                                                setShowModal(false);
                                            } catch (err) {
                                                console.error("خطا در ذخیره تغییرات:", err.response?.data || err);
                                                alert("خطا در ذخیره تغییرات");
                                            }
                                        }}
                                    >
                                        ذخیره تغییرات
                                    </button>

                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* نمایش بزرگ عکس */}
            {showLargeImage && selectedFileIndex !== null && (
                <PhotoProvider>
                    <PhotoSlider
                        images={[
                            { src: activeDocs[selectedFileIndex]?.file, key: "large-view" },
                        ]}
                        visible={showLargeImage}
                        onClose={() => setShowLargeImage(false)}
                    />
                </PhotoProvider>
            )}
        </div>
    );
}
