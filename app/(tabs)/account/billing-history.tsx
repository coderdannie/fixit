import BackBtn from "@/components/BackBtn";
import CustomButton from "@/components/CustomButton";
import Icon from "@/components/Icon";
import PaymentMethodBottomSheet from "@/components/modals/PaymentMethod";
import { isTablet } from "@/utils/utils";
import BottomSheet from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const BillingHistory = () => {
  const [expandedItem, setExpandedItem] = useState<number | null>(null);

  const billingHistory = [
    { id: 1, date: "1st October, 2025", amount: 3500, status: "Pending" },
    { id: 2, date: "1st September, 2025", amount: 3500, status: "Successful" },
    { id: 3, date: "1st August, 2025", amount: 3500, status: "Failed" },
  ];

  const toggleExpand = (id: number) => {
    setExpandedItem(expandedItem === id ? null : id);
  };

  const paymentSheetRef = useRef<BottomSheet>(null);

  const router = useRouter();
  const handlePaymentSelect = (methodId: string) => {
    console.log("Selected payment method:", methodId);
    paymentSheetRef.current?.close();
    router.push("/account/add-payment-method");
  };

  const handleNavigateToCancelPlan = () => {
    router.push("/account/cancel-plan");
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Pending":
        return "text-orange-500 border-orange-500 bg-orange-50";
      case "Successful":
        return "text-green-600 border-green-600 bg-green-50";
      case "Failed":
        return "text-red-600 border-red-600 bg-red-50";
      default:
        return "text-gray-500 border-gray-500 bg-gray-50";
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom", "left"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        className={isTablet ? "px-10 pb-10" : "px-6 pb-10"}
      >
        <View className="pt-6 pb-4">
          <BackBtn isMarginBottom />
        </View>

        {/* Title */}
        <View className="mb-6">
          <Text
            className={`font-semibold text-gray-900 ${
              isTablet ? "text-[32px] leading-[40px]" : "text-2xl leading-8"
            }`}
          >
            Billing History
          </Text>
        </View>

        {/* Current Plan Section */}
        <View className="mb-6">
          <Text
            className={`font-semibold text-gray-900 mb-3 ${
              isTablet ? "text-[22px] leading-7" : "text-lg leading-6"
            }`}
          >
            Current Plan
          </Text>
          <View
            className={`bg-[#EAF0FB] border border-[#E6E6E6] rounded-2xl ${isTablet ? "p-6" : "p-5"}`}
          >
            <View className="flex-row justify-between items-start mb-4">
              <View>
                <Text
                  className={`font-semibold text-gray-900 ${
                    isTablet ? "text-xl leading-7" : "text-lg leading-6"
                  }`}
                >
                  Pro Plan
                </Text>
                <Text
                  className={`text-[#666666] mt-1 ${
                    isTablet ? "text-base leading-6" : "text-sm leading-5"
                  }`}
                >
                  Renews on 1st Nov, 2025
                </Text>
              </View>
              <View className="items-end">
                <View className="flex-row items-baseline">
                  <Text
                    className={`font-medium text-gray-900 ${
                      isTablet ? "text-xl leading-7" : "text-lg leading-6"
                    }`}
                  >
                    ₦2,500
                  </Text>
                  <Text
                    className={`text-[#666666] ${
                      isTablet ? "text-base leading-6" : "text-sm leading-5"
                    }`}
                  >
                    /month
                  </Text>
                </View>
              </View>
            </View>

            <CustomButton
              title="Cancel Pro Plan"
              containerClassName="mt-2"
              onPress={handleNavigateToCancelPlan}
            />
          </View>
        </View>

        {/* Payment Method Section */}
        <View className="mb-6 mt-1">
          <View className="flex-row justify-between items-center mb-3">
            <Text
              className={`font-semibold text-gray-900 ${
                isTablet ? "text-[22px] leading-7" : "text-lg leading-6"
              }`}
            >
              Payment Method
            </Text>
            <TouchableOpacity>
              <Text
                className={`text-primary font-medium ${
                  isTablet ? "text-lg leading-6" : " leading-5"
                }`}
              >
                View all
              </Text>
            </TouchableOpacity>
          </View>
          <View
            className={`border border-[#E6E6E6] rounded-2xl ${isTablet ? "p-6" : "p-5"}`}
          >
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center gap-3">
                <View className="w-12 h-10 bg-[#EAF0FB] rounded-md flex-row items-center justify-center">
                  <View className="w-3 h-3 bg-red-600 rounded-full " />
                  <View className="w-3 h-3 bg-orange-600 rounded-full" />
                </View>
                <View>
                  <Text
                    className={` text-gray-900 ${
                      isTablet
                        ? "text-lg leading-[26px]"
                        : "text-base leading-[22px]"
                    }`}
                  >
                    Master Card
                  </Text>
                  <Text
                    className={`text-[#666666] ${
                      isTablet ? "text-base leading-6" : "text-sm leading-5"
                    }`}
                  >
                    9876 8967 7698 679
                  </Text>
                </View>
              </View>
              <View>
                <Icon
                  type="Ionicons"
                  name="checkmark-circle-sharp"
                  color="#2964C2"
                  size={isTablet ? 26 : 22}
                />
              </View>
            </View>
            <CustomButton
              title="Add New Payment Method"
              containerClassName="mt-1"
              onPress={() => paymentSheetRef.current?.expand()}
            />
          </View>
        </View>

        {/* Billing History Section */}
        <View className="mb-6">
          <Text
            className={`font-semibold text-[#191919] mb-3 ${
              isTablet ? "text-[22px] leading-7" : "text-lg leading-6"
            }`}
          >
            Billing History
          </Text>
          <FlatList
            data={billingHistory}
            scrollEnabled={false}
            keyExtractor={(item) => item.id.toString()}
            ItemSeparatorComponent={() => <View className="h-4" />}
            renderItem={({ item }) => (
              <View className="border border-gray-200 rounded-2xl overflow-hidden">
                <TouchableOpacity
                  className={`active:bg-gray-50 ${isTablet ? "p-6" : "p-5"}`}
                  onPress={() => toggleExpand(item.id)}
                  activeOpacity={0.7}
                >
                  <View className="flex-row justify-between items-center">
                    <View className="flex-1">
                      <Text
                        className={`font-semibold text-gray-900 mb-2 ${
                          isTablet
                            ? "text-lg leading-[26px]"
                            : "text-base leading-[22px]"
                        }`}
                      >
                        {item.date}
                      </Text>
                      <View
                        className={`self-start rounded-full border ${
                          isTablet ? "px-3 py-1.5" : "px-2.5 py-1"
                        } ${getStatusStyle(item.status)}`}
                      >
                        <Text
                          className={`font-medium ${
                            isTablet
                              ? "text-base leading-6"
                              : "text-sm leading-5"
                          } ${
                            item.status === "Pending"
                              ? "text-orange-500"
                              : item.status === "Successful"
                                ? "text-green-600"
                                : "text-red-600"
                          }`}
                        >
                          {item.status}
                        </Text>
                      </View>
                    </View>
                    <View className="flex-row items-center gap-3 ml-4">
                      <Text
                        className={`font-medium text-gray-900 ${
                          isTablet ? "text-xl leading-7" : "text-lg leading-6"
                        }`}
                      >
                        ₦ {item.amount.toLocaleString()}
                      </Text>
                      <View
                        style={{
                          transform: [
                            {
                              rotate:
                                expandedItem === item.id ? "180deg" : "0deg",
                            },
                          ],
                        }}
                      >
                        <Icon
                          type="MaterialIcons"
                          name="keyboard-arrow-down"
                          color="#000"
                          size={isTablet ? 28 : 24}
                        />
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>

                {expandedItem === item.id && (
                  <View
                    className={`bg-gray-50 border-t border-gray-200 ${isTablet ? "px-6 pb-6 pt-4" : "px-5 pb-5 pt-3"}`}
                  >
                    <View className={isTablet ? "gap-3.5" : "gap-3"}>
                      <View className="flex-row justify-between">
                        <Text
                          className={`text-gray-600 ${
                            isTablet
                              ? "text-base leading-6"
                              : "text-sm leading-5"
                          }`}
                        >
                          Plan
                        </Text>
                        <Text
                          className={`font-medium text-gray-900 ${
                            isTablet
                              ? "text-base leading-6"
                              : "text-sm leading-5"
                          }`}
                        >
                          Pro Plan
                        </Text>
                      </View>
                      <View className="flex-row justify-between">
                        <Text
                          className={`text-gray-600 ${
                            isTablet
                              ? "text-base leading-6"
                              : "text-sm leading-5"
                          }`}
                        >
                          Payment Method
                        </Text>
                        <Text
                          className={`font-medium text-gray-900 ${
                            isTablet
                              ? "text-base leading-6"
                              : "text-sm leading-5"
                          }`}
                        >
                          Master Card •••• 679
                        </Text>
                      </View>
                      <View className="flex-row justify-between">
                        <Text
                          className={`text-gray-600 ${
                            isTablet
                              ? "text-base leading-6"
                              : "text-sm leading-5"
                          }`}
                        >
                          Transaction ID
                        </Text>
                        <Text
                          className={`font-medium text-gray-900 ${
                            isTablet
                              ? "text-base leading-6"
                              : "text-sm leading-5"
                          }`}
                        >
                          TXN{item.id}234567890
                        </Text>
                      </View>
                      {item.status === "Failed" && (
                        <TouchableOpacity className="bg-primary py-3 rounded-full items-center mt-2 active:bg-primary/90">
                          <Text
                            className={`text-white font-semibold ${
                              isTablet
                                ? "text-lg leading-6"
                                : "text-base leading-[22px]"
                            }`}
                          >
                            Retry Payment
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                )}
              </View>
            )}
          />
        </View>
      </ScrollView>
      <PaymentMethodBottomSheet
        ref={paymentSheetRef}
        onSelect={handlePaymentSelect}
        onClose={() => paymentSheetRef.current?.close()}
      />
    </SafeAreaView>
  );
};

export default BillingHistory;
