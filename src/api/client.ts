import axios, { AxiosInstance } from "axios";
import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "rezarva_driver_token";

export const getStoredToken = () => SecureStore.getItemAsync(TOKEN_KEY);
export const setStoredToken = (token: string) => SecureStore.setItemAsync(TOKEN_KEY, token);
export const clearStoredToken = () => SecureStore.deleteItemAsync(TOKEN_KEY);

export const createApiClient = (baseURL: string): AxiosInstance => {
  const instance = axios.create({ baseURL, timeout: 15000 });

  instance.interceptors.request.use(async (config) => {
    const token = await getStoredToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  instance.interceptors.response.use(
    (res) => res,
    (err) => {
      // Centralised error shape — surface a consistent message to the UI layer.
      const message = err?.response?.data?.message ?? "Something went wrong. Please try again.";
      return Promise.reject(new Error(message));
    }
  );

  return instance;
};

export const apiClient = createApiClient(
  process.env.EXPO_PUBLIC_API_URL ?? "https://api.rezarva.app/driver"
);
