import CustomButton from "@/components/CustomButton";
import FormInput from "@/components/FormInput";
import AuthLayout from "@/layout/AuthLayout";
import { isTablet } from "@/utils/utils";
import { PaymentMethodFormType, paymentMethodSchema } from "@/utils/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

const AddPaymentMethod = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<PaymentMethodFormType>({
    defaultValues: {
      cardNumber: "",
      cardholderName: "",
      expiryDate: "",
      cvv: "",
    },
    resolver: zodResolver(paymentMethodSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: PaymentMethodFormType) => {
    try {
      console.log("Payment data:", data);
      // Add your payment method API call here
      // await addPaymentMethod(data).unwrap();

      // Navigate to next screen or show success message
      // router.push("/next-screen");
    } catch (error: any) {
      console.log("error", error);
      // showError("Error", error?.data?.message || "An error occurred");
    }
  };

  return (
    <AuthLayout back>
      <View className={`flex-1 pt-7 ${isTablet ? "px-10" : "px-5"}`}>
        <Text
          className={`${
            isTablet ? "text-3xl" : "text-2xl"
          } font-semibold text-textPrimary `}
        >
          Add Payment Method
        </Text>
        <View className="gap-5 mt-6">
          <FormInput
            label="Card Number"
            control={control}
            name="cardNumber"
            placeholder="Enter card number"
            keyboardType="numeric"
            maxLength={19}
          />
          <FormInput
            label="Cardholder Name"
            control={control}
            name="cardholderName"
            placeholder="Enter card name"
            autoCapitalize="words"
          />
          <View className="flex-row gap-4">
            <View className="flex-1">
              <FormInput
                label="Expiry Date"
                control={control}
                name="expiryDate"
                placeholder="MM/YY"
                keyboardType="numeric"
                maxLength={5}
              />
            </View>
            <View className="flex-1">
              <FormInput
                label="CVV"
                control={control}
                name="cvv"
                placeholder="###"
                keyboardType="numeric"
                maxLength={4}
                secureTextEntry={true}
              />
            </View>
          </View>
        </View>

        <CustomButton
          onPress={handleSubmit(onSubmit)}
          containerClassName="w-[95%] mt-[30px]"
          disabled={!isValid}
          title="Add Payment Method"
        />
      </View>
    </AuthLayout>
  );
};

export default AddPaymentMethod;