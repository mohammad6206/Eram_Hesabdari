import { useState, useEffect } from "react";

export default function PersonnelList() {
    const [personnelList, setPersonnelList] = useState([]);
    const [selectedPersonnel, setSelectedPersonnel] = useState(null);
    const [activeDoc, setActiveDoc] = useState("national_card_file"); // تب پیش‌فرض برای مدارک
    const [showModal, setShowModal] = useState(false);
    const [isEditModal, setIsEditModal] = useState(false); // مشخص می‌کند مدال ویرایش است یا مدارک
    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        fetch(`${API_URL}/api/personnels/`)
            .then((res) => res.json())
            .then((data) => setPersonnelList(data))
            .catch((err) => console.error(err));
    }, []);

    // باز کردن مدال مدارک
    const handleSelect = (person) => {
        setSelectedPersonnel(person);
        setActiveDoc("national_card_file");
        setIsEditModal(false);
        setShowModal(true);
    };

    // باز کردن مدال ویرایش جدول
    const handleEdit = (person) => {
        setSelectedPersonnel(person);
        setIsEditModal(true);
        setShowModal(true);
    };

    const handleDelete = (id) => {
        if (!window.confirm("آیا مطمئن هستید می‌خواهید حذف کنید؟")) return;
        fetch(`${API_URL}/api/personnels/${id}/`, { method: "DELETE" })
            .then(() => {
                setPersonnelList((prevList) => prevList.filter((p) => p.id !== id));
            })
            .catch((err) => console.error(err));
    };

    return (
        <div className="container my-4 p-4 border rounded shadow-sm" dir="rtl">
            <div className="mt-4 text-start">
                <button className="btn btn-success" onClick={() => window.history.back()}>
                    بازگشت
                </button>
            </div>
            <h2 className="text-center mb-4">لیست پرسنل ثبت شده</h2>

            <div className="table-responsive">
                <table className="table table-striped table-bordered text-end">
                    <thead className="table-primary">
                        <tr>
                            <th>کد پرسنلی</th>
                            <th>نام و نام خانوادگی</th>
                            <th>کد ملی</th>
                            <th>نام پدر</th>
                            <th>آدرس</th>
                            <th>کد پستی</th>
                            <th>ایمیل</th>
                            <th>سمت</th>
                            <th>مدارک</th>
                            <th>عملیات</th>
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
                                <td>{p.position}</td>
                                <td>
                                    <button
                                        className="btn btn-success btn-sm"
                                        onClick={() => handleSelect(p)}
                                    >
                                        مشاهده
                                    </button>
                                </td>
                                <td>
                                    <button
                                        type="button"
                                        className="btn btn-warning btn-sm me-2"
                                        onClick={() => handleEdit(p)}
                                    >
                                        ویرایش
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleDelete(p.id)}
                                    >
                                        حذف
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && selectedPersonnel && (
                <div className="modal show d-block" tabIndex="-1" role="dialog">
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content" dir="rtl">
                            <div className="modal-header">
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowModal(false)}
                                ></button>
                                <h5
                                    className="modal-title text-center"
                                    style={{ width: "100%", textAlign: "center" }}
                                >
                                    {isEditModal
                                        ? `ویرایش ${selectedPersonnel.full_name}`
                                        : `مدارک ${selectedPersonnel.full_name}`}
                                </h5>
                            </div>

                            <div className="modal-body">
                                {isEditModal ? (
                                    <form>
                                        <div className="mb-3">
                                            <label className="form-label">نام و نام خانوادگی</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={selectedPersonnel.full_name}
                                                onChange={(e) =>
                                                    setSelectedPersonnel((prev) => ({
                                                        ...prev,
                                                        full_name: e.target.value,
                                                    }))
                                                }
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">کد ملی</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={selectedPersonnel.national_id}
                                                onChange={(e) =>
                                                    setSelectedPersonnel((prev) => ({
                                                        ...prev,
                                                        national_id: e.target.value,
                                                    }))
                                                }
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">نام پدر</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={selectedPersonnel.father_name}
                                                onChange={(e) =>
                                                    setSelectedPersonnel((prev) => ({
                                                        ...prev,
                                                        father_name: e.target.value,
                                                    }))
                                                }
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">آدرس</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={selectedPersonnel.address}
                                                onChange={(e) =>
                                                    setSelectedPersonnel((prev) => ({
                                                        ...prev,
                                                        address: e.target.value,
                                                    }))
                                                }
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">کد پستی</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={selectedPersonnel.postal_code}
                                                onChange={(e) =>
                                                    setSelectedPersonnel((prev) => ({
                                                        ...prev,
                                                        postal_code: e.target.value,
                                                    }))
                                                }
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">ایمیل</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                value={selectedPersonnel.email}
                                                onChange={(e) =>
                                                    setSelectedPersonnel((prev) => ({
                                                        ...prev,
                                                        email: e.target.value,
                                                    }))
                                                }
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">سمت</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={selectedPersonnel.position || ""}
                                                onChange={(e) =>
                                                    setSelectedPersonnel((prev) => ({
                                                        ...prev,
                                                        position: e.target.value,
                                                    }))
                                                }
                                            />
                                        </div>
                                    </form>
                                ) : (
                                    <>
                                        {/* نمایش مدارک */}
                                        <ul className="nav nav-tabs mb-3">
                                            <li className="nav-item">
                                                <button
                                                    className={`nav-link ${activeDoc === "national_card_file" ? "active" : ""
                                                        }`}
                                                    onClick={() => setActiveDoc("national_card_file")}
                                                >
                                                    کارت ملی و شناسنامه
                                                </button>
                                            </li>
                                            <li className="nav-item">
                                                <button
                                                    className={`nav-link ${activeDoc === "birth_certificate_file" ? "active" : ""
                                                        }`}
                                                    onClick={() => setActiveDoc("birth_certificate_file")}
                                                >
                                                    کارت دانشجویی
                                                </button>
                                            </li>
                                            <li className="nav-item">
                                                <button
                                                    className={`nav-link ${activeDoc === "vehicle_card_file" ? "active" : ""
                                                        }`}
                                                    onClick={() => setActiveDoc("vehicle_card_file")}
                                                >
                                                    مدرک تحصیلی / کارت خودرو
                                                </button>
                                            </li>
                                        </ul>
                                        {selectedPersonnel[activeDoc] ? (
                                            <a
                                                href={selectedPersonnel[activeDoc]}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                مشاهده فایل
                                            </a>
                                        ) : (
                                            <p>مدارکی آپلود نشده</p>
                                        )}
                                    </>
                                )}
                            </div>

                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowModal(false)}
                                >
                                    بستن / لغو
                                </button>
                                {isEditModal && (
                                    <button
                                        type="button"
                                        className="btn btn-success"
                                        onClick={() => {
                                            setPersonnelList((prevList) =>
                                                prevList.map((p) =>
                                                    p.id === selectedPersonnel.id ? selectedPersonnel : p
                                                )
                                            );
                                            setShowModal(false);
                                        }}
                                    >
                                        ذخیره تغییرات
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )
            }
        </div >
    );
}
