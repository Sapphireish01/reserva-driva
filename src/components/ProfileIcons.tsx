import React from "react";
import { TouchableOpacity } from "react-native";
import Svg, { Line, Path, Text as SvgText } from "react-native-svg";

interface IconProps {
  color?: string;
  size?: number;
}

export const ProfileIconItem: React.FC<IconProps> = ({ color = "#868C98", size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <Path
      d="M10.1322 9.05817C10.0488 9.04984 9.94883 9.04984 9.85716 9.05817C7.87383 8.9915 6.29883 7.3665 6.29883 5.3665C6.29883 3.32484 7.94883 1.6665 9.99883 1.6665C12.0405 1.6665 13.6988 3.32484 13.6988 5.3665C13.6905 7.3665 12.1155 8.9915 10.1322 9.05817Z"
      stroke={color}
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M5.96563 12.1335C3.94896 13.4835 3.94896 15.6835 5.96563 17.0252C8.25729 18.5585 12.0156 18.5585 14.3073 17.0252C16.324 15.6752 16.324 13.4752 14.3073 12.1335C12.024 10.6085 8.26562 10.6085 5.96563 12.1335Z"
      stroke={color}
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const NotificationIconItem: React.FC<IconProps> = ({ color = "#868C98", size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <Path
      d="M10.0155 2.42529C7.25719 2.42529 5.01552 4.66696 5.01552 7.42529V9.83363C5.01552 10.342 4.79885 11.117 4.54052 11.5503L3.58219 13.142C2.99052 14.1253 3.39885 15.217 4.48219 15.5836C8.07385 16.7836 11.9489 16.7836 15.5405 15.5836C16.5489 15.2503 16.9905 14.0586 16.4405 13.142L15.4822 11.5503C15.2322 11.117 15.0155 10.342 15.0155 9.83363V7.42529C15.0155 4.67529 12.7655 2.42529 10.0155 2.42529Z"
      stroke={color}
      strokeWidth="1.25"
      strokeMiterlimit="10"
      strokeLinecap="round"
    />
    <Path
      d="M11.5579 2.6667C11.2996 2.5917 11.0329 2.53337 10.7579 2.50003C9.95794 2.40003 9.19128 2.45837 8.47461 2.6667C8.71628 2.05003 9.31628 1.6167 10.0163 1.6167C10.7163 1.6167 11.3163 2.05003 11.5579 2.6667Z"
      stroke={color}
      strokeWidth="1.25"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12.5156 15.8833C12.5156 17.2583 11.3906 18.3833 10.0156 18.3833C9.33229 18.3833 8.69896 18.1 8.24896 17.65C7.79896 17.2 7.51562 16.5666 7.51562 15.8833"
      stroke={color}
      strokeWidth="1.25"
      strokeMiterlimit="10"
    />
  </Svg>
);

export const EmergencyContactIconItem: React.FC<IconProps> = ({ color = "#868C98", size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <Path d="M1.66602 18.3335H18.3327" stroke={color} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    <Path
      d="M10 5C5.85833 5 2.5 8.35833 2.5 12.5V18.3333H17.5V12.5C17.5 8.35833 14.1417 5 10 5Z"
      stroke={color}
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="M10 1.6665V2.49984" stroke={color} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M3.33398 3.3335L4.16732 4.16683" stroke={color} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M16.6673 3.3335L15.834 4.16683" stroke={color} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const VehiclesIconItem: React.FC<IconProps> = ({ color = "#868C98", size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <Path
      d="M12.9257 2.3584H7.07565C5.00065 2.3584 4.54232 3.39173 4.27565 4.6584L3.33398 9.16673H16.6673L15.7257 4.6584C15.459 3.39173 15.0007 2.3584 12.9257 2.3584Z"
      stroke={color}
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M18.3253 16.5165C18.4169 17.4915 17.6336 18.3332 16.6336 18.3332H15.0669C14.1669 18.3332 14.0419 17.9498 13.8836 17.4748L13.7169 16.9748C13.4836 16.2915 13.3336 15.8332 12.1336 15.8332H7.86693C6.66693 15.8332 6.49194 16.3498 6.2836 16.9748L6.11694 17.4748C5.9586 17.9498 5.8336 18.3332 4.9336 18.3332H3.36694C2.36694 18.3332 1.5836 17.4915 1.67527 16.5165L2.14194 11.4415C2.2586 10.1915 2.50027 9.1665 4.6836 9.1665H15.3169C17.5003 9.1665 17.7419 10.1915 17.8586 11.4415L18.3253 16.5165Z"
      stroke={color}
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="M3.33333 6.6665H2.5" stroke={color} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M17.4993 6.6665H16.666" stroke={color} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M10 2.5V4.16667" stroke={color} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M8.75 4.1665H11.25" stroke={color} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M5 12.5H7.5" stroke={color} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M12.5 12.5H15" stroke={color} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const CommunitiesIconItem: React.FC<IconProps> = ({ color = "#868C98", size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M18.0001 7.16C17.9401 7.15 17.8701 7.15 17.8101 7.16C16.4301 7.11 15.3301 5.98 15.3301 4.58C15.3301 3.15 16.4801 2 17.9101 2C19.3401 2 20.4901 3.16 20.4901 4.58C20.4801 5.98 19.3801 7.11 18.0001 7.16Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M16.9714 14.4402C18.3414 14.6702 19.8514 14.4302 20.9114 13.7202C22.3214 12.7802 22.3214 11.2402 20.9114 10.3002C19.8414 9.59016 18.3114 9.35016 16.9414 9.59016"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M5.97047 7.16C6.03047 7.15 6.10047 7.15 6.16047 7.16C7.54047 7.11 8.64047 5.98 8.64047 4.58C8.64047 3.15 7.49047 2 6.06047 2C4.63047 2 3.48047 3.16 3.48047 4.58C3.49047 5.98 4.59047 7.11 5.97047 7.16Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M7.0014 14.4402C5.6314 14.6702 4.12141 14.4302 3.06141 13.7202C1.65141 12.7802 1.65141 11.2402 3.06141 10.3002C4.13141 9.59016 5.6614 9.35016 7.0314 9.59016"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M11.9981 14.6302C11.9381 14.6202 11.8681 14.6202 11.8081 14.6302C10.4281 14.5802 9.32812 13.4502 9.32812 12.0502C9.32812 10.6202 10.4781 9.47021 11.9081 9.47021C13.3381 9.47021 14.4881 10.6302 14.4881 12.0502C14.4781 13.4502 13.3781 14.5902 11.9981 14.6302Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M9.08875 17.7804C7.67875 18.7204 7.67875 20.2603 9.08875 21.2003C10.6888 22.2703 13.3087 22.2703 14.9087 21.2003C16.3187 20.2603 16.3187 18.7204 14.9087 17.7804C13.3187 16.7204 10.6888 16.7204 9.08875 17.7804Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const BankDetailsIconItem: React.FC<IconProps> = ({ color = "#868C98", size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M13 9H7" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Path
      d="M22.0002 10.9702V13.0302C22.0002 13.5802 21.5602 14.0302 21.0002 14.0502H19.0402C17.9602 14.0502 16.9702 13.2602 16.8802 12.1802C16.8202 11.5502 17.0602 10.9602 17.4802 10.5502C17.8502 10.1702 18.3602 9.9502 18.9202 9.9502H21.0002C21.5602 9.9702 22.0002 10.4202 22.0002 10.9702Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M17.48 10.55C17.06 10.96 16.82 11.55 16.88 12.18C16.97 13.26 17.96 14.05 19.04 14.05H21V15.5C21 18.5 19 20.5 16 20.5H7C4 20.5 2 18.5 2 15.5V8.5C2 5.78 3.64 3.88 6.19 3.56C6.45 3.52 6.72 3.5 7 3.5H16C16.26 3.5 16.51 3.50999 16.75 3.54999C19.33 3.84999 21 5.76 21 8.5V9.95001H18.92C18.36 9.95001 17.85 10.17 17.48 10.55Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const PreferencesIconItem: React.FC<IconProps> = ({ color = "#868C98", size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M19 22V11" stroke={color} strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M19 7V2" stroke={color} strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M12 22V17" stroke={color} strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M12 13V2" stroke={color} strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M5 22V11" stroke={color} strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M5 7V2" stroke={color} strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M3 11H7" stroke={color} strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M17 11H21" stroke={color} strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M10 13H14" stroke={color} strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const ReferralsIconItem: React.FC<IconProps> = ({ color = "#868C98", size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M16.9609 6.16992C18.9609 7.55992 20.3409 9.76992 20.6209 12.3199" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M3.49023 12.3702C3.75023 9.83021 5.11023 7.62021 7.09023 6.22021" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M8.18945 20.9399C9.34945 21.5299 10.6695 21.8599 12.0595 21.8599C13.3995 21.8599 14.6595 21.5599 15.7895 21.0099" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M12.0593 7.70014C13.5946 7.70014 14.8393 6.45549 14.8393 4.92014C14.8393 3.38479 13.5946 2.14014 12.0593 2.14014C10.5239 2.14014 9.2793 3.38479 9.2793 4.92014C9.2793 6.45549 10.5239 7.70014 12.0593 7.70014Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M4.83078 19.9199C6.36613 19.9199 7.61078 18.6752 7.61078 17.1399C7.61078 15.6045 6.36613 14.3599 4.83078 14.3599C3.29543 14.3599 2.05078 15.6045 2.05078 17.1399C2.05078 18.6752 3.29543 19.9199 4.83078 19.9199Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M19.1706 19.9199C20.706 19.9199 21.9506 18.6752 21.9506 17.1399C21.9506 15.6045 20.706 14.3599 19.1706 14.3599C17.6353 14.3599 16.3906 15.6045 16.3906 17.1399C16.3906 18.6752 17.6353 19.9199 19.1706 19.9199Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const TwoFAIconItem: React.FC<IconProps> = ({ color = "#868C98", size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <Path
      d="M17.4242 9.26658C17.4242 13.3416 14.4659 17.1582 10.4242 18.2749C10.1492 18.3499 9.84921 18.3499 9.57421 18.2749C5.53255 17.1582 2.57422 13.3416 2.57422 9.26658V5.60824C2.57422 4.92491 3.0909 4.14991 3.73256 3.89158L8.37421 1.9916C9.41588 1.5666 10.5909 1.5666 11.6325 1.9916L16.2742 3.89158C16.9076 4.14991 17.4326 4.92491 17.4326 5.60824L17.4242 9.26658Z"
      stroke={color}
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M10.0007 10.4168C10.9211 10.4168 11.6673 9.67064 11.6673 8.75016C11.6673 7.82969 10.9211 7.0835 10.0007 7.0835C9.08018 7.0835 8.33398 7.82969 8.33398 8.75016C8.33398 9.67064 9.08018 10.4168 10.0007 10.4168Z"
      stroke={color}
      strokeWidth="1.25"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="M10 10.417V12.917" stroke={color} strokeWidth="1.25" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const ReportProblemIconItem: React.FC<IconProps> = ({ color = "#868C98", size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <Path d="M10 6.4585V10.8335" stroke={color} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    <Path
      d="M17.5675 7.14987V12.8498C17.5675 13.7832 17.0675 14.6499 16.2591 15.1249L11.3091 17.9832C10.5008 18.4499 9.50079 18.4499 8.68412 17.9832L3.73412 15.1249C2.92579 14.6582 2.42578 13.7915 2.42578 12.8498V7.14987C2.42578 6.21653 2.92579 5.34983 3.73412 4.87483L8.68412 2.0165C9.49246 1.54984 10.4925 1.54984 11.3091 2.0165L16.2591 4.87483C17.0675 5.34983 17.5675 6.2082 17.5675 7.14987Z"
      stroke={color}
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="M10 13.5V13.5833" stroke={color} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const DeactivateIconItem: React.FC<IconProps> = ({ color = "#868C98", size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <Path d="M15.3422 15.0752L12.9922 17.4252" stroke={color} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M15.3422 17.4252L12.9922 15.0752" stroke={color} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    <Path
      d="M10.1322 9.05817C10.0488 9.04984 9.94883 9.04984 9.85716 9.05817C7.87383 8.9915 6.29883 7.3665 6.29883 5.3665C6.29883 3.32484 7.94883 1.6665 9.99883 1.6665C12.0405 1.6665 13.6988 3.32484 13.6988 5.3665C13.6905 7.3665 12.1155 8.9915 10.1322 9.05817Z"
      stroke={color}
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M10 18.1751C8.48333 18.1751 6.975 17.7917 5.825 17.0251C3.80833 15.6751 3.80833 13.4751 5.825 12.1334C8.11667 10.6001 11.875 10.6001 14.1667 12.1334"
      stroke={color}
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const ChatSupportIconItem: React.FC<IconProps> = ({ color = "#868C98", size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M8.5 19H8C4 19 2 18 2 13V8C2 4 4 2 8 2H16C20 2 22 4 22 8V13C22 17 20 19 16 19H15.5C15.19 19 14.89 19.15 14.7 19.4L13.2 21.4C12.54 22.28 11.46 22.28 10.8 21.4L9.3 19.4C9.14 19.18 8.77 19 8.5 19Z"
      stroke={color}
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="M15.9965 11H16.0054" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M11.9955 11H12.0045" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M7.99451 11H8.00349" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const FAQIconItem: React.FC<IconProps> = ({ color = "#868C98", size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <Path
      d="M10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 14.1421 5.85786 17.5 10 17.5Z"
      stroke={color}
      strokeWidth="1.25"
    />
    <Path
      d="M7.91699 7.91667C8.1744 7.20239 8.84795 6.66667 9.99966 6.66667C11.2503 6.66667 12.083 7.50004 12.083 8.54171C12.083 9.79237 10.4163 10.4167 10.4163 11.6667"
      stroke={color}
      strokeWidth="1.25"
      strokeLinecap="round"
    />
    <Path d="M10 13.75V13.8333" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </Svg>
);

export const ContactUsIconItem: React.FC<IconProps> = ({ color = "#868C98", size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M21.97 18.33C21.97 18.69 21.89 19.06 21.72 19.42C21.55 19.78 21.33 20.12 21.04 20.44C20.55 20.98 20.01 21.37 19.4 21.62C18.8 21.87 18.15 22 17.45 22C16.43 22 15.34 21.76 14.19 21.27C13.04 20.78 11.89 20.12 10.75 19.29C9.6 18.45 8.51 17.52 7.47 16.49C6.44 15.45 5.51 14.36 4.68 13.22C3.86 12.08 3.2 10.94 2.72 9.81C2.24 8.67 2 7.58 2 6.54C2 5.86 2.12 5.21 2.36 4.61C2.6 4 2.98 3.44 3.51 2.94C4.15 2.31 4.85 2 5.59 2C5.87 2 6.15 2.06 6.4 2.18C6.66 2.3 6.89 2.48 7.07 2.74L9.39 6.01C9.57 6.26 9.7 6.49 9.79 6.71C9.88 6.92 9.93 7.13 9.93 7.32C9.93 7.56 9.86 7.8 9.72 8.03C9.59 8.26 9.4 8.5 9.16 8.74L8.4 9.53C8.29 9.64 8.24 9.77 8.24 9.93C8.24 10.01 8.25 10.08 8.27 10.16C8.3 10.24 8.33 10.3 8.35 10.36C8.53 10.69 8.84 11.12 9.28 11.64C9.73 12.16 10.21 12.69 10.73 13.22C11.27 13.75 11.79 14.24 12.32 14.69C12.84 15.13 13.27 15.43 13.61 15.61C13.66 15.63 13.72 15.66 13.79 15.69C13.87 15.72 13.95 15.73 14.04 15.73C14.21 15.73 14.34 15.67 14.45 15.56L15.21 14.81C15.46 14.56 15.7 14.37 15.93 14.25C16.16 14.11 16.39 14.04 16.64 14.04C16.83 14.04 17.03 14.08 17.25 14.17C17.47 14.26 17.7 14.39 17.95 14.56L21.26 16.91C21.52 17.09 21.7 17.3 21.81 17.55C21.91 17.8 21.97 18.05 21.97 18.33Z"
      stroke={color}
      strokeWidth="1.5"
      strokeMiterlimit="10"
    />
  </Svg>
);

export const LogoutIconItem: React.FC<IconProps> = ({ color = "#868C98", size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M8.8999 7.55999C9.2099 3.95999 11.0599 2.48999 15.1099 2.48999H15.2399C19.7099 2.48999 21.4999 4.27999 21.4999 8.74999V15.27C21.4999 19.74 19.7099 21.53 15.2399 21.53H15.1099C11.0899 21.53 9.2399 20.08 8.9099 16.54"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="M15.0001 12H3.62012" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M5.85 8.6499L2.5 11.9999L5.85 15.3499" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const UploadIconItem: React.FC<IconProps> = ({ color = "#868C98", size = 28 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M16.6097 19.9999C17.9497 20.0099 19.2397 19.5099 20.2297 18.6099C23.4997 15.7499 21.7497 10.0099 17.4397 9.46995C15.8997 0.129949 2.42973 3.66995 5.61973 12.5599"
      stroke={color}
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M7.27938 12.9698C6.74938 12.6998 6.15938 12.5598 5.56938 12.5698C0.909376 12.8998 0.919376 19.6798 5.56938 20.0098"
      stroke={color}
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M15.8203 9.89047C16.3403 9.63047 16.9003 9.49047 17.4803 9.48047"
      stroke={color}
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="M12.9688 20H8.96875" stroke={color} strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M10.9688 22V18" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const EditIconItem: React.FC<IconProps> = ({ color = "#868C98", size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 18 18" fill="none">
    <Path
      d="M8.25 1.5H6.75C3 1.5 1.5 3 1.5 6.75V11.25C1.5 15 3 16.5 6.75 16.5H11.25C15 16.5 16.5 15 16.5 11.25V9.75"
      stroke={color}
      strokeWidth="1.125"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12.0304 2.26495L6.1204 8.17495C5.8954 8.39995 5.6704 8.84245 5.6254 9.16495L5.3029 11.4224C5.1829 12.2399 5.7604 12.8099 6.5779 12.6974L8.8354 12.3749C9.1504 12.3299 9.5929 12.1049 9.8254 11.8799L15.7354 5.96995C16.7554 4.94995 17.2354 3.76495 15.7354 2.26495C14.2354 0.764945 13.0504 1.24495 12.0304 2.26495Z"
      stroke={color}
      strokeWidth="1.125"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M11.1816 3.1123C11.6841 4.9048 13.0866 6.3073 14.8866 6.8173"
      stroke={color}
      strokeWidth="1.125"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const CameraIconItem: React.FC<IconProps> = ({ color = "#868C98", size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <Path
      d="M5.63412 18.3332H14.3675C16.6675 18.3332 17.5841 16.9248 17.6925 15.2082L18.1258 8.32484C18.2425 6.52484 16.8091 4.99984 15.0008 4.99984C14.4925 4.99984 14.0258 4.70817 13.7925 4.25817L13.1925 3.04984C12.8091 2.2915 11.8091 1.6665 10.9591 1.6665H9.05079C8.19246 1.6665 7.19246 2.2915 6.80912 3.04984L6.20912 4.25817C5.97579 4.70817 5.50912 4.99984 5.00079 4.99984C3.19246 4.99984 1.75912 6.52484 1.87579 8.32484L2.30912 15.2082C2.40912 16.9248 3.33412 18.3332 5.63412 18.3332Z"
      stroke={color}
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="M8.75 6.6665H11.25" stroke={color} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    <Path
      d="M9.99935 15.0002C11.491 15.0002 12.7077 13.7835 12.7077 12.2918C12.7077 10.8002 11.491 9.5835 9.99935 9.5835C8.50768 9.5835 7.29102 10.8002 7.29102 12.2918C7.29102 13.7835 8.50768 15.0002 9.99935 15.0002Z"
      stroke={color}
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const GalleryIconItem: React.FC<IconProps> = ({ color = "#868C98", size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <Path
      d="M7.49935 18.3332H12.4993C16.666 18.3332 18.3327 16.6665 18.3327 12.4998V7.49984C18.3327 3.33317 16.666 1.6665 12.4993 1.6665H7.49935C3.33268 1.6665 1.66602 3.33317 1.66602 7.49984V12.4998C1.66602 16.6665 3.33268 18.3332 7.49935 18.3332Z"
      stroke={color}
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M7.50065 8.33333C8.42113 8.33333 9.16732 7.58714 9.16732 6.66667C9.16732 5.74619 8.42113 5 7.50065 5C6.58018 5 5.83398 5.74619 5.83398 6.66667C5.83398 7.58714 6.58018 8.33333 7.50065 8.33333Z"
      stroke={color}
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M2.22461 15.7918L6.33294 13.0335C6.99128 12.5918 7.94128 12.6418 8.53294 13.1501L8.80794 13.3918C9.45794 13.9501 10.5079 13.9501 11.1579 13.3918L14.6246 10.4168C15.2746 9.85846 16.3246 9.85846 16.9746 10.4168L18.3329 11.5835"
      stroke={color}
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

interface ToggleIconProps {
  value: boolean;
  onValueChange?: (val: boolean) => void;
}

export const ToggleIconItem: React.FC<ToggleIconProps> = ({ value, onValueChange }) => {
  const trackColor = value ? "#0A0D14" : "#F6F8FA";
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onValueChange && onValueChange(!value)}
    >
      <Svg width={44} height={24} viewBox="0 0 44 24" fill="none">
        <Path
          d="M0 12C0 5.37258 5.37258 0 12 0H32C38.6274 0 44 5.37258 44 12C44 18.6274 38.6274 24 32 24H12C5.37258 24 0 18.6274 0 12Z"
          fill={trackColor}
        />
        {value ? (
          <Path
            d="M22 12C22 6.47715 26.4772 2 32 2C37.5228 2 42 6.47715 42 12C42 17.5228 37.5228 22 32 22C26.4772 22 22 17.5228 22 12Z"
            fill="#FFFFFF"
          />
        ) : (
          <Path
            d="M2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12Z"
            fill="#FFFFFF"
          />
        )}
      </Svg>
    </TouchableOpacity>
  );
};

export const CopyIconItem: React.FC<IconProps> = ({ color = "#868C98", size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 18 18" fill="none">
    <Path
      d="M12 9.675V12.825C12 15.45 10.95 16.5 8.325 16.5H5.175C2.55 16.5 1.5 15.45 1.5 12.825V9.675C1.5 7.05 2.55 6 5.175 6H8.325C10.95 6 12 7.05 12 9.675Z"
      stroke={color}
      strokeWidth="1.125"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M16.5 5.175V8.325C16.5 10.95 15.45 12 12.825 12H12V9.675C12 7.05 10.95 6 8.325 6H6V5.175C6 2.55 7.05 1.5 9.675 1.5H12.825C15.45 1.5 16.5 2.55 16.5 5.175Z"
      stroke={color}
      strokeWidth="1.125"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

interface FileFormatIconProps {
  filename?: string;
  extension?: string;
  size?: number;
}

export const FileFormatIconItem: React.FC<FileFormatIconProps> = ({
  filename = "",
  extension = "",
  size = 40,
}) => {
  let ext = extension;
  if (!ext && filename) {
    const parts = filename.split(".");
    if (parts.length > 1) {
      ext = parts[parts.length - 1];
    }
  }
  ext = (ext || "pdf").toUpperCase();

  let badgeColor = "#DF1C41"; // Red for PDF
  if (["PNG", "JPG", "JPEG", "WEBP", "GIF"].includes(ext)) {
    badgeColor = "#2563EB"; // Blue
  } else if (["MP4", "MOV", "AVI", "MKV"].includes(ext)) {
    badgeColor = "#7C3AED"; // Purple
  } else if (["XLS", "XLSX", "CSV"].includes(ext)) {
    badgeColor = "#059669"; // Green
  } else if (["DOC", "DOCX", "TXT"].includes(ext)) {
    badgeColor = "#0284C7"; // Light Blue
  } else if (["ZIP", "RAR"].includes(ext)) {
    badgeColor = "#D97706"; // Amber
  }

  return (
    <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <Path
        d="M30 40H10C6.68629 40 4 37.3137 4 34V6C4 2.68629 6.68629 0 10 0H20.5147C22.106 0 23.6321 0.632142 24.7574 1.75736L34.2426 11.2426C35.3679 12.3679 36 13.894 36 15.4853V34C36 37.3137 33.3137 40 30 40Z"
        fill="#FFFFFF"
      />
      <Path
        d="M10 0.75H20.5146C21.907 0.75 23.242 1.30354 24.2266 2.28809L33.7119 11.7734C34.6965 12.758 35.25 14.093 35.25 15.4854V34C35.25 36.8995 32.8995 39.25 30 39.25H10C7.10051 39.25 4.75 36.8995 4.75 34V6C4.75 3.10051 7.10051 0.75 10 0.75Z"
        stroke="#CDD0D5"
        strokeWidth="1.5"
      />
      <Path d="M23 1V9C23 11.2091 24.7909 13 27 13H35" stroke="#CDD0D5" strokeWidth="1.5" />

      <Path
        d="M0 22C0 19.7909 1.79086 18 4 18H24C26.2091 18 28 19.7909 28 22V30C28 32.2091 26.2091 34 24 34H4C1.79086 34 0 32.2091 0 30V22Z"
        fill={badgeColor}
      />
      <SvgText
        x="14"
        y="28"
        fill="#FFFFFF"
        fontSize={ext.length > 3 ? "8" : "9.5"}
        fontWeight="bold"
        textAnchor="middle"
      >
        {ext}
      </SvgText>
    </Svg>
  );
};

export const UsersIconItem: React.FC<IconProps> = ({ color = "#868C98", size = 16 }) => (
  <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <Path
      d="M6.10573 7.24683C6.03906 7.24016 5.95906 7.24016 5.88573 7.24683C4.29906 7.1935 3.03906 5.8935 3.03906 4.2935C3.03906 2.66016 4.35906 1.3335 5.99906 1.3335C7.6324 1.3335 8.95906 2.66016 8.95906 4.2935C8.9524 5.8935 7.6924 7.1935 6.10573 7.24683Z"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M10.9382 2.6665C12.2316 2.6665 13.2716 3.71317 13.2716 4.99984C13.2716 6.25984 12.2716 7.2865 11.0249 7.33317C10.9716 7.3265 10.9116 7.3265 10.8516 7.33317"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M2.7725 9.7065C1.15917 10.7865 1.15917 12.5465 2.7725 13.6198C4.60583 14.8465 7.6125 14.8465 9.44583 13.6198C11.0592 12.5398 11.0592 10.7798 9.44583 9.7065C7.61917 8.4865 4.6125 8.4865 2.7725 9.7065Z"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12.2266 13.3335C12.7066 13.2335 13.1599 13.0402 13.5332 12.7535C14.5732 11.9735 14.5732 10.6868 13.5332 9.90683C13.1666 9.62683 12.7199 9.44016 12.2466 9.3335"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const CloseIconItem: React.FC<IconProps> = ({ color = "#868C98", size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <Path
      d="M10 18.3333C14.6024 18.3333 18.3333 14.6024 18.3333 10C18.3333 5.39763 14.6024 1.66667 10 1.66667C5.39763 1.66667 1.66667 5.39763 1.66667 10C1.66667 14.6024 5.39763 18.3333 10 18.3333Z"
      stroke={color}
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M7.5 7.5L12.5 12.5"
      stroke={color}
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12.5 7.5L7.5 12.5"
      stroke={color}
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const WarningIconItem: React.FC<IconProps> = ({ color = "#9F2D00", size = 16 }) => (
  <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <Path
      d="M8 5.16699V8.66699"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M14.0528 5.7197V10.2797C14.0528 11.0263 13.6528 11.7197 13.0061 12.0997L9.04614 14.3864C8.39948 14.7597 7.59946 14.7597 6.94613 14.3864L2.98612 12.0997C2.33946 11.7264 1.93945 11.033 1.93945 10.2797V5.7197C1.93945 4.97303 2.33946 4.27967 2.98612 3.89967L6.94613 1.61301C7.59279 1.23967 8.39281 1.23967 9.04614 1.61301L13.0061 3.89967C13.6528 4.27967 14.0528 4.96636 14.0528 5.7197Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M8 10.7998V10.8665"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const VerifiedBadgeIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 16,
  color = "#375DFB",
}) => (
  <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <Path
      d="M14.3726 7.16036L13.4659 6.10703C13.2926 5.90703 13.1526 5.5337 13.1526 5.26703V4.1337C13.1526 3.42703 12.5726 2.84703 11.8659 2.84703H10.7326C10.4726 2.84703 10.0926 2.70703 9.8926 2.5337L8.83927 1.62703C8.37927 1.2337 7.62594 1.2337 7.15927 1.62703L6.1126 2.54036C5.9126 2.70703 5.5326 2.84703 5.2726 2.84703H4.11927C3.4126 2.84703 2.8326 3.42703 2.8326 4.1337V5.2737C2.8326 5.5337 2.6926 5.90703 2.52594 6.10703L1.62594 7.16703C1.23927 7.62703 1.23927 8.3737 1.62594 8.8337L2.52594 9.8937C2.6926 10.0937 2.8326 10.467 2.8326 10.727V11.867C2.8326 12.5737 3.4126 13.1537 4.11927 13.1537H5.2726C5.5326 13.1537 5.9126 13.2937 6.1126 13.467L7.16594 14.3737C7.62594 14.767 8.37927 14.767 8.84594 14.3737L9.89927 13.467C10.0993 13.2937 10.4726 13.1537 10.7393 13.1537H11.8726C12.5793 13.1537 13.1593 12.5737 13.1593 11.867V10.7337C13.1593 10.4737 13.2993 10.0937 13.4726 9.8937L14.3793 8.84036C14.7659 8.38036 14.7659 7.62036 14.3726 7.16036ZM10.7726 6.74036L7.5526 9.96036C7.45927 10.0537 7.3326 10.107 7.19927 10.107C7.06594 10.107 6.93927 10.0537 6.84594 9.96036L5.2326 8.34703C5.03927 8.1537 5.03927 7.8337 5.2326 7.64036C5.42594 7.44703 5.74594 7.44703 5.93927 7.64036L7.19927 8.90036L10.0659 6.0337C10.2593 5.84036 10.5793 5.84036 10.7726 6.0337C10.9659 6.22703 10.9659 6.54703 10.7726 6.74036Z"
      fill={color}
    />
  </Svg>
);

export const SearchIconItem: React.FC<IconProps> = ({ color = "#868C98", size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <Path
      d="M9.58268 17.5003C13.9549 17.5003 17.4993 13.9559 17.4993 9.58366C17.4993 5.2114 13.9549 1.66699 9.58268 1.66699C5.21043 1.66699 1.66602 5.2114 1.66602 9.58366C1.66602 13.9559 5.21043 17.5003 9.58268 17.5003Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M18.3327 18.3337L16.666 16.667"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const FilterIconItem: React.FC<IconProps> = ({ color = "#CDD0D5", size = 22 }) => (
  <Svg width={size} height={size} viewBox="0 0 22 22" fill="none">
    <Path
      d="M20.166 5.95801H14.666"
      stroke={color}
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M5.50065 5.95801H1.83398"
      stroke={color}
      strokeWidth="1.65"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M9.16732 9.16667C10.9392 9.16667 12.3757 7.73025 12.3757 5.95833C12.3757 4.18642 10.9392 2.75 9.16732 2.75C7.3954 2.75 5.95898 4.18642 5.95898 5.95833C5.95898 7.73025 7.3954 9.16667 9.16732 9.16667Z"
      stroke={color}
      strokeWidth="1.65"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M20.1667 16.042H16.5"
      stroke={color}
      strokeWidth="1.65"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M7.33398 16.042H1.83398"
      stroke={color}
      strokeWidth="1.65"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12.8333 19.2497C14.6052 19.2497 16.0417 17.8133 16.0417 16.0413C16.0417 14.2694 14.6052 12.833 12.8333 12.833C11.0614 12.833 9.625 14.2694 9.625 16.0413C9.625 17.8133 11.0614 19.2497 12.8333 19.2497Z"
      stroke={color}
      strokeWidth="1.65"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const DottedConnectorLineItem: React.FC<IconProps> = ({ color = "#E2E4E9" }) => (
  <Svg width={5} height={11} viewBox="0 0 5 11" fill="none">
    <Line
      x1="2.84961"
      y1="0.5"
      x2="2.84961"
      y2="10.5"
      stroke={color}
      strokeLinecap="round"
      strokeDasharray="3 3"
    />
  </Svg>
);

export const FingerprintIconItem: React.FC<IconProps> = ({ color = "#868C98", size = 33 }) => (
  <Svg width={size} height={size} viewBox="0 0 33 33" fill="none">
    <Path
      d="M16.1324 20.0052C14.909 20.0052 13.9141 19.0103 13.9141 17.7868V14.4661C13.9141 13.2426 14.909 12.2477 16.1324 12.2477C17.3558 12.2477 18.3507 13.2426 18.3507 14.4661V17.7868C18.3507 19.0103 17.3558 20.0052 16.1324 20.0052Z"
      stroke={color}
      strokeWidth={1.1}
      strokeLinecap="round"
    />
    <Path
      d="M22.8277 18.1096C22.5588 21.5783 19.6548 24.2941 16.1324 24.2941C12.4217 24.2941 9.41016 21.2826 9.41016 17.5719V14.6948C9.41016 10.9841 12.4217 7.97256 16.1324 7.97256C19.6145 7.97256 22.4782 10.6211 22.8143 14.0091"
      stroke={color}
      strokeWidth={1.1}
      strokeLinecap="round"
    />
    <Path
      d="M20.166 2.6889H22.8549C26.8882 2.6889 29.5771 5.37779 29.5771 9.41113V12.1"
      stroke={color}
      strokeWidth={1.1}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M2.6875 12.1V9.41113C2.6875 5.37779 5.37639 2.6889 9.40972 2.6889H12.0986"
      stroke={color}
      strokeWidth={1.1}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M20.166 29.5778H22.8549C26.8882 29.5778 29.5771 26.8889 29.5771 22.8555V20.1667"
      stroke={color}
      strokeWidth={1.1}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M2.6875 20.1667V22.8555C2.6875 26.8889 5.37639 29.5778 9.40972 29.5778H12.0986"
      stroke={color}
      strokeWidth={1.1}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const GoogleIconItem: React.FC<IconProps> = ({ size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <Path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <Path
      d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <Path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      fill="#EA4335"
    />
  </Svg>
);

export const AppleIconItem: React.FC<IconProps> = ({ color = "#000000", size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.69c.62-.76 1.04-1.81.93-2.86-.9.04-2 .6-2.65 1.36-.58.67-1.09 1.74-.95 2.78 1.01.08 2.05-.52 2.67-1.28z" />
  </Svg>
);

export const HeaderBackIconItem: React.FC<IconProps> = ({ color = "#868C98", size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <Path
      d="M7.97435 4.94167L2.91602 10L7.97435 15.0583"
      stroke={color}
      strokeWidth={1.25}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M17.0836 10H3.05859"
      stroke={color}
      strokeWidth={1.25}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const MailIconItem: React.FC<IconProps> = ({ color = "#262731", size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <Path
      d="M14.166 17.0833H5.83268C3.33268 17.0833 1.66602 15.8333 1.66602 12.9167V7.08332C1.66602 4.16666 3.33268 2.91666 5.83268 2.91666H14.166C16.666 2.91666 18.3327 4.16666 18.3327 7.08332V12.9167C18.3327 15.8333 16.666 17.0833 14.166 17.0833Z"
      stroke={color}
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M14.1673 7.5L11.559 9.58333C10.7006 10.2667 9.29231 10.2667 8.43398 9.58333L5.83398 7.5"
      stroke={color}
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);










