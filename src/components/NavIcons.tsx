import React from "react";
import Svg, { Path } from "react-native-svg";
import { colors } from "../theme/colors";

interface IconProps {
  focused: boolean;
  size?: number;
}

const PRIMARY_COLOR = colors.primary; // #155DFC / #375DFB
const INACTIVE_COLOR = "#868C98";

export const HomeIcon: React.FC<IconProps> = ({ focused, size = 24 }) => {
  const strokeColor = focused ? PRIMARY_COLOR : INACTIVE_COLOR;
  const fillColor = focused ? PRIMARY_COLOR : "none";
  const innerLineColor = focused ? "#FFFFFF" : INACTIVE_COLOR;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9.02 2.84004L3.63 7.04004C2.73 7.74004 2 9.23004 2 10.36V17.77C2 20.09 3.89 21.99 6.21 21.99H17.79C20.11 21.99 22 20.09 22 17.78V10.5C22 9.29004 21.19 7.74004 20.2 7.05004L14.02 2.72004C12.62 1.74004 10.37 1.79004 9.02 2.84004Z"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 17.99V14.99"
        stroke={innerLineColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export const DiscoverIcon: React.FC<IconProps> = ({ focused, size = 24 }) => {
  const strokeColor = focused ? PRIMARY_COLOR : INACTIVE_COLOR;
  const fillColor = focused ? PRIMARY_COLOR : "none";
  const innerCircleColor = focused ? "#FFFFFF" : "none";
  const innerStrokeColor = focused ? "#FFFFFF" : INACTIVE_COLOR;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M17.8001 2.1L7.87009 4.59C6.42009 4.95 4.95009 6.42 4.59009 7.87L2.10009 17.8C1.35009 20.8 3.19009 22.65 6.20009 21.9L16.1301 19.42C17.5701 19.06 19.0501 17.58 19.4101 16.14L21.9001 6.2C22.6501 3.2 20.8001 1.35 17.8001 2.1Z"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 15.5C13.933 15.5 15.5 13.933 15.5 12C15.5 10.067 13.933 8.5 12 8.5C10.067 8.5 8.5 10.067 8.5 12C8.5 13.933 10.067 15.5 12 15.5Z"
        fill={innerCircleColor}
        stroke={innerStrokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export const TripsIcon: React.FC<IconProps> = ({ focused, size = 24 }) => {
  const strokeColor = focused ? PRIMARY_COLOR : INACTIVE_COLOR;
  const fillColor = focused ? PRIMARY_COLOR : "none";
  const accentStrokeColor = focused ? "#FFFFFF" : INACTIVE_COLOR;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M15.51 2.82996H8.49C6 2.82996 5.45 4.06996 5.13 5.58996L4 11H20L18.87 5.58996C18.55 4.06996 18 2.82996 15.51 2.82996Z"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M21.9897 19.82C22.0997 20.99 21.1597 22 19.9597 22H18.0797C16.9997 22 16.8497 21.54 16.6597 20.97L16.4597 20.37C16.1797 19.55 15.9997 19 14.5597 19H9.43974C7.99974 19 7.78974 19.62 7.53974 20.37L7.33974 20.97C7.14974 21.54 6.99974 22 5.91974 22H4.03974C2.83974 22 1.89974 20.99 2.00974 19.82L2.56974 13.73C2.70974 12.23 2.99974 11 5.61974 11H18.3797C20.9997 11 21.2897 12.23 21.4297 13.73L21.9897 19.82Z"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M4 8H3"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M21 8H20"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 3V5"
        stroke={accentStrokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M10.5 5H13.5"
        stroke={accentStrokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M6 15H9"
        stroke={accentStrokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M15 15H18"
        stroke={accentStrokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export const BookingsIcon: React.FC<IconProps> = ({ focused, size = 24 }) => {
  const strokeColor = focused ? PRIMARY_COLOR : INACTIVE_COLOR;
  const fillColor = focused ? PRIMARY_COLOR : "none";
  const accentStrokeColor = focused ? "#FFFFFF" : INACTIVE_COLOR;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M8 2V5"
        stroke={accentStrokeColor}
        strokeWidth="1.5"
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M16 2V5"
        stroke={accentStrokeColor}
        strokeWidth="1.5"
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M3.5 9.08984H20.5"
        stroke={accentStrokeColor}
        strokeWidth="1.5"
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M11.9955 13.7002H12.0045"
        stroke={accentStrokeColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8.29431 13.7002H8.30329"
        stroke={accentStrokeColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8.29431 16.7002H8.30329"
        stroke={accentStrokeColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export const WalletIcon: React.FC<IconProps> = ({ focused, size = 24 }) => {
  const strokeColor = focused ? PRIMARY_COLOR : INACTIVE_COLOR;
  const fillColor = focused ? PRIMARY_COLOR : "none";
  const accentStrokeColor = focused ? "#FFFFFF" : INACTIVE_COLOR;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M13 9H7"
        stroke={accentStrokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M17.48 10.55C17.06 10.96 16.82 11.55 16.88 12.18C16.97 13.26 17.96 14.05 19.04 14.05H21V15.5C21 18.5 19 20.5 16 20.5H7C4 20.5 2 18.5 2 15.5V8.5C2 5.78 3.64 3.88 6.19 3.56C6.45 3.52 6.72 3.5 7 3.5H16C16.26 3.5 16.51 3.50999 16.75 3.54999C19.33 3.84999 21 5.76 21 8.5V9.95001H18.92C18.36 9.95001 17.85 10.17 17.48 10.55Z"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M22 10.9702V13.0302C22 13.5802 21.56 14.0302 21 14.0502H19.04C17.96 14.0502 16.97 13.2602 16.88 12.1802C16.82 11.5502 17.06 10.9602 17.48 10.5502C17.85 10.1702 18.36 9.9502 18.92 9.9502H21C21.56 9.9702 22 10.4202 22 10.9702Z"
        fill={focused ? "#FFFFFF" : "none"}
        stroke={accentStrokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export const ProfileIcon: React.FC<IconProps> = ({ focused, size = 24 }) => {
  const strokeColor = focused ? PRIMARY_COLOR : INACTIVE_COLOR;
  const fillColor = focused ? PRIMARY_COLOR : "none";

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12.1596 10.87C12.0596 10.86 11.9396 10.86 11.8296 10.87C9.44957 10.79 7.55957 8.84 7.55957 6.44C7.55957 3.99 9.53957 2 11.9996 2C14.4496 2 16.4396 3.99 16.4396 6.44C16.4296 8.84 14.5396 10.79 12.1596 10.87Z"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M7.15973 14.56C4.73973 16.18 4.73973 18.82 7.15973 20.43C9.90973 22.27 14.4197 22.27 17.1697 20.43C19.5897 18.81 19.5897 16.17 17.1697 14.56C14.4297 12.73 9.91973 12.73 7.15973 14.56Z"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
