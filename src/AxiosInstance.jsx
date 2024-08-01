import axios from "axios";

const getToken = () => {
  const token = localStorage.getItem("token");
  return token;
};

const createApiInstance = (type) => {
  const baseUrl =
    type === "auth"
      ? process.env.REACT_APP_AUTH_URL
      : process.env.REACT_APP_BASE_URL;

  const api = axios.create({
    baseURL: baseUrl,
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "multipart/form-data",
    },
  });

  api.interceptors.request.use(
    (config) => {
      const token = getToken();
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      if (error.response && error.response.status === 401) {
        // Handle token expiry or invalid token
        alert("Session timed out. Please log in again.");
        localStorage.removeItem("token");
        window.location.href = "/pms"; // Redirect to login page
      }
      return Promise.reject(error);
    }
  );

  return api;
};

export default createApiInstance;
