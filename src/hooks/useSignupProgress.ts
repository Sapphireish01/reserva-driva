import { useQuery } from "@tanstack/react-query";
import { driversService } from "../api/services/drivers";
import { AuthStackParamList, SignupStage } from "../navigation/types";

// Maps the backend's signup_stage to the screen that should be shown next.
// Keep this in sync with AuthStackParamList whenever a step is added/removed.
export const stageToScreen: Record<SignupStage, keyof AuthStackParamList> = {
  created: "VerificationMethod",
  otp_verified: "LicenseIntro",
  license_pending: "LicenseVerifying",
  license_verified: "SSN",
  ssn_verified: "AccountCreated",
  active: "AccountCreated",
};

export const useSignupProgress = (driverId: string | null) =>
  useQuery({
    queryKey: ["signupStage", driverId],
    queryFn: () => driversService.getSignupStage(driverId as string).then((r) => r.data),
    enabled: !!driverId,
  });
