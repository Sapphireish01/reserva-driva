import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation/types";
import { identityService } from "../../api/services/identity";
import { colors, spacing, typography } from "../../theme/colors";

type Props = NativeStackScreenProps<AuthStackParamList, "LicenseVerifying">;

export const LicenseVerifyingScreen = ({ route, navigation }: Props) => {
  const { driverId, frontUri, backUri } = route.params;
  const [status, setStatus] = useState<"uploading" | "pending" | "verified" | "failed">(
    "uploading"
  );

  useEffect(() => {
    let poll: ReturnType<typeof setInterval>;

    const run = async () => {
      await identityService.uploadLicenseImages(driverId, frontUri, backUri);
      setStatus("pending");

      // Poll until the backend/vendor finishes verification. Swap for a
      // websocket/push notification if your backend supports one instead.
      poll = setInterval(async () => {
        const { data } = await identityService.getVerificationStatus(driverId);
        if (data.status !== "pending") {
          clearInterval(poll);
          setStatus(data.status);
        }
      }, 2500);
    };

    run();
    return () => clearInterval(poll);
  }, [driverId, frontUri, backUri]);

  return (
    <View style={styles.container}>
      {status === "verified" ? (
        <>
          <Text style={styles.title}>You're all set to continue your booking</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("SSN", { driverId })}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </>
      ) : status === "failed" ? (
        <>
          <Text style={styles.title}>We couldn't verify your license</Text>
          <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
            <Text style={styles.buttonText}>Try Again</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.title}>
            {status === "uploading" ? "Uploading..." : "Verifying your license"}
          </Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.navy, justifyContent: "center", padding: spacing.lg },
  title: { ...typography.h1, color: "#fff", textAlign: "center", marginBottom: spacing.lg },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "600" },
});
