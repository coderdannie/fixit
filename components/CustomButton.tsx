import { isTablet } from "@/utils/utils";
import React from "react";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

interface CustomButtonProps {
  title?: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  containerClassName?: string;
  textClassName?: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title = "Continue",
  onPress,
  disabled = false,
  loading,
  containerClassName = "",
  textClassName = "",
}) => {
  return (
    <TouchableOpacity
      className={`
        w-full
        rounded-full
        py-4
        px-6
        items-center
        justify-center
        border-[#E6E6E6]
        border
        ${disabled || loading ? "bg-[#578ADB]" : "bg-primary"}
        ${containerClassName}
      `}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={"white"} />
      ) : (
        <Text
          className={`text-white
           ${disabled || (loading && "font-medium")}
          ${isTablet ? "text-xl" : "text-base"}
          ${textClassName}
        `}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;
