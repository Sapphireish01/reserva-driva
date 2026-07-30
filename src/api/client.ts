import axios, { AxiosInstance } from "axios";
import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "rezarva_driver_token";

export const getStoredToken = () => SecureStore.getItemAsync(TOKEN_KEY);
export const setStoredToken = (token: string) => SecureStore.setItemAsync(TOKEN_KEY, token);
export const clearStoredToken = () => SecureStore.deleteItemAsync(TOKEN_KEY);

const DEFAULT_BASE_URL = "https://drifully-backup.onrender.com";
const DEFAULT_API_KEY = "JWUPaK7l.OVlm7sowHGmc8SlhpboPI8vLrWgCGKbS";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? DEFAULT_BASE_URL;
const RESERVA_API_KEY = process.env.EXPO_PUBLIC_RESERVA_API_KEY ?? DEFAULT_API_KEY;

export const createApiClient = (baseURL: string): AxiosInstance => {
  const instance = axios.create({
    baseURL,
    timeout: 15000,
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": RESERVA_API_KEY,
      "x-api-key": RESERVA_API_KEY,
    },
  });

  instance.interceptors.request.use(async (config) => {
    const token = await getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (RESERVA_API_KEY) {
      config.headers["X-API-Key"] = RESERVA_API_KEY;
      config.headers["x-api-key"] = RESERVA_API_KEY;
    }
    return config;
  });

  instance.interceptors.response.use(
    (res) => res,
    (err) => {
      // Centralised error shape — surface a consistent message to the UI layer.
      const message = err?.response?.data?.message ?? err?.message ?? "Something went wrong. Please try again.";
      return Promise.reject(new Error(message));
    }
  );

  return instance;
};

export const apiClient = createApiClient(API_BASE_URL);
