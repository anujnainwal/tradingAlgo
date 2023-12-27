import axios from "axios";
import { Navigate } from "react-router-dom";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:9000/",
  timeout: 10000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accesstoken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const config = error.config;

    if (error.response) {
      if (error.response.status === 401 && !config._retry) {
        config._retry = true;
        const refreshToken = localStorage.getItem("refreshtoken");
        const userId = localStorage.getItem("userid");
        try {
          if (refreshToken && userId) {
            const response = await axiosInstance.post("/api/v1/refreshToken", {
              refreshToken,
              userId,
            });

            localStorage.setItem("accesstoken", response.data.accessToken);
            axiosInstance.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${response.data.accessToken}`;
            return axiosInstance(config);
          } else {
            // window.location.href = "/admin/login";
          }

          return axiosInstance(config);
        } catch (_error) {
          if (_error.response.status === 403) {
            localStorage.clear();
          }
        }
      }
    }

    return Promise.reject(error);
  }
);