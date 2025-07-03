import { lazy, Suspense } from "react";
import Guard from "../components/Guard";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Loader from "../components/Loader";

const Homepage = lazy(() => import("../components/Home"));
const Dashboard = lazy(() => import("../components/Admin"));
const NewEmployee = lazy(() => import("../components/Admin/NewEmployee"));
const PageNotFound = lazy(() => import("../components/Layout/PageNotFound"));
const Branding = lazy(() => import("../components/Admin/Branding"));
const Branch = lazy(() => import("../components/Admin/Branch"));
const Currency = lazy(() => import("../components/Admin/Currency"));
const EmployeeDashboard = lazy(() => import("../components/Employee"));
const NewAccount = lazy(() => import("../components/Employee/NewAccount"));

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
            <Route path="new-employee" element={<NewAccount />} />
            <Route path="*" element={<PageNotFound />} />
          </Route>
          {/* Start Employee routes */}

          <Route path="/*" element={<PageNotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
