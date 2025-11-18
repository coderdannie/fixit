import CustomButton from "@/components/CustomButton";
import Icon, { MasterCardIcon, VerveIcon, VisaIcon } from "@/components/Icon";
import { isTablet } from "@/utils/utils";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, { forwardRef, useCallback, useMemo, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface PaymentMethod {
  id: string;
  type: string;
  cardNumber: string;
  logo: string;
}

interface PaymentMethodBottomSheetProps {
  onSelect?: (methodId: string) => void;
  onClose?: () => void;
}

const PaymentMethodBottomSheet = forwardRef<
  BottomSheet,
  PaymentMethodBottomSheetProps
>((props, ref) => {
  const { onSelect, onClose } = props;
  const [selectedMethod, setSelectedMethod] = useState<string>("mastercard");

  const snapPoints = useMemo(() => ["50%"], []);

  const paymentMethods: PaymentMethod[] = [
    {
      id: "mastercard",
      type: "Master Card",
      cardNumber: "9876 8967 7698 679",
      logo: "mastercard",
    },
    {
      id: "visa",
      type: "Visa",
      cardNumber: "2323 4546 7865 098",
      logo: "visa",
    },
    {
      id: "verve",
      type: "Verve",
      cardNumber: "1230 6540 3407 135",
      logo: "verve",
    },
  ];

  const handleSelect = (methodId: string) => {
    setSelectedMethod(methodId);
  };

  const handleSave = () => {
    if (onSelect) {
      onSelect(selectedMethod);
    }
    if (onClose) {
      onClose();
    }
  };

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
        pressBehavior="close"
        style={[props.style, { top: 0 }]}
      />
    ),
    []
  );

  const getCardLogo = (logo: string) => {
    switch (logo) {
      case "mastercard":
        return (
          <View className="w-12 h-[35px] bg-[#EAF0FB] rounded-md flex-row items-center justify-center">
            <MasterCardIcon />
          </View>
        );
      case "visa":
        return (
          <View className="w-12 h-[35px] bg-[#EAF0FB] rounded-md items-center justify-center">
            <VisaIcon />
          </View>
        );
      case "verve":
        return (
          <View className="w-12 h-[35px] bg-[#EAF0FB] rounded-md items-center justify-center">
            <VerveIcon />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <BottomSheet
      ref={ref}
      snapPoints={snapPoints}
      enablePanDownToClose
      index={-1}
      backgroundStyle={{
        backgroundColor: "#fff",
      }}
      handleIndicatorStyle={{
        backgroundColor: "#E5E7EB",
        width: 40,
      }}
      backdropComponent={renderBackdrop}
    >
      <BottomSheetView className={isTablet ? "px-10" : "px-6"}>
        {/* Header */}
        <View className="flex-row justify-between items-center mb-6">
          <Text
            className={`font-semibold text-gray-900 ${
              isTablet ? "text-[22px] leading-7" : "text-lg leading-6"
            }`}
          >
            Payment Method
          </Text>
          <TouchableOpacity onPress={onClose}>
            <Icon
              type="MaterialIcons"
              name="close"
              color="#1F2937"
              size={isTablet ? 28 : 24}
            />
          </TouchableOpacity>
        </View>

        {/* Payment Methods List */}
        <View className="gap-4 mb-6">
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              onPress={() => handleSelect(method.id)}
              className={`border rounded-2xl flex-row items-center justify-between ${
                isTablet ? "p-5" : "p-4"
              } ${
                selectedMethod === method.id
                  ? "border-primary bg-blue-50"
                  : "border-gray-200 bg-white"
              }`}
              activeOpacity={0.9}
            >
              <View className="flex-row items-center gap-3">
                {getCardLogo(method.logo)}
                <View>
                  <Text
                    className={`font-semibold text-gray-900 ${
                      isTablet
                        ? "text-lg leading-[26px]"
                        : "text-base leading-[22px]"
                    }`}
                  >
                    {method.type}
                  </Text>
                  <Text
                    className={`text-gray-600 ${
                      isTablet ? "text-base leading-6" : "text-sm leading-5"
                    }`}
                  >
                    {method.cardNumber}
                  </Text>
                </View>
              </View>

              {/* Selection Indicator */}
              <View>
                {selectedMethod === method.id ? (
                  <Icon
                    type="Ionicons"
                    name="checkmark-circle-sharp"
                    color="#2964C2"
                    size={isTablet ? 26 : 22}
                  />
                ) : (
                  <View
                    className={`rounded-full border-2 border-gray-300 ${
                      isTablet ? "w-6 h-6" : "w-5 h-5"
                    }`}
                  />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Save Button */}
        <View className="mt-4">
          <CustomButton title="Save as Default" onPress={handleSave} />
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
});

PaymentMethodBottomSheet.displayName = "PaymentMethodBottomSheet";

export default PaymentMethodBottomSheet;
