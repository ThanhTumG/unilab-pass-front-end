import axios from "axios";
import { useAuthStore } from "../stores";
import eventBus from "../utils/eventBus";

const API = axios.create({
  baseURL: "https://unilabpass-backend.onrender.com/api",
});

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const excludeRefreshRoutes = [
      "/auth/login",
      "/users/signup",
      "/users/myInfo",
    ];

    const errorCode =
      (error.response && error.response.data.code) || error.request.status;
    console.log("Axios catch error:", errorCode);

    if (excludeRefreshRoutes.includes(originalRequest.url)) {
      return Promise.reject(error);
    }

    if (errorCode === 1030) {
      const { setAppIsTokenErr } = useAuthStore.getState();
      setAppIsTokenErr(true);
      return;
    }

    if ((errorCode === 1006 || errorCode === 401) && !originalRequest._retry) {
      if (originalRequest.url == "/auth/refresh") {
        eventBus.emit("logout");
        return;
      }
      originalRequest._retry = true;
      console.log("refresh token");
      try {
        const { appToken, setAppToken } = useAuthStore.getState();
        console.log(appToken);
        const refreshResponse = await API.post("/auth/refresh", {
          token: appToken,
        });
        console.info(
          "Successfully refresh:",
          refreshResponse.data.result.token
        );
        const newAccessToken = refreshResponse.data.result.token;
        setAppToken({ token: newAccessToken });

        // Resend request with refresh token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return API(originalRequest);
      } catch (err) {
        console.log("Error refresh:", err.response.data);
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default API;
