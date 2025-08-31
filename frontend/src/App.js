// src/App.js
import React from "react";
import { Routes, Route } from "react-router-dom";

// Layout
import Layout from "./components/Layout";

// صفحات اصلی
import Dashboard from "./pages/Dashboard";
import BasicInfo from "./pages/BasicInfo";
import ProductOperation from "./pages/ProductOperation";
import Warehouse from "./pages/Warehouse";
import Product from "./pages/Product";
import ProductGroup from "./pages/ProductGroup";
import Unit from "./pages/Unit";
import ConsumptionType from "./pages/ConsumptionType";
import NotFound from "./pages/NotFound";
import Device from "./pages/Device";
import DevicePart from "./pages/DevicePart";
import BuyInvoice from "./pages/BuyInvoice";
import SellInvoice from "./pages/SellInvoice";
import Personnel from "./pages/Personnel";
import PersonnelList from "./pages/PersonnelList"
import Seller from "./pages/Seller";
import Buyer from "./pages/Buyer";
import SellerList from "./pages/SellerList";
import BuyerList from "./pages/BuyerList";
function App() {
  return (
    <Routes>
      {/* همه صفحات داخل Layout */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />

        {/* اطلاعات پایه */}
        <Route path="basic-info" element={<BasicInfo />} />
        <Route path="product-operation" element={<ProductOperation />} />
        <Route path="warehouse" element={<Warehouse />} />
        <Route path="product" element={<Product />} />
        <Route path="product-group" element={<ProductGroup />} />
        <Route path="unit" element={<Unit />} />
        <Route path="consumption-type" element={<ConsumptionType />} />
        <Route path="device" element={<Device />} />
        <Route path="device-part" element={<DevicePart />} />
        <Route path="buy-invoice" element={<BuyInvoice />} />
        <Route path="sell-invoice" element={<SellInvoice />} />
        <Route path="personnel" element={<Personnel />} />
        <Route path="personnel-list" element={<PersonnelList />} />
        <Route path="seller" element={<Seller />} />
        <Route path="buyer" element={<Buyer />} />
        <Route path="sellerlist" element={<SellerList />} />
        <Route path="buyerlist" element={<BuyerList />} />
        {/* صفحه 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
