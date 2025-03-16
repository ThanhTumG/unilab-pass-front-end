import axios from "axios";
import { useAuthStore } from "../stores";

const API = axios.create({
  baseURL: "https://unilabpass-backend.onrender.com/identity",
});

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const excludeRefreshRoutes = [
      "/auth/login",
      "/users/signup",
      "/users/myInfo",
      "/auth/change-pass",
    ];

    if (excludeRefreshRoutes.includes(originalRequest.url)) {
      return Promise.reject(error);
    }

    if (error.response.data.code === 1006 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { appToken, setAppToken } = useAuthStore.getState();

        const refreshResponse = await API.post("/auth/refresh", {
          token: appToken,
        });
        console.info("Successfully refresh:", refreshResponse.data);
        const newAccessToken = refreshResponse.data.result.token;
        setAppToken({ token: newAccessToken });

        // Resend request with refresh token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return API(originalRequest);
      } catch (err) {
        console.error("Error refresh:", err.response.data);
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default API;
