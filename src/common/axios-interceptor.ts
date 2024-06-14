import axios from "axios";
import { LocalStorage } from "../../utils/localstorage";
import { CONSTANTS, systemMessage } from "./constants";
import router from "next/router";
import Toast from "./Toast";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
      'Access-Control-Allow-Origin': '*',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = LocalStorage.getItem(CONSTANTS.LOCAL_STORAGE_KEYS.TOKEN);
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    } else {
      delete config.headers['Authorization'];
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  function (error) {
    if (error.response && error.response.status === 422) {
      Toast(' Unprocessable Entity ', { type: "error" });
    }else  if (error.response && error.response.status === 401) {
      LocalStorage.clearLocalStorage();
      router.push("/");
    } else if (error.response && error.response.status === 403) {
      // LocalStorage.clearLocalStorage();
      // router.push("/");
    }else if (error.response && error.response.status === 500) {
      // Toast(systemMessage.Something_Wrong, { type: "error" });
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

