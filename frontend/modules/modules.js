import axios from "axios";

//http request
export const http = (accessToken = null) => {
  axios.defaults.baseURL = import.meta.env.VITE_BASEURL;
  if (accessToken)
    axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

  return axios;
};

//trim data
export const trimData = (obj) => {
  let finalobj = {};
  for (let key in obj) {
    let value = obj[key];
    if (typeof value === "string") {
      finalobj[key] = value.trim();
    } else if (typeof value === "number" || typeof value === "boolean") {
      finalobj[key] = value.toString();
    } else {
      finalobj[key] = value;
    }
  }
  return finalobj;
};

//fetcher
export const fetchData = async (api) => {
  try {
    const httpReq = http();
    const { data } = await httpReq.get(api);
    return data;
  } catch (error) {
    return null;
  }
};

//upload file
export const uploadFile = async (file, folderName) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const httpReq = http();
    const response = await httpReq.post(
      `/api/upload?folderName=${folderName}`,
      formData
    );
    return response.data;
  } catch (error) {
    return error.response?.data || error;
  }
};

//format data
export const formatDate = (d) => {
  const date = new Date(d);
  let dd = date.getDate();
  let mm = date.getMonth() + 1;
  let yy = date.getFullYear();
  let tt = date.toLocaleTimeString();
  dd = dd < 10 ? "0" + dd : dd;
  mm = mm < 10 ? "0" + mm : mm;
  return `${dd}-${mm}-${yy} ${tt}`;
};
