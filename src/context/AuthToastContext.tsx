import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { formatAuthError } from "../utils/authErrorHandler";

export type AuthToastType = "error" | "success" | "info";

interface AuthToastOptions {
  type?: AuthToastType;
  duration?: number;
}

interface AuthToastContextType {
  showAuthToast: (message: string, options?: AuthToastOptions) => void;
  showAuthError: (error: unknown, fallback?: string) => void;
  hideAuthToast: () => void;
}

const AuthToastContext = createContext<AuthToastContextType | null>(null);

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const TOAST_TIMEOUT = 5000; // 5 seconds timeout

export const AuthToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const insets = useSafeAreaInsets();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<AuthToastType>("error");

  const translateY = useRef(new Animated.Value(-120)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hideAuthToast = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -120,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setToastMessage(null);
    });
  }, [opacity, translateY]);

  const showAuthToast = useCallback(
    (message: string, options?: AuthToastOptions) => {
      if (!message) return;

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      setToastMessage(message);
      setToastType(options?.type || "error");

      // Animate in
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          friction: 8,
          tension: 60,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();

      const duration = options?.duration ?? TOAST_TIMEOUT;
      timerRef.current = setTimeout(() => {
        hideAuthToast();
      }, duration);
    },
    [hideAuthToast, opacity, translateY]
  );

  const showAuthError = useCallback(
    (error: unknown, fallback?: string) => {
      const msg = formatAuthError(error, fallback);
      showAuthToast(msg, { type: "error", duration: TOAST_TIMEOUT });
    },
    [showAuthToast]
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const getBackgroundColor = () => {
    switch (toastType) {
      case "success":
        return "#0D542B";
      case "info":
        return "#1E293B";
      case "error":
      default:
        return "rgba(220, 38, 38, 0.96)"; // Rich error crimson red
    }
  };

  return (
    <AuthToastContext.Provider value={{ showAuthToast, showAuthError, hideAuthToast }}>
      {children}
      {toastMessage && (
        <Animated.View
          style={[
            styles.toastContainer,
            {
              top: insets.top > 0 ? insets.top + 8 : 16,
              backgroundColor: getBackgroundColor(),
              transform: [{ translateY }],
              opacity,
            },
          ]}
          pointerEvents="box-none"
        >
          <TouchableOpacity
            style={styles.toastCard}
            onPress={hideAuthToast}
            activeOpacity={0.9}
            accessible={true}
            accessibilityRole="alert"
            accessibilityLabel={toastMessage}
          >
            <View style={styles.contentRow}>
              <View style={styles.indicatorDot} />
              <Text style={styles.toastText} numberOfLines={3}>
                {toastMessage}
              </Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      )}
    </AuthToastContext.Provider>
  );
};

export const useAuthToast = (): AuthToastContextType => {
  const context = useContext(AuthToastContext);
  if (!context) {
    // Graceful fallback if invoked outside of provider during testing
    return {
      showAuthToast: (msg: string) => console.log("Toast:", msg),
      showAuthError: (err: unknown) => console.log("Error Toast:", formatAuthError(err)),
      hideAuthToast: () => {},
    };
  }
  return context;
};

const styles = StyleSheet.create({
  toastContainer: {
    position: "absolute",
    left: 20,
    right: 20,
    zIndex: 99999,
    borderRadius: 14,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  toastCard: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    width: "100%",
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  indicatorDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: "#FFFFFF",
    marginRight: 10,
    opacity: 0.9,
  },
  toastText: {
    flex: 1,
    fontFamily: "DM Sans",
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    lineHeight: 20,
    letterSpacing: -0.2,
  },
});
