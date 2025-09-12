import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const axiosInstance = axios.create({
  baseURL: `${API_URL}/api/`,
});

// اضافه کردن Access Token به همه‌ی درخواست‌ها
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");  // localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// اگر توکن منقضی شد → هدایت به لاگین
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      window.location.replace("/login");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
