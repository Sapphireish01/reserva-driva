import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AuthStackParamList } from "../../navigation/types";
import { colors, spacing } from "../../theme/colors";

const { width, height } = Dimensions.get("window");

interface BodyPart {
  text: string;
  highlighted: boolean;
}

interface Slide {
  key: string;
  title: string;
  bodyParts: BodyPart[];
  image: any;
}

const SLIDES: Slide[] = [
  {
    key: "earn",
    title: "Earn While You Travel",
    bodyParts: [
      { text: "Fill your empty seats, ", highlighted: false },
      { text: "reduce travel costs, and build trusted connections ", highlighted: true },
      { text: "with passengers along your route.", highlighted: false },
    ],
    image: require("../../../assets/onboarding/screen-1.jpg"),
  },
  {
    key: "schedule",
    title: "Drive on Your Schedule",
    bodyParts: [
      { text: "Create one-time or recurring trips and ", highlighted: false },
      { text: "choose when, where, and how often ", highlighted: true },
      { text: "you want to drive.", highlighted: false },
    ],
    image: require("../../../assets/onboarding/screen-2.jpg"),
  },
  {
    key: "share",
    title: "Share Your Journey",
    bodyParts: [
      { text: "Turn your ", highlighted: false },
      { text: "everyday trips into opportunities ", highlighted: true },
      { text: "by offering empty seats to passengers ", highlighted: false },
      { text: "travelling your way.", highlighted: true },
    ],
    image: require("../../../assets/onboarding/screen-3.jpg"),
  },
];

const getImageSource = (img: any) => {
  if (!img) return null;
  if (typeof img === "number") return img;
  if (typeof img === "string") return { uri: img };
  if (img.url) {
    if (img.url.toLowerCase().includes("screen-1")) return require("../../../assets/onboarding/screen-1.jpg");
    if (img.url.toLowerCase().includes("screen-2")) return require("../../../assets/onboarding/screen-2.jpg");
    if (img.url.toLowerCase().includes("screen-3")) return require("../../../assets/onboarding/screen-3.jpg");
    return { uri: img.url };
  }
  if (img.uri) return { uri: img.uri };
  return img;
};

type Props = NativeStackScreenProps<AuthStackParamList, "Onboarding">;

export const OnboardingScreen = ({ navigation }: Props) => {
  const [index, setIndex] = useState(0);
  const [showWelcome, setShowWelcome] = useState(true);
  const listRef = useRef<FlatList<Slide>>(null);
  const insets = useSafeAreaInsets();

  const welcomeAnim = useRef(new Animated.Value(0)).current;

  // Calculate target translation from screen center to top header position
  const headerCenterY = Math.max(insets.top, 16) + 17;
  const targetTranslateY = -(height / 2 - headerCenterY);

  const textTranslateY = welcomeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, targetTranslateY],
  });

  const diplomataOpacity = welcomeAnim.interpolate({
    inputRange: [0, 0.3, 0.7],
    outputRange: [1, 1, 0],
  });

  const dmSansOpacity = welcomeAnim.interpolate({
    inputRange: [0, 0.3, 0.7],
    outputRange: [0, 0, 1],
  });

  const overlayOpacity = welcomeAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1, 0],
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(welcomeAnim, {
        toValue: 1,
        duration: 750,
        useNativeDriver: true,
      }).start(() => {
        setShowWelcome(false);
      });
    }, 1800);

    return () => clearTimeout(timer);
  }, [welcomeAnim]);

  return (
    <View style={styles.container}>
      <FlatList
        ref={listRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.key}
        onMomentumScrollEnd={(e) => {
          setIndex(Math.round(e.nativeEvent.contentOffset.x / width));
        }}
        renderItem={({ item }) => (
          <View
            style={[
              styles.slide,
              {
                paddingTop: Math.max(insets.top, 16),
                paddingBottom: Math.max(insets.bottom, 20),
              },
            ]}
          >
            {/* Header / SubLogo */}
            <View style={styles.header}>
              <Text style={styles.subLogo}>Reserva</Text>
            </View>

            {/* Dynamic Image Container for Long Screens */}
            <View style={styles.imageContainer}>
              <Image source={getImageSource(item.image)} style={styles.image} resizeMode="cover" />
            </View>

            {/* Bottom Content Container */}
            <View style={styles.content}>
              <View style={styles.dots}>
                {SLIDES.map((s, i) => (
                  <View
                    key={s.key}
                    style={[styles.dot, i === index && styles.dotActive]}
                  />
                ))}
              </View>

              <View style={styles.textContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.body}>
                  {item.bodyParts ? (
                    item.bodyParts.map((part: BodyPart, idx: number) => (
                      <Text
                        key={idx}
                        style={part.highlighted ? styles.textDark : styles.textMuted}
                      >
                        {part.text}
                      </Text>
                    ))
                  ) : (
                    (item as any).body
                  )}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.button}
                activeOpacity={0.85}
                onPress={() => navigation.navigate("SignUp")}
              >
                <Text style={styles.buttonText}>Get Started</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {showWelcome && (
        <Animated.View
          style={[
            styles.welcomeOverlay,
            { opacity: overlayOpacity },
          ]}
          pointerEvents="none"
        >
          <Animated.View
            style={{
              transform: [{ translateY: textTranslateY }],
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Initial Diplomata Logo (splash style) */}
            <Animated.Text
              style={[
                styles.logo,
                {
                  opacity: diplomataOpacity,
                  position: "absolute",
                },
              ]}
            >
              Reserva
            </Animated.Text>

            {/* Target DM Sans SubLogo (header style) */}
            <Animated.Text
              style={[
                styles.subLogo,
                {
                  opacity: dmSansOpacity,
                },
              ]}
            >
              Reserva
            </Animated.Text>
          </Animated.View>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  slide: {
    width,
    height: "100%",
    paddingHorizontal: spacing.lg,
    justifyContent: "space-between",
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xs,
  },
  subLogo: {
    fontFamily: "DM Sans",
    fontWeight: "700",
    fontSize: 20,
    lineHeight: 26,
    letterSpacing: -0.5,
    textAlign: "center",
    color: colors.text,
  },
  imageContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: spacing.md,
  },
  image: {
    width: "100%",
    height: "100%",
    maxHeight: height * 0.48,
    borderRadius: 20,
  },
  content: {
    width: "100%",
    gap: 18,
  },
  dots: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    height: 8,
    marginBottom: spacing.xs,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.border,
  },
  dotActive: {
    width: 22,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.text,
  },
  textContainer: {
    width: "100%",
    gap: 8,
  },
  title: {
    fontFamily: "DM Sans",
    fontWeight: "700",
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: -0.5,
    color: colors.text,
    textAlign: "left",
  },
  body: {
    fontFamily: "DM Sans",
    fontSize: 15,
    lineHeight: 22,
    textAlign: "left",
  },
  textDark: {
    color: colors.text,
    fontWeight: "600",
  },
  textMuted: {
    color: colors.textMuted,
    fontWeight: "400",
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginTop: spacing.xs,
  },
  buttonText: {
    color: "#FFFFFF",
    fontFamily: "DM Sans",
    fontWeight: "600",
    fontSize: 16,
  },
  welcomeOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  logo: {
    fontFamily: "Diplomata",
    fontWeight: "400",
    fontSize: 24,
    lineHeight: 30,
    letterSpacing: -0.75,
    verticalAlign: "middle",
    color: colors.text,
  },
});

