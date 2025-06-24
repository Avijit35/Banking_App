import { useState, useEffect } from "react";
import Cookies from "universal-cookie";
import { http } from "../../modules/modules.js";
import { Navigate, Outlet } from "react-router-dom";
import Loader from "../Loader/index.jsx";

const Guard = ({ endpoint, role }) => {
  const cookies = new Cookies();
  const token = cookies.get("authToken");
  const [authorized, setAuthorized] = useState(false);
  const [loader, setLoader] = useState(true);
  const [userType, setUserType] = useState(null);

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
          setLoader(false);
          sessionStorage.setItem("userInfo", JSON.stringify(data?.data));
          setUserType(data?.data?.userType);
        } else {
          setAuthorized(false);
          setLoader(false);
        }
      } catch (err) {
        setAuthorized(false);
        setLoader(false);
      }
    };

    verifyToken();
  }, [endpoint]);

  if (loader) {
    return <Loader />;
  }

  if (authorized && role === userType) {
    return <Outlet />;
  } else if (authorized && role === userType) {
    return <Outlet />;
  } else if (authorized && role === userType) {
    return <Outlet />;
  } else {
    return <Navigate to="/" />;
  }
};

export default Guard;
