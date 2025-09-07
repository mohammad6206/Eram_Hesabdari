import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

const API_URL = process.env.REACT_APP_API_URL;

// تابع فرمت نمایش تاریخ/ساعت شمسی
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
  return `${faDate} ${faTime}`;
};

export default function BuyerList() {
  const [buyerList, setBuyerList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [selectedBuyer, setSelectedBuyer] = useState(null);

  // 🔎 سرچ و فیلتر تاریخ
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState({ from: null, to: null });
  const [dateField, setDateField] = useState("created_at"); // created_at یا updated_at

  // دریافت لیست خریداران
  const fetchBuyers = () => {
    fetch(`${API_URL}/api/buyers/`)
      .then((res) => res.json())
      .then((data) => {
        setBuyerList(data);
        setFilteredList(data);
      })
      .catch((err) => console.error("خطا در دریافت خریداران:", err));
  };

  useEffect(() => {
    fetchBuyers();
  }, []);

  // اعمال فیلتر و سرچ
  useEffect(() => {
    let result = buyerList;

    // 🔹 سرچ روی همه فیلدها
    if (search.trim() !== "") {
      result = result.filter((b) =>
        Object.values(b).some((val) =>
          String(val).toLowerCase().includes(search.toLowerCase())
        )
      );
    }

    // 🔹 فیلتر بر اساس بازه تاریخ
    if (dateFilter.from || dateFilter.to) {
      result = result.filter((b) => {
        const dateValue = b[dateField] ? new Date(b[dateField]) : null;
        if (!dateValue) return false;

        let isValid = true;
        if (dateFilter.from)
          isValid = isValid && dateValue >= new Date(dateFilter.from.toDate());
        if (dateFilter.to)
          isValid = isValid && dateValue <= new Date(dateFilter.to.toDate());
        return isValid;
      });
    }

    setFilteredList(result);
  }, [search, dateFilter, dateField, buyerList]);

  // باز کردن مودال و انتخاب خریدار
  const handleEdit = (buyer) => {
    setSelectedBuyer(buyer);
    setShowModal(true);
  };

  // حذف خریدار
  const handleDelete = (id) => {
    if (!window.confirm("آیا مطمئن هستید که می‌خواهید این خریدار را حذف کنید؟")) return;
    fetch(`${API_URL}/api/buyers/${id}/`, { method: "DELETE" })
      .then((res) => {
        if (!res.ok) throw new Error("خطا در حذف خریدار");
        fetchBuyers();
      })
      .catch((err) => console.error("خطا:", err));
  };

  return (
    <div className="container my-4 p-4 border rounded shadow-sm" dir="rtl">
      {/* 🔍 سرچ و فیلتر */}
      <div className="d-flex justify-content-between align-items-center mb-3 gap-3">
        <input
          type="text"
          placeholder="جستجو در همه فیلدها..."
          className="form-control w-25"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

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

        <Link to="/buyer" className="btn btn-success">ثبت خریدار جدید</Link>
      </div>

      <h2 className="text-center mb-4">لیست خریداران</h2>

      {/* جدول */}
      <div className="table-responsive">
        <table className="table table-striped table-bordered text-end">
          <thead className="table-primary text-center">
            <tr>
              <th>شماره خریدار</th>
              <th>نام مرکز / نام شخص</th>
              <th>شماره تماس</th>
              <th>شناسه ملی</th>
              <th>کد اقتصادی</th>
              <th>کد پستی</th>
              <th>آدرس</th>
              <th>تاریخ ایجاد</th>
              <th>تاریخ ویرایش</th>
              <th>عملیات</th>
            </tr>
          </thead>
          <tbody>
            {filteredList.map((b) => (
              <tr key={b.id}>
                <td>{b.number}</td>
                <td>{b.name}</td>
                <td>{b.contact_phone}</td>
                <td>{b.national_id}</td>
                <td>{b.economic_code}</td>
                <td>{b.postal_code}</td>
                <td>{b.address}</td>
                <td>{formatDateTime(b.created_at)}</td>
                <td>{formatDateTime(b.updated_at)}</td>
                <td className="text-center align-middle">
                  <div className="d-flex flex-column justify-content-center align-items-center gap-2">
                    <button
                      className="btn btn-warning btn-sm w-100"
                      onClick={() => handleEdit(b)}
                    >
                      ویرایش
                    </button>
                    <button
                      className="btn btn-danger btn-sm w-100"
                      onClick={() => handleDelete(b.id)}
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

      {/* مودال ویرایش */}
      {showModal && selectedBuyer && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog w-[600px] m-auto" role="document">
            <div className="modal-content p-3" dir="rtl">
              <div className="modal-header">
                <h5 className="modal-title text-center w-100">
                  ویرایش {selectedBuyer.name}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>

              <div className="modal-body">
                {/* فیلدها */}
                {[
                  { key: "name", label: "نام مرکز / نام شخص" },
                  { key: "contact_phone", label: "شماره تماس" },
                  { key: "national_id", label: "شناسه ملی" },
                  { key: "economic_code", label: "کد اقتصادی" },
                  { key: "postal_code", label: "کد پستی" },
                  { key: "address", label: "آدرس" },
                ].map((field) => (
                  <div className="mb-3" key={field.key}>
                    <label className="form-label">{field.label}</label>
                    <input
                      type="text"
                      className="form-control"
                      value={selectedBuyer[field.key] || ""}
                      onChange={(e) =>
                        setSelectedBuyer((prev) => ({
                          ...prev,
                          [field.key]: e.target.value,
                          updated_at: new Date().toISOString(),
                        }))
                      }
                    />
                  </div>
                ))}

                {/* تاریخ ثبت */}
                <div className="mb-3">
                  <label className="form-label">تاریخ ثبت</label>
                  <DatePicker
                    calendar={persian}
                    locale={persian_fa}
                    value={
                      selectedBuyer.created_at
                        ? new Date(selectedBuyer.created_at)
                        : null
                    }
                    onChange={(date) =>
                      setSelectedBuyer((prev) => ({
                        ...prev,
                        created_at: date.toDate(),
                        updated_at: new Date().toISOString(),
                      }))
                    }
                    format="YYYY/MM/DD     HH:mm"
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

                {/* تاریخ آخرین ویرایش */}
                <div className="mb-3">
                  <label className="form-label">تاریخ آخرین ویرایش</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formatDateTime(selectedBuyer.updated_at)}
                    readOnly
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  بستن / لغو
                </button>
                <button
                  className="btn btn-success"
                  onClick={() => {
                    setBuyerList((prev) =>
                      prev.map((b) =>
                        b.id === selectedBuyer.id ? selectedBuyer : b
                      )
                    );
                    setShowModal(false);
                  }}
                >
                  ذخیره تغییرات
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
