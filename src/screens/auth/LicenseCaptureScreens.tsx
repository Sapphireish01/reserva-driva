import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation/types";
import { LicenseCaptureView } from "./LicenseCaptureView";

type FrontProps = NativeStackScreenProps<AuthStackParamList, "LicenseFrontCapture">;
type BackProps = NativeStackScreenProps<AuthStackParamList, "LicenseBackCapture">;

export const LicenseFrontCaptureScreen = ({ route, navigation }: FrontProps) => {
  const { driverId } = route.params;
  return (
    <LicenseCaptureView
      step="Step 1 of 2"
      instruction="Capture the front of your license"
      onCancel={() => navigation.goBack()}
      onCapture={(frontUri) =>
        navigation.navigate("LicenseBackCapture", { driverId, frontUri })
      }
    />
  );
};

export const LicenseBackCaptureScreen = ({ route, navigation }: BackProps) => {
  const { driverId, frontUri } = route.params;
  return (
    <LicenseCaptureView
      step="Step 2 of 2"
      instruction="Capture the back of your license"
      onCancel={() => navigation.goBack()}
      onCapture={(backUri) =>
        navigation.navigate("LicenseVerifying", { driverId, frontUri, backUri })
      }
    />
  );
};
