import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "../components/Home";
import Dashboard from "../components/Admin";
import NewEmployee from "../components/Admin/NewEmployee";
import PageNotFound from "../components/Layout/PageNotFound";
import Branding from "../components/Admin/Branding";
import Branch from "../components/Admin/Branch";
import Currency from "../components/Admin/Currency";
import EmployeeDashboard from "../components/Employee";
import Guard from "../components/Guard";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />

        {/* Start Admin routes */}
        <Route
          path="/admin/"
          element={<Guard endpoint="/api/verify-token" role="admin" />}
        >
          <Route index element={<Dashboard />} />
          <Route path="branding" element={<Branding />} />
          <Route path="branch" element={<Branch />} />
          <Route path="currency" element={<Currency />} />
          <Route path="new-employee" element={<NewEmployee />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
        {/* End Admin routes */}

        {/* Start Employee routes */}
        <Route
          path="/employee/"
          element={<Guard endpoint="/api/verify-token" role="employee" />}
        >
          <Route index element={<EmployeeDashboard />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
        {/* Start Employee routes */}

        <Route path="/*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
