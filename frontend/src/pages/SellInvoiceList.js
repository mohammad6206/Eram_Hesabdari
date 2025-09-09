import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import moment from "moment-jalaali";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

export default function SellInvoiceList() {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showItemsModal, setShowItemsModal] = useState(false);
    const [sellers, setSellers] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [buyers, setBuyers] = useState([]);

    // 🔎 جستجو و فیلتر
    const [searchText, setSearchText] = useState("");
    const [dateFilter, setDateFilter] = useState({ from: null, to: null });
    const [dateField, setDateField] = useState("created_at");


    useEffect(() => {
        axiosInstance
            .get("/sell-invoices/")
            .then((res) => setInvoices(res.data))
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        axiosInstance
            .get("/sellers/")
            .then((res) => setSellers(res.data))
            .catch((err) => console.error("Error fetching sellers:", err));
    }, []);

    useEffect(() => {
        axiosInstance
            .get("/buyers/")
            .then((res) => setBuyers(res.data)) // ❌ اینجا error میده
            .catch((err) => console.error("Error fetching buyers:", err));
    }, []);

    useEffect(() => {
        axiosInstance
            .get("/warehouses/")
            .then((res) => setWarehouses(res.data))
            .catch((err) => console.error("Error fetching warehouses:", err));
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("آیا مطمئن هستید می‌خواهید حذف کنید؟")) return;
        try {
            await axiosInstance.delete(`/sell-invoices/${id}/`);
            setInvoices((prev) => prev.filter((inv) => inv.id !== id));
        } catch (err) {
            console.error("Error deleting invoice:", err);
        }
    };

    const handleEdit = (invoice) => {
        setSelectedInvoice(invoice);
        setShowEditModal(true);
    };

    const handleShowItems = (invoice) => {
        setSelectedInvoice(invoice);
        setShowItemsModal(true);
    };


    // تابع برای فیلتر
    const filteredInvoices = invoices.filter((inv) => {
        // 🔎 جستجو در همه فیلدها
        const searchMatch =
            inv.invoice_number?.toString().includes(searchText) ||
            inv.seller_name?.includes(searchText) ||
            inv.seller?.name?.includes(searchText) ||
            inv.buyer_name?.includes(searchText) ||
            inv.buyer?.full_name?.includes(searchText) ||
            inv.destination_name?.includes(searchText) ||
            inv.destination?.name?.includes(searchText) ||
            inv.total_amount?.toString().includes(searchText);

        // 📅 فیلتر تاریخ
        let dateMatch = true;
        if (dateFilter.from || dateFilter.to) {
            const fieldValue = inv[dateField];
            if (fieldValue) {
                const invoiceDate = new Date(fieldValue);

                if (dateFilter.from) {
                    const fromDate = dateFilter.from.toDate(); // از DatePicker
                    fromDate.setHours(0, 0, 0, 0); // شروع روز
                    if (invoiceDate < fromDate) dateMatch = false;
                }

                if (dateFilter.to) {
                    const toDate = dateFilter.to.toDate();
                    toDate.setHours(23, 59, 59, 999); // انتهای روز
                    if (invoiceDate > toDate) dateMatch = false;
                }
            }
        }


        return searchMatch && dateMatch;
    });


    const handleSaveEdit = async () => {
        if (!selectedInvoice) return;

        const payload = {
            invoice_number: selectedInvoice.invoice_number,
            seller:
                typeof selectedInvoice.seller === "object"
                    ? selectedInvoice.seller.id
                    : selectedInvoice.seller,
            buyer:
                typeof selectedInvoice.buyer === "object"
                    ? selectedInvoice.buyer.id
                    : selectedInvoice.buyer,
            destination:
                typeof selectedInvoice.destination === "object"
                    ? selectedInvoice.destination.id
                    : selectedInvoice.destination,
            total_amount: Number(selectedInvoice.total_amount) || 0,
            created_at: selectedInvoice.created_at, // میلادی
            updated_at: new Date().toISOString(),  // میلادی
        };

        try {
            const res = await axiosInstance.put(
                `/sell-invoices/${selectedInvoice.id}/`,
                payload
            );
            setInvoices((prev) =>
                prev.map((inv) => (inv.id === res.data.id ? res.data : inv))
            );
            setShowEditModal(false);
        } catch (err) {
            console.error("❌ Error updating invoice:", err.response?.data || err);
        }
    };

    if (loading) return <p>در حال بارگذاری...</p>;

    return (
        <div className="container my-4 p-4 border rounded shadow-sm" dir="rtl">
            <div className="mb-3 text-start">
                <button
                    className="btn btn-success"
                    onClick={() => (window.location.href = "/sell-invoice")}
                >
                    ثبت فاکتور جدید
                </button>
            </div>

            <h2 className="text-center mb-4">لیست فاکتورهای فروش</h2>



            {/* جستجو و فیلتر */}
            <div
                style={{
                    display: "flex",
                    gap: "10px",
                    marginBottom: "20px",
                    alignItems: "center",
                    flexWrap: "nowrap",
                }}
            >
                <input
                    type="text"
                    placeholder="جستجو در همه فیلدها..."
                    className="form-input"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{ flexGrow: 1, minWidth: "250px" }}
                />

                <select
                    className="form-select small-select"
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
                    inputClass="form-input"
                    placeholder="تاریخ شروع"
                    style={{ minWidth: "150px" }}
                />

                <span>تا:</span>
                <DatePicker
                    calendar={persian}
                    locale={persian_fa}
                    value={dateFilter.to}
                    onChange={(date) => setDateFilter((prev) => ({ ...prev, to: date }))}
                    inputClass="form-input"
                    placeholder="تاریخ پایان"
                    style={{ minWidth: "150px" }}
                />
            </div>
            <div className="table-responsive">
                <table className="table table-striped table-bordered text-end">
                    <thead className="table-primary text-center">
                        <tr>
                            <th>شماره فاکتور</th>
                            <th>خریدار</th>
                            <th>تامین‌کننده</th>
                            <th>خروج از انبار</th>
                            <th>جمع کل (ریال)</th>
                            <th>تاریخ ایجاد</th>
                            <th>تاریخ ویرایش</th>
                            <th>فهرست فروش</th>
                            <th>فایل فاکتور</th>
                            <th>عملیات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredInvoices.length > 0 ? (
                            filteredInvoices.map((inv) => (
                                <tr key={inv.id}>
                                    <td>{inv.invoice_number}</td>
                                    <td>{inv.buyer_name || inv.buyer?.full_name}</td>
                                    <td>{inv.seller_name || inv.seller?.name}</td>
                                    <td>{inv.destination_name || inv.destination?.name}</td>
                                    <td>{inv.total_amount ? Number(inv.total_amount).toLocaleString("en-US") : "-"}</td>
                                    <td>
                                        {inv.created_at
                                            ? moment(inv.created_at).format("HH:mm jYYYY/jMM/jDD")
                                            : "-"}
                                    </td>
                                    <td>
                                        {inv.updated_at
                                            ? moment(inv.updated_at).format("HH:mm jYYYY/jMM/jDD")
                                            : "-"}
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-info"
                                            onClick={() => handleShowItems(inv)}
                                        >
                                            مشاهده
                                        </button>
                                    </td>
                                    <td>
                                        {inv.invoice_file ? (
                                            <button
                                                className="btn btn-sm btn-secondary"
                                                onClick={() => {
                                                    const fileUrl = inv.invoice_file.startsWith("http")
                                                        ? inv.invoice_file
                                                        : `${process.env.REACT_APP_API_URL}${inv.invoice_file}`;
                                                    window.open(
                                                        fileUrl,
                                                        "_blank",
                                                        "width=900,height=600,scrollbars=yes,resizable=yes"
                                                    );
                                                }}
                                            >
                                                مشاهده فایل
                                            </button>
                                        ) : "-"}
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-warning me-2"
                                            onClick={() => handleEdit(inv)}
                                        >
                                            ویرایش
                                        </button>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleDelete(inv.id)}
                                        >
                                            حذف
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="10" className="text-center">
                                    فاکتوری ثبت نشده است.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* مدال ویرایش */}
            {showEditModal && selectedInvoice && (
                <div className="modal show d-block" tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content" dir="rtl">
                            <div className="modal-header">
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowEditModal(false)}
                                ></button>
                                <h5 className="modal-title text-center w-100">
                                    ویرایش فاکتور {selectedInvoice.invoice_number}
                                </h5>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">شماره فاکتور</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={selectedInvoice.invoice_number || ""}
                                        onChange={(e) =>
                                            setSelectedInvoice((prev) => ({
                                                ...prev,
                                                invoice_number: e.target.value,
                                            }))
                                        }
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">خریدار</label>
                                    <select
                                        className="form-control"
                                        value={selectedInvoice.buyer || ""}
                                        onChange={(e) =>
                                            setSelectedInvoice((prev) => ({
                                                ...prev,
                                                buyer: parseInt(e.target.value),
                                            }))
                                        }
                                    >
                                        <option value="">انتخاب کنید...</option>
                                        {buyers.map((b) => (
                                            <option key={b.id} value={b.id}>
                                                {b.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">تامین کننده</label>
                                    <select
                                        className="form-control"
                                        value={selectedInvoice.seller || ""}
                                        onChange={(e) =>
                                            setSelectedInvoice((prev) => ({
                                                ...prev,
                                                seller: parseInt(e.target.value),
                                            }))
                                        }
                                    >
                                        <option value="">انتخاب کنید...</option>
                                        {sellers.map((s) => (
                                            <option key={s.id} value={s.id}>
                                                {s.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>


                                <div className="mb-3">
                                    <label className="form-label">خروج از انبار</label>
                                    <select
                                        className="form-control"
                                        value={selectedInvoice.destination || ""}
                                        onChange={(e) =>
                                            setSelectedInvoice((prev) => ({
                                                ...prev,
                                                destination: parseInt(e.target.value),
                                            }))
                                        }
                                    >
                                        <option value="">انتخاب کنید...</option>
                                        {warehouses.map((w) => (
                                            <option key={w.id} value={w.id}>
                                                {w.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">جمع کل (ریال)</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={
                                            selectedInvoice.total_amount
                                                ? Number(selectedInvoice.total_amount).toLocaleString("en-US")
                                                : ""
                                        }
                                        onChange={(e) => {
                                            const rawValue = e.target.value.replace(/,/g, "");
                                            if (!isNaN(rawValue)) {
                                                setSelectedInvoice((prev) => ({
                                                    ...prev,
                                                    total_amount: rawValue,
                                                }));
                                            }
                                        }}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">تاریخ ایجاد</label>
                                    <DatePicker
                                        calendar={persian}
                                        locale={persian_fa}
                                        value={selectedInvoice.created_at ? new Date(selectedInvoice.created_at) : null}
                                        onChange={(date) =>
                                            setSelectedInvoice((prev) => ({
                                                ...prev,
                                                created_at: date.toDate().toISOString(),
                                            }))
                                        }
                                        format="HH:mm YYYY/MM/DD"
                                        calendarPosition="bottom-right"
                                        timePicker
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">تاریخ ویرایش</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={
                                            selectedInvoice.updated_at
                                                ? moment(selectedInvoice.updated_at).format("HH:mm jYYYY/jMM/jDD")
                                                : "-"
                                        }
                                        readOnly
                                    />
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowEditModal(false)}
                                >
                                    لغو
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-success"
                                    onClick={handleSaveEdit}
                                >
                                    ذخیره تغییرات
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showItemsModal && selectedInvoice && (
                <div className="modal show d-block" tabIndex="-1" role="dialog">
                    <div className="modal-dialog modal-xl" role="document">
                        <div className="modal-content" dir="rtl">
                            <div className="modal-header">
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowItemsModal(false)}
                                ></button>
                                <h5 className="modal-title text-center w-100">
                                    فهرست فروش فاکتور {selectedInvoice.invoice_number}
                                </h5>
                            </div>
                            <div className="modal-body">
                                <table className="table table-bordered text-end">
                                    <thead className="table-secondary text-center ">
                                        <tr>
                                            <th>ردیف</th>
                                            <th>نام کالا</th>
                                            <th>کد اختصاصی</th>
                                            <th>تعداد</th>
                                            <th>واحد</th>
                                            <th>مبلغ واحد</th>
                                            <th>مبلغ کل(ریال)</th>
                                            <th>مالیات (%)</th>
                                            <th>مبلغ مالیات(ریال)</th>
                                            <th>مبلغ کل بعد از مالیات(ریال)</th>
                                            <th>توضیحات</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedInvoice.items && selectedInvoice.items.length > 0 ? (
                                            selectedInvoice.items.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{item.product_name || "-"}</td>
                                                    <td>{item.product_code || "-"}</td>
                                                    <td>{Number(item.quantity).toLocaleString("en")}</td>
                                                    <td>{item.unit_title || "-"}</td>
                                                    <td>{Number(item.unit_price).toLocaleString("en")}</td>
                                                    <td>{Number(item.total_amount).toLocaleString("en")}</td>
                                                    <td>{Number(item.tax_rate).toLocaleString("en")}</td>
                                                    <td>{Number(item.tax_amount).toLocaleString("en")}</td>
                                                    <td>{Number(item.final_amount).toLocaleString("en")}</td>
                                                    <td>{item.description || "-"}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="11" className="text-center">
                                                    آیتمی ثبت نشده است.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
