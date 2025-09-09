import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance"; // جایگزین axios
import "bootstrap/dist/css/bootstrap.min.css";

function DevicePart() {
  const [devices, setDevices] = useState([]);
  const [products, setProducts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState("");

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchDevices();
    fetchProducts();
    fetchGroups();
  }, []);

  const fetchDevices = async () => {
    try {
      const res = await axiosInstance.get(`${API_URL}/api/devices/`);
      setDevices(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axiosInstance.get(`${API_URL}/api/products/`);
      setProducts(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchGroups = async () => {
    try {
      const res = await axiosInstance.get(`${API_URL}/api/product-groups/`);
      setGroups(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const getGroupName = (groupId) => {
    if (!groupId) return "-";
    const group = groups.find((g) => g.id === groupId);
    return group ? group.title : "-";
  };

  const filteredProducts = selectedDevice
    ? products.filter((p) => p.device === parseInt(selectedDevice))
    : [];

  return (
    <div className="container my-5" dir="rtl">
      <div className="card bg-white shadow-sm border-0">
        <div className="card-header bg-light d-flex justify-content-between align-items-center">
          <h5 className="mb-0 text-dark">قطعات هر دستگاه</h5>
          <select
            className="form-select w-auto me-auto bg-white text-dark border"
            value={selectedDevice}
            onChange={(e) => setSelectedDevice(e.target.value)}
          >
            <option value="">-- انتخاب دستگاه --</option>
            {devices.map((d) => (
              <option key={d.id} value={d.id}>
                {d.title}
              </option>
            ))}
          </select>
        </div>

        <div className="card-body">
          {selectedDevice === "" ? (
            <div className="alert alert-info text-center">
              لطفاً یک دستگاه انتخاب کنید.
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="alert alert-warning text-center">
              هیچ کالایی برای این دستگاه ثبت نشده است.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-hover text-center align-middle">
                <thead className="table-primary text-center">
                  <tr>
                    <th>نام قطعه</th>
                    <th>شماره کالا</th>
                    <th>کد اختصاصی</th>
                    <th>گروه کالا</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((p) => (
                    <tr key={p.id}>
                      <td>{p.name}</td>
                      <td>{p.number}</td>
                      <td>{p.product_code || "-"}</td>
                      <td>{getGroupName(p.group)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DevicePart;