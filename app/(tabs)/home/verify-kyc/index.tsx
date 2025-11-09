import BackBtn from "@/components/BackBtn";
import Icon from "@/components/Icon";
import { useAsyncStorage } from "@/hooks/useAsyncStorage";
import { isTablet } from "@/utils/utils";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const IndexPage = () => {
  const { setValue } = useAsyncStorage("file-type");
  const router = useRouter();
  const requiredKycDoc = [
    {
      title: "Take a photo of your valid ID card",
      desc: "Valid ID could be your national ID card, drivers license, voters card or international passport.",
    },
    {
      title: "Take a photo of your certification",
      desc: "This will help us confirm your expertise.",
    },
  ];

  const handleNavigate = async (type: string) => {
    if (type.includes("ID")) {
      await setValue("national ID");
    } else {
      await setValue("certification");
    }
    router.push("/(tabs)/home/verify-kyc/uploadFile");
  };

  return (
    <SafeAreaView className={`flex-1 bg-white`}>
      <View className={`${isTablet ? "px-10" : "px-5"}  mt-6 `}>
        <View className="pb-4">
          <BackBtn isMarginBottom />
        </View>
        <View>
          <Text
            className={`font-medium text-center text-gray-900 mb-1 ${
              isTablet ? "text-[32px] leading-[40px]" : "text-2xl leading-8"
            }`}
          >
            KYC Verification
          </Text>
          <Text
            className={`text-gray-600 text-center ${
              isTablet ? "text-base leading-6" : "text-sm leading-5"
            }`}
          >
            Submit the following documents to verify your profile
          </Text>

          <View className="mt-2 gap-2">
            {requiredKycDoc.map((item, i) => (
              <TouchableOpacity
                key={i}
                className="flex py-3 flex-row items-center"
                onPress={() => handleNavigate(item.title)}
                activeOpacity={0.7}
              >
                {i === 0 ? (
                  <Icon
                    type="AntDesign"
                    name="idcard"
                    color="#666666"
                    size={isTablet ? 26 : 22}
                  />
                ) : (
                  <Icon
                    type="MaterialCommunityIcons"
                    name="shield-check-outline"
                    color="#666666"
                    size={isTablet ? 26 : 22}
                  />
                )}
                <View className="ml-2 w-[80%]">
                  <Text
                    className={`text-[#191919] pb-1 font-semibold ${isTablet ? "text-xl" : "text-base"}`}
                  >
                    {item.title}
                  </Text>
                  <Text
                    className={`text-[#666666]  ${isTablet ? "text-base" : "text-sm"}`}
                  >
                    {item.desc}
                  </Text>
                </View>
                <View className=" justify-items-end">
                  <Icon
                    type="MaterialIcons"
                    name="arrow-forward-ios"
                    color="#666666"
                    size={isTablet ? 26 : 22}
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default IndexPage;
