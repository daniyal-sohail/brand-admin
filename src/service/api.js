import axios from "axios";

// Determine API base URL with a production-safe fallback
const resolvedBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://brand-appeal-backend.vercel.app/api";

// Create an axios instance
const axiosInstance = axios.create({
  baseURL: resolvedBaseUrl,
  withCredentials: false, // Send cookies with requests if needed
});

// Request interceptor: Attach token if present
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      // Optionally handle 401/403 errors globally
      // localStorage.removeItem("token");
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
