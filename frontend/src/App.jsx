import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "../components/Home";
import Dashboard from "../components/Admin";
import NewEmployee from "../components/Admin/NewEmployee";
import PageNotFound from "../components/Layout/PageNotFound";
import Branding from "../components/Admin/Branding";
import Branch from "../components/Admin/Branch";
import Currency from "../components/Admin/Currency";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/branding" element={<Branding />} />
        <Route path="/admin/branch" element={<Branch />} />
        <Route path="/admin/currency" element={<Currency />} />
        <Route path="/admin/new-employee" element={<NewEmployee />} />
        <Route path="/*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
