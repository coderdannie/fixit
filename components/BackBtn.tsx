import { isTablet } from "@/utils/utils";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, View } from "react-native";
import Icon from "./Icon";

const BackBtn = ({ isMarginBottom }: { isMarginBottom?: boolean }) => {
  const router = useRouter();

  return (
    <View className={isMarginBottom ? "mb-5" : ""}>
      <Pressable
        onPress={() => router.back()}
        style={{
          width: isTablet ? 42 : 32,
          height: isTablet ? 42 : 32,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 10,
          backgroundColor: "#F2F2F2",
        }}
      >
        <Icon type="Ionicons" name="chevron-back" color="#1B417E" size={20} />
      </Pressable>
    </View>
  );
};

export default BackBtn;
