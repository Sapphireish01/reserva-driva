import React, { useEffect, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation/types";
import { identityService } from "../../api/services/identity";
import { useAuthStore } from "../../state/authStore";
import { LicenseCaptureView } from "./LicenseCaptureView";

type Props = NativeStackScreenProps<AuthStackParamList, "LicenseVerifying">;

export const LicenseVerifyingScreen = ({ route, navigation }: Props) => {
  const { driverId, frontUri, backUri, email } = route.params;
  const user = useAuthStore((s) => s.user);
  const resolvedEmail = email || user?.email || "";

  const [status, setStatus] = useState<"uploading" | "pending" | "verified" | "failed">(
    "uploading"
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    let isMounted = true;

    const run = async () => {
      try {
        console.log("🌐 [API Call] Uploading driver's license for:", resolvedEmail);
        await identityService.uploadDriversLicense(resolvedEmail, frontUri, backUri);
        if (!isMounted) return;

        setStatus("pending");

        // Give a smooth 1.5s visual feedback for document check completion
        timer = setTimeout(() => {
          if (isMounted) {
            setStatus("verified");
          }
        }, 1500);
      } catch (err: any) {
        console.error("❌ [API Error] Upload license error:", err?.response?.data || err?.message);
        if (!isMounted) return;

        const serverMsg =
          err?.response?.data?.message ||
          err?.response?.data?.detail ||
          (typeof err?.response?.data === "string" ? err.response.data : null) ||
          err?.message ||
          "Failed to upload driver's license. Please try again with clear photos.";

        setErrorMessage(serverMsg);
        setStatus("failed");
      }
    };

    run();
    return () => {
      isMounted = false;
      if (timer) clearTimeout(timer);
    };
  }, [frontUri, backUri, resolvedEmail]);

  return (
    <LicenseCaptureView
      initialPhotoUri={frontUri || backUri}
      verifyingStatus={status}
      errorMessage={errorMessage}
      onContinue={() => navigation.navigate("SSN", { driverId, email: resolvedEmail })}
      onRetry={() => navigation.goBack()}
      onCancel={() => navigation.goBack()}
    />
  );
};

