import axios from "axios";

// const imageBaseUrl = "http://localhost:6677";
// const imageBaseUrl = 'http://122.176.141.23:6677';  //live server
const imageBaseUrl = "https://app.dfwerrands.com"; //domain live server

const apiInstance = axios.create({
  // baseURL: "http://localhost:6677/admin",
  // baseURL: 'http://122.176.141.23:6677/admin', //live server
  baseURL: "https://app.dfwerrands.com/admin", //domain live server
});

apiInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

apiInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const errMsg = error.response?.data?.message;
      if (error.response?.status === 401) {
        if (errMsg === "token expired") {
          localStorage.setItem("sessionexpired", "true");
          localStorage.removeItem("token");
          window.location.href = "/";
        } else if (errMsg == "account is blocked") {
          localStorage.setItem("account_blocked", "true");
          localStorage.removeItem("token");
          window.location.href = "/";
        } else if (
          errMsg == "Unauthorized" ||
          errMsg == "user not found" ||
          errMsg == "Logged in from another device"
        ) {
          localStorage.removeItem("token");
          window.location.href = "/";
        }
      }
    }
    return Promise.reject(error);
  },
);

export default apiInstance;
export { imageBaseUrl };
