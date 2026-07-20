import { apiClient } from "../client";
import { SignupStage } from "../../navigation/types";

export const driversService = {
  getSignupStage: (driverId: string) =>
    apiClient.get<{ status: SignupStage }>(`/drivers/${driverId}/signup-stage`),

  submitSsn: (driverId: string, ssn: string) =>
    // Sent once over TLS and never persisted client-side. The backend is
    // responsible for tokenizing/forwarding this to the KYC vendor — it
    // should never be written to AsyncStorage, logs, or app state longer
    // than the lifetime of this request.
    apiClient.post(`/drivers/${driverId}/ssn`, { ssn }),
};
