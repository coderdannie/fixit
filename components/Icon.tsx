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
import Svg, { Path } from "react-native-svg";

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
