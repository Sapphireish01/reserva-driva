import { apiClient } from "../client";

export interface LicenseUploadResult {
  verificationId: string;
}

export const identityService = {
  // Backend creates a verification session with the KYC vendor and returns
  // whatever the vendor's SDK needs (session token / client secret).
  createLicenseSession: (driverId: string) =>
    apiClient.post<{ sessionToken: string }>(`/drivers/${driverId}/identity/session`),

  // Fallback path if you're capturing images yourself (expo-camera) rather
  // than using a vendor's native capture SDK. Prefer the vendor SDK where
  // possible — this endpoint exists for the DIY capture flow described
  // in LicenseFrontCaptureScreen / LicenseBackCaptureScreen.
  uploadLicenseImages: (driverId: string, frontUri: string, backUri: string) => {
    const form = new FormData();
    form.append("front", { uri: frontUri, name: "license-front.jpg", type: "image/jpeg" } as any);
    form.append("back", { uri: backUri, name: "license-back.jpg", type: "image/jpeg" } as any);
    return apiClient.post<LicenseUploadResult>(`/drivers/${driverId}/identity/license`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },


  uploadDriversLicense: (
    email: string,
    frontUri: string,
    rearUri?: string
  ) => {
    const form = new FormData();
    form.append("drivers_license", {
      uri: frontUri,
      name: "driver_license.jpg",
      type: "image/jpeg",
    } as any);
    if (rearUri) {
      form.append("drivers_license_rear", {
        uri: rearUri,
        name: "driver_license_rear.jpg",
        type: "image/jpeg",
      } as any);
    }
    return apiClient.post<{ message: string }>("/accounts/upload/license/", form, {
      params: { email },
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

