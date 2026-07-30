import React, { useEffect, useRef } from "react";
import { Animated, Easing, ViewStyle } from "react-native";
import Svg, { Defs, LinearGradient, Path, Stop } from "react-native-svg";

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

export interface AppLoaderProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export const AppLoader: React.FC<AppLoaderProps> = ({
  size = 20,
  color = "#FFFFFF",
  style,
}) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 750,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [rotateAnim]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const gradientId = `paint0_linear_loader_${color.replace("#", "")}`;

  return (
    <AnimatedSvg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      style={[{ transform: [{ rotate: spin }] }, style]}
    >
      <Path
        d="M20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10ZM2.17874 10C2.17874 14.3196 5.68043 17.8213 10 17.8213C14.3196 17.8213 17.8213 14.3196 17.8213 10C17.8213 5.68043 14.3196 2.17874 10 2.17874C5.68043 2.17874 2.17874 5.68043 2.17874 10Z"
        fill={color}
        fillOpacity={0.1}
      />
      <Path
        d="M18.9106 10C19.5123 10 20.0061 10.4891 19.9407 11.0872C19.8379 12.0272 19.6021 12.9498 19.2388 13.8268C18.7362 15.0401 17.9997 16.1425 17.0711 17.0711C16.1425 17.9997 15.0401 18.7362 13.8268 19.2388C12.9498 19.6021 12.0272 19.8379 11.0872 19.9407C10.4891 20.0061 10 19.5123 10 18.9106C10 18.309 10.49 17.829 11.0859 17.7455C11.7396 17.6539 12.3805 17.4796 12.9931 17.2259C13.942 16.8328 14.8042 16.2567 15.5305 15.5305C16.2567 14.8042 16.8329 13.942 17.2259 12.9931C17.4796 12.3805 17.6539 11.7396 17.7455 11.0859C17.8291 10.49 18.309 10 18.9106 10Z"
        fill={`url(#${gradientId})`}
      />
      <Defs>
        <LinearGradient
          id={gradientId}
          x1="17.0833"
          y1="10.4167"
          x2="10.8333"
          y2="20.8333"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor={color} stopOpacity={0} />
          <Stop offset={1} stopColor={color} stopOpacity={1} />
        </LinearGradient>
      </Defs>
    </AnimatedSvg>
  );
};

export interface CheckIconProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export const CheckIcon: React.FC<CheckIconProps> = ({
  size = 15,
  color = "#05DF72",
  style,
}) => (
  <Svg width={size} height={size} viewBox="0 0 15 15" fill="none" style={style}>
    <Path
      d="M7.5 0C3.3675 0 0 3.3675 0 7.5C0 11.6325 3.3675 15 7.5 15C11.6325 15 15 11.6325 15 7.5C15 3.3675 11.6325 0 7.5 0ZM11.085 5.775L6.8325 10.0275C6.7275 10.1325 6.585 10.1925 6.435 10.1925C6.285 10.1925 6.1425 10.1325 6.0375 10.0275L3.915 7.905C3.6975 7.6875 3.6975 7.3275 3.915 7.11C4.1325 6.8925 4.4925 6.8925 4.71 7.11L6.435 8.835L10.29 4.98C10.5075 4.7625 10.8675 4.7625 11.085 4.98C11.3025 5.1975 11.3025 5.55 11.085 5.775Z"
      fill={color}
    />
  </Svg>
);
