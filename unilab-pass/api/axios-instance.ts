import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useAuthStore } from "../stores";
import eventBus from "../utils/eventBus";

const handleSetToken = (token: string) => {
  const { setAppToken } = useAuthStore();
  setAppToken({ token: token });
};
const handleGetToken = () => {
  const { appToken } = useAuthStore();
  return appToken;
};

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
        console.info("Successful refresh:", refreshResponse.data);
        const newAccessToken = refreshResponse.data.result.token;
        setAppToken({ token: newAccessToken });

        // Gửi lại request với access token mới
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
