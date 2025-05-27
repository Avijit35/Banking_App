import axios from "axios";

//http request
export const http = (accessToken = null) => {
  axios.defaults.baseURL = import.meta.env.VITE_BASEURL;
  if (accessToken) axios.defaults.headers.common["Authorization"] = accessToken;

  return axios;
};

//trim data
export const trimData = (obj) => {
  let finalobj = {};
  for (let key in obj) {
    finalobj[key] = obj[key]?.trim();
  }
  return finalobj;
};
