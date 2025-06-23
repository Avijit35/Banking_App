import { useState, useEffect } from "react";
import Cookies from "universal-cookie";
import { http } from "../../modules/modules.js";
import { Navigate, Outlet } from "react-router-dom";

const Guard = ({ endpoint, role }) => {
  const cookies = new Cookies();
  const token = cookies.get("authToken");
  const [authorized, setAuthorized] = useState(false);

  if (token === undefined) {
    return <Navigate to="/" />;
  }

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setAuthorized(false);
        return <Navigate to="/" />;
      }

      try {
        const httpReq = http(token);
        const { data } = await httpReq.get(endpoint);
        if (data?.isVerified) {
          setAuthorized(true);
          sessionStorage.setItem("userInfo", JSON.stringify(data?.data));
        } else {
          setAuthorized(false);
        }
      } catch (err) {
        setAuthorized(false);
      }
    };

    verifyToken();
  }, [endpoint]);
  console.log(authorized);
  if (authorized && role === "admin") {
    return <Outlet />;
  } else if (authorized && role === "employee") {
    return <Outlet />;
  } else if (authorized && role === "customer") {
    return <Outlet />;
  }
  // else {
  //   return <Navigate to="/" />;
  // }
};

export default Guard;
