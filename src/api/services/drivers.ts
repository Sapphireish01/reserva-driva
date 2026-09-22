import { apiClient } from "../client";
import { SignupStage } from "../../navigation/types";

export interface DriverMetrics {
  total_earnings: number;
  active_bookings: number;
  upcoming_trips: number;
  total_completed_trips: number;
}

export const driversService = {
  getSignupStage: (driverId: string) =>
    apiClient.get<{ status: SignupStage }>(`/drivers/${driverId}/signup-stage`),

  submitSsn: (driverId: string, ssn: string) =>
    // Sent once over TLS and never persisted client-side. The backend is
    // responsible for tokenizing/forwarding this to the KYC vendor — it
    // should never be written to AsyncStorage, logs, or app state longer
    // than the lifetime of this request.
    apiClient.post(`/drivers/${driverId}/ssn`, { ssn }),

  uploadSsn: (email: string, ssn: string) => {
    const formData = new FormData();
    formData.append("ssn", ssn);
    formData.append("ssn_number", ssn);
    return apiClient.post<{ message: string }>("/accounts/upload/ssn/", formData, {
      params: { email },
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  uploadSsnProfile: (ssnNumber: string) => {
    const formData = new FormData();
    formData.append("ssn_number", ssnNumber);
    return apiClient.put("/accounts/profile/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  getMetrics: () => apiClient.get<DriverMetrics>("/drivers/metrics/"),
};

