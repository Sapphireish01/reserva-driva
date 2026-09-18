import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppButton } from "../../components/ui";
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

interface SlideItemProps {
  item: Slide;
  index: number;
  scrollX: Animated.Value;
}

const OnboardingSlideItem = React.memo<SlideItemProps>(
  ({ item, index, scrollX }) => {
    const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

    const imageScale = scrollX.interpolate({
      inputRange,
      outputRange: [0.92, 1, 0.92],
      extrapolate: "clamp",
    });

    const contentOpacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.35, 1, 0.35],
      extrapolate: "clamp",
    });

    const contentTranslateY = scrollX.interpolate({
      inputRange,
      outputRange: [12, 0, 12],
      extrapolate: "clamp",
    });

    return (
      <View style={styles.slide}>
        {/* Dynamic Image Container with smooth scale */}
        <Animated.View
          style={[
            styles.imageContainer,
            { transform: [{ scale: imageScale }] },
          ]}
        >
          <Image
            source={getImageSource(item.image)}
            style={styles.image}
            resizeMode="cover"
          />
        </Animated.View>

        {/* Bottom Content Container */}
        <View style={styles.content}>
          <View style={styles.dots}>
            {SLIDES.map((_, i) => {
              const dotWidth = scrollX.interpolate({
                inputRange: [(i - 1) * width, i * width, (i + 1) * width],
                outputRange: [6, 22, 6],
                extrapolate: "clamp",
              });

              const dotOpacity = scrollX.interpolate({
                inputRange: [(i - 1) * width, i * width, (i + 1) * width],
                outputRange: [0.25, 1, 0.25],
                extrapolate: "clamp",
              });

              return (
                <Animated.View
                  key={i}
                  style={[
                    styles.dot,
                    {
                      width: dotWidth,
                      opacity: dotOpacity,
                      backgroundColor: colors.text,
                    },
                  ]}
                />
              );
            })}
          </View>

          {/* Text Container with smooth fade and float */}
          <Animated.View
            style={[
              styles.textContainer,
              {
                opacity: contentOpacity,
                transform: [{ translateY: contentTranslateY }],
              },
            ]}
          >
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.body}>
              {item.bodyParts.map((part: BodyPart, idx: number) => (
                <Text
                  key={idx}
                  style={part.highlighted ? styles.textDark : styles.textMuted}
                >
                  {part.text}
                </Text>
              ))}
            </Text>
          </Animated.View>
        </View>
      </View>
    );
  }
);

OnboardingSlideItem.displayName = "OnboardingSlideItem";

type Props = NativeStackScreenProps<AuthStackParamList, "Onboarding">;

export const OnboardingScreen = ({ navigation }: Props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showWelcome, setShowWelcome] = useState(true);
  const listRef = useRef<FlatList<Slide>>(null);
  const insets = useSafeAreaInsets();

  const scrollX = useRef(new Animated.Value(0)).current;
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

  // Auto-slide every 3 seconds (resets timer on manual swipe)
  useEffect(() => {
    if (showWelcome) return;

    const timer = setTimeout(() => {
      const nextIndex = (activeIndex + 1) % SLIDES.length;
      listRef.current?.scrollToOffset({
        offset: nextIndex * width,
        animated: true,
      });
      setActiveIndex(nextIndex);
    }, 3000);

    return () => clearTimeout(timer);
  }, [activeIndex, showWelcome]);

  const handleGetStarted = useCallback(() => {
    navigation.navigate("SignUp");
  }, [navigation]);

  const handleMomentumScrollEnd = useCallback(
    (e: any) => {
      const nextIndex = Math.round(e.nativeEvent.contentOffset.x / width);
      if (nextIndex >= 0 && nextIndex < SLIDES.length) {
        setActiveIndex(nextIndex);
      }
    },
    []
  );

  const keyExtractor = useCallback((item: Slide) => item.key, []);

  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: width,
      offset: width * index,
      index,
    }),
    []
  );

  const renderItem = useCallback(
    ({ item, index }: { item: Slide; index: number }) => (
      <OnboardingSlideItem
        item={item}
        index={index}
        scrollX={scrollX}
      />
    ),
    [scrollX]
  );

  return (
    <View style={styles.container}>
      {/* Fixed Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
        <Text style={styles.subLogo}>Rezarva</Text>
      </View>

      {/* Sliding Images and Content */}
      <Animated.FlatList
        ref={listRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        decelerationRate="fast"
        bounces={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        renderItem={renderItem}
        initialNumToRender={1}
        maxToRenderPerBatch={2}
        windowSize={3}
        style={styles.list}
      />

      {/* Fixed Bottom Container with Get Started Button */}
      <View
        style={[
          styles.bottomContainer,
          { paddingBottom: Math.max(insets.bottom, 20) },
        ]}
      >
        <AppButton
          title="Get Started"
          onPress={handleGetStarted}
          size="lg"
          style={styles.buttonOverride}
          textStyle={styles.buttonTextOverride}
        />
      </View>

      {showWelcome && (
        <Animated.View
          style={[styles.welcomeOverlay, { opacity: overlayOpacity }]}
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
              Rezarva
            </Animated.Text>

            {/* Target DM Sans SubLogo (header style) */}
            <Animated.Text
              style={[styles.subLogo, { opacity: dmSansOpacity }]}
            >
              Rezarva
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
  list: {
    flex: 1,
  },
  slide: {
    width,
    flex: 1,
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
    maxHeight: height * 0.46,
    borderRadius: 20,
  },
  content: {
    width: "100%",
    gap: 16,
    marginBottom: spacing.md,
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
    height: 6,
    borderRadius: 3,
  },
  textContainer: {
    width: "100%",
    gap: 8,
  },
  title: {
    fontFamily: "DM Sans",
    fontWeight: "600",
    fontSize: 20,
    lineHeight: 25,
    letterSpacing: -0.75,
    color: colors.text,
    textAlign: "left",
  },
  body: {
    fontFamily: "DM Sans",
    fontSize: 14,
    lineHeight: 23.8,
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
  bottomContainer: {
    width: "100%",
    paddingHorizontal: spacing.lg,
  },
  buttonOverride: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    height: 52,
  },
  buttonTextOverride: {
    fontFamily: "DM Sans",
    fontWeight: "600",
    fontSize: 16,
    color: "#FFFFFF",
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


