import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;

const api = axios.create({ baseURL });

// Separate client prevents refresh requests
// from triggering the same interceptor.
const refreshClient = axios.create({ baseURL });

let refreshPromise = null;

// Add access token to API requests.
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("access");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Automatically refresh expired access tokens.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    const refreshToken = localStorage.getItem("refresh");

    if (!refreshToken) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = refreshClient
          .post("/auth/token/refresh/", {
            refresh: refreshToken,
          })
          .then(({ data }) => {
            localStorage.setItem("access", data.access);

            if (data.refresh) {
              localStorage.setItem("refresh", data.refresh);
            }

            return data.access;
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      const newAccessToken = await refreshPromise;

      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");

      window.dispatchEvent(new Event("auth:logout"));

      if (
        window.location.pathname !== "/login" &&
        window.location.pathname !== "/register"
      ) {
        window.location.replace("/login");
      }

      return Promise.reject(refreshError);
    }
  }
);

export default api;