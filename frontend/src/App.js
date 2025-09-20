import React from "react";
import { Routes, Route } from "react-router-dom";

// Layout
import Layout from "./components/Layout";
import Login from "./pages/Login";
import PrivateRoute from "./routes/PrivateRoute";
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
import PersonnelList from "./pages/PersonnelList";
import Seller from "./pages/Seller";
import Buyer from "./pages/Buyer";
import SellerList from "./pages/SellerList";
import BuyerList from "./pages/BuyerList";
import BuyInvoiceList from "./pages/BuyInvoiceList";
import SellInvoiceList from "./pages/SellInvoiceList";
import InventoryItem from "./pages/InventoryItem";
import InventoryOut from "./pages/InventoryOut";
import ProductPakage from "./pages/ProductPakage";
import WarehouseTransfer from "./pages/WarehouseTransfer";
import TransportationType from "./pages/TransportationType";
import DeviceList from "./pages/DeviceList";
import DeviceGeneration from "./pages/DiviceGeneration";
function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={
        <PrivateRoute>
          <Layout />
        </PrivateRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
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
        <Route path="BuyInvoiceList" element={<BuyInvoiceList />} />
        <Route path="SellInvoiceList" element={<SellInvoiceList />} />
        <Route path="inventory-item" element={<InventoryItem />} />
        <Route path="inventory-out-item" element={<InventoryOut />} />
        <Route path="product-pakage" element={<ProductPakage />} />
        <Route path="warehouse-transfer" element={<WarehouseTransfer />} />
        <Route path="transportation-type" element={<TransportationType />} />
        <Route path="device-list" element={<DeviceList />} />
        <Route path="device-generation" element={<DeviceGeneration />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
