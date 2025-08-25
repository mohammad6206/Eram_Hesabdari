// src/App.js
import React from "react";
import { Routes, Route } from "react-router-dom";

// Layout
import Layout from "./components/Layout";

// صفحات اصلی
import Dashboard from "./pages/Dashboard";
import BasicInfo from "./pages/BasicInfo";
import Warehouse from "./pages/Warehouse";
import Product from "./pages/Product";
import ProductGroup from "./pages/ProductGroup";
import Unit from "./pages/Unit";
import ConsumptionType from "./pages/ConsumptionType";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>
      {/* همه صفحات داخل Layout */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />

        {/* اطلاعات پایه */}
        <Route path="basic-info" element={<BasicInfo />} />
        <Route path="warehouse" element={<Warehouse />} />
        <Route path="product" element={<Product />} />
        <Route path="product-group" element={<ProductGroup />} />
        <Route path="unit" element={<Unit />} />
        <Route path="consumption-type" element={<ConsumptionType />} />

        {/* صفحه 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
