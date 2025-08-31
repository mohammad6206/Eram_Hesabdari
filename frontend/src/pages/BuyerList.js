import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";


export default function Buyer() {
    const [buyerList, setBuyerList] = useState([]);
    const [selectedBuyer, setSelectedBuyer] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        fetch(`${API_URL}/api/buyers/`)
            .then(res => res.json())
            .then(data => setBuyerList(data))
            .catch(err => console.error(err));
    }, []);

    const handleDelete = (id) => {
        if (!window.confirm("آیا مطمئن هستید می‌خواهید حذف کنید؟")) return;
        fetch(`${API_URL}/api/buyers/${id}/`, { method: "DELETE" })
            .then(() => setBuyerList(prev => prev.filter(b => b.id !== id)))
            .catch(err => console.error(err));
    };

    const handleEdit = (buyer) => {
        setSelectedBuyer(buyer);
        setShowModal(true);
    };

    const handleUpdate = async () => {
        try {
            const res = await axios.patch(`${API_URL}/api/buyers/${selectedBuyer.id}/`, selectedBuyer, {
                headers: { "Content-Type": "application/json" }
            });
            setBuyerList(prev => prev.map(b => b.id === selectedBuyer.id ? res.data : b));
            setShowModal(false);
            alert("تغییرات با موفقیت ذخیره شد");
        } catch (err) {
            console.error(err.response?.data || err);
            alert("خطا در ذخیره تغییرات");
        }
    };

    return (

        <div className="container my-4 p-4 border rounded shadow-sm" dir="rtl">
            {/* لینک بازگشت به فرم ثبت خریدار */}
            <div className="mb-3 text-start">
                <Link to="/buyer" className="btn btn-success">
                    بازگشت    
                </Link>
            </div>



            <h2 className="text-center mb-4">لیست خریداران</h2>

            <div className="table-responsive">
                <table className="table table-striped table-bordered text-end">
                    <thead className="table-primary">
                        <tr>
                            <th>شماره خریدار</th>
                            <th>نام مرکز / نام شخص</th>
                            <th>شماره تماس</th>
                            <th>شناسه ملی</th>
                            <th>کد اقتصادی</th>
                            <th>کد پستی</th>
                            <th>آدرس</th>
                            <th>عملیات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {buyerList.map(b => (
                            <tr key={b.id}>
                                <td>{b.number}</td>
                                <td>{b.name}</td>
                                <td>{b.contact_phone}</td>
                                <td>{b.national_id}</td>
                                <td>{b.economic_code}</td>
                                <td>{b.postal_code}</td>
                                <td>{b.address}</td>
                                <td>
                                    <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(b)}>ویرایش</button>
                                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(b.id)}>حذف</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && selectedBuyer && (
                <div className="modal show d-block" tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content" dir="rtl">
                            <div className="modal-header">
                                <h5 className="modal-title text-center">ویرایش {selectedBuyer.name}</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                {["name", "contact_phone", "national_id", "economic_code", "postal_code", "address"].map(field => (
                                    <div className="mb-3" key={field}>
                                        <label className="form-label">{field}</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={selectedBuyer[field] || ""}
                                            onChange={(e) => setSelectedBuyer(prev => ({ ...prev, [field]: e.target.value }))}
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>لغو</button>
                                <button className="btn btn-primary" onClick={handleUpdate}>ذخیره تغییرات</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
