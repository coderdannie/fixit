import {
  AntDesign,
  Entypo,
  EvilIcons,
  Feather,
  FontAwesome,
  FontAwesome5,
  FontAwesome6,
  Fontisto,
  Foundation,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  Octicons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import React from "react";
import Svg, { ClipPath, Defs, G, Path } from "react-native-svg";

export type IconType = keyof typeof Icons;

export type IconsProps = {
  type: IconType;
  name: string;
  color?: string;
  size?: number;
  style?: object;
  onPress?: () => void;
};

export const Icons = {
  MaterialCommunityIcons,
  MaterialIcons,
  Ionicons,
  Feather,
  FontAwesome,
  FontAwesome5,
  FontAwesome6,
  AntDesign,
  Entypo,
  SimpleLineIcons,
  Octicons,
  Foundation,
  EvilIcons,
  Fontisto,
};

const Icon: React.FC<IconsProps> = ({
  type,
  name,
  color = "black",
  size = 24,
  style,
  onPress,
}) => {
  const Tag = Icons[type];
  if (!Tag) {
    return null;
  }

  return (
    <Tag
      name={name}
      size={size}
      color={color}
      style={style}
      onPress={onPress}
    />
  );
};

export default Icon;

export const ClockIcon = (props: any) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={18}
    fill="none"
    {...props}
  >
    <Path
      stroke="gray"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M9 6.75v3l1.5 1.5m-6.75-9L1.5 4.5m15 0-2.25-2.25M4.785 14.025 3 15.75m10.23-1.748L15 15.75m0-6a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z"
    />
  </Svg>
);

export const AssignedIcon = (props: any) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    {...props}
  >
    <G clipPath="url(#a)">
      <Path
        stroke="#2964C2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.7}
        d="M12.25 5.25a.833.833 0 0 0 0 1.167l1.333 1.333a.833.833 0 0 0 1.167 0l2.588-2.588c.267-.268.72-.183.82.182a5 5 0 0 1-6.883 5.881l-6.592 6.592a1.767 1.767 0 1 1-2.5-2.5l6.593-6.592a5 5 0 0 1 5.88-6.883c.365.1.45.552.183.82l-2.59 2.588Z"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h20v20H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);

export const TimeLineIcon = (props: any) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    {...props}
  >
    <Path
      stroke="#2964C2"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.7}
      d="M8.333 1.667h3.333m-1.666 10 2.5-2.5m4.166 2.5a6.667 6.667 0 1 1-13.333 0 6.667 6.667 0 0 1 13.333 0Z"
    />
  </Svg>
);

export const SquareCheckIcon = (props: any) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    {...props}
  >
    <Path
      stroke="#2964C2"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.7}
      d="m7.5 10 1.667 1.667L12.5 8.333M4.167 2.5h11.666c.92 0 1.667.746 1.667 1.667v11.666c0 .92-.746 1.667-1.667 1.667H4.167c-.92 0-1.667-.746-1.667-1.667V4.167c0-.92.746-1.667 1.667-1.667Z"
    />
  </Svg>
);

export const BanIcon = (props: any) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    {...props}
  >
    <G clipPath="url(#a)">
      <Path
        stroke="#2964C2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.7}
        d="m4.108 4.107 11.784 11.785M18.334 10a8.333 8.333 0 1 1-16.667 0 8.333 8.333 0 0 1 16.667 0Z"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h20v20H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);

export const ScanIcon = (props: any) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    {...props}
  >
    <Path
      stroke="#2964C2"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.7}
      d="M2.5 5.833V4.167A1.667 1.667 0 0 1 4.167 2.5h1.666m8.334 0h1.666A1.666 1.666 0 0 1 17.5 4.167v1.666m0 8.334v1.666a1.666 1.666 0 0 1-1.667 1.667h-1.666m-8.334 0H4.167A1.667 1.667 0 0 1 2.5 15.833v-1.666"
    />
  </Svg>
);

export const CicleAlert = (props: any) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    {...props}
  >
    <G clipPath="url(#a)">
      <Path
        stroke="#2964C2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.7}
        d="M10 6.667V10m0 3.333h.009M18.334 10a8.333 8.333 0 1 1-16.667 0 8.333 8.333 0 0 1 16.667 0Z"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h20v20H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);

export const FileSpreadSheet = (props: any) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    {...props}
  >
    <Path
      stroke="#2964C2"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.7}
      d="M11.666 1.667V5a1.667 1.667 0 0 0 1.667 1.667h3.333m-10 4.166h1.667m3.333 0h1.667m-6.667 3.333h1.667m3.333 0h1.667m-.833-12.5H5a1.667 1.667 0 0 0-1.667 1.667v13.334A1.667 1.667 0 0 0 5 18.332h10a1.667 1.667 0 0 0 1.666-1.666V5.832L12.5 1.666Z"
    />
  </Svg>
);

export const CreditCardIcon = (props: any) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    {...props}
  >
    <Path
      stroke="#2964C2"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.7}
      d="M1.667 8.333h16.667m-15-4.167h13.333c.92 0 1.667.747 1.667 1.667v8.334c0 .92-.747 1.666-1.667 1.666H3.334c-.92 0-1.667-.746-1.667-1.667V5.833c0-.92.746-1.667 1.667-1.667Z"
    />
  </Svg>
);

export const TriangleAlertIcon = (props: any) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    {...props}
  >
    <Path
      stroke="#2964C2"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.7}
      d="M10 7.5v3.333m0 3.333h.008m8.1.834L11.441 3.333a1.667 1.667 0 0 0-2.9 0L1.875 15a1.666 1.666 0 0 0 1.458 2.5h13.333a1.667 1.667 0 0 0 1.442-2.5Z"
    />
  </Svg>
);

export const UpdatesIcon = (props: any) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    {...props}
  >
    <Path
      stroke="#2964C2"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.7}
      d="M17.5 10A7.5 7.5 0 0 0 10 2.5a8.125 8.125 0 0 0-5.617 2.283L2.5 6.667m0 0V2.5m0 4.167h4.167M2.5 10a7.5 7.5 0 0 0 7.5 7.5 8.125 8.125 0 0 0 5.617-2.283l1.883-1.884m0 0h-4.167m4.167 0V17.5"
    />
  </Svg>
);
