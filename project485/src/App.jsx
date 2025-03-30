import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./LoginPage";
import Dashboard from "./pages/Dashboard";
import CustomerDetails from "./CustomerDetails";
import AddCustomer from "./pages/AddCustomer"; // ✅ Import AddCustomer component

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/customer/:lockerId" element={<CustomerDetails />} />
        <Route path="/add-customer" element={<AddCustomer />} /> {/*  New Route */}
      </Routes>
    </Router>
  );
}
