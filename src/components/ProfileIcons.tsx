import React from "react";
import Svg, { Path } from "react-native-svg";

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
