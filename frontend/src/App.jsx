import { lazy, Suspense } from "react";
import Guard from "../components/Guard";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Loader from "../components/Loader";

const Homepage = lazy(() => import("../components/Home"));
const PageNotFound = lazy(() => import("../components/Layout/PageNotFound"));
const AdminDashboard = lazy(() => import("../components/Admin"));
const Branding = lazy(() => import("../components/Admin/Branding"));
const Branch = lazy(() => import("../components/Admin/Branch"));
const Currency = lazy(() => import("../components/Admin/Currency"));
const NewEmployee = lazy(() => import("../components/Admin/NewEmployee"));
const AdminNewAccount = lazy(() =>
  import("../components/Admin/AdminNewAccount")
);
const AdminNewTransaction = lazy(() =>
  import("../components/Admin/AdminNewTransaction")
);
const EmployeeDashboard = lazy(() => import("../components/Employee"));
const EmpNewAccount = lazy(() =>
  import("../components/Employee/EmpNewAccount")
);
const EmpTransaction = lazy(() =>
  import("../components/Employee/EmpTransaction")
);
const CustomerDashboard = lazy(() => import("../components/Customer"));
const CustomerTransaction = lazy(() =>
  import("../components/Customer/Transactions")
);

const App = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Homepage />} />

          {/* Start Admin routes */}
          <Route
            path="/admin/"
            element={<Guard endpoint="/api/verify-token" role="admin" />}
          >
            <Route index element={<AdminDashboard />} />
            <Route path="branding" element={<Branding />} />
            <Route path="branch" element={<Branch />} />
            <Route path="currency" element={<Currency />} />
            <Route path="new-employee" element={<NewEmployee />} />
            <Route path="new-account" element={<AdminNewAccount />} />
            <Route path="new-transaction" element={<AdminNewTransaction />} />
            <Route path="*" element={<PageNotFound />} />
          </Route>
          {/* End Admin routes */}

          {/* Start Employee routes */}
          <Route
            path="/employee/"
            element={<Guard endpoint="/api/verify-token" role="employee" />}
          >
            <Route index element={<EmployeeDashboard />} />
            <Route path="new-account" element={<EmpNewAccount />} />
            <Route path="new-transaction" element={<EmpTransaction />} />
            <Route path="*" element={<PageNotFound />} />
          </Route>
          {/* Start Employee routes */}

          {/* Start Customer routes */}
          <Route
            path="/customer/"
            element={<Guard endpoint="/api/verify-token" role="customer" />}
          >
            <Route index element={<CustomerDashboard />} />
            <Route path="transaction" element={<CustomerTransaction />} />
            <Route path="*" element={<PageNotFound />} />
          </Route>
          {/* Start Customer routes */}

          <Route path="/*" element={<PageNotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
