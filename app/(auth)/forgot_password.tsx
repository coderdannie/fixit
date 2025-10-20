import { useForgotPasswordMutation } from "@/apis/authQuery";
import CustomButton from "@/components/CustomButton";
import FormInput from "@/components/FormInput";
import { useAsyncStorage } from "@/hooks/useAsyncStorage";
import useToast from "@/hooks/useToast";
import AuthLayout from "@/layout/AuthLayout";
import { isTablet } from "@/utils/utils";
import { useRouter } from "expo-router";
import React from "react";
import { useForm } from "react-hook-form";
import { Text, View } from "react-native";

// Form validation schema
interface ForgotPasswordFormType {
  email: string;
}

const ForgotPassword = () => {
  const router = useRouter();

  const { showSuccess, showError } = useToast();

  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<ForgotPasswordFormType>({
    defaultValues: {
      email: "",
    },
    mode: "onChange",
  });

  const { setValue } = useAsyncStorage("email");
  const { setValue: setValueType } = useAsyncStorage("type");

  const onSubmit = async (data: ForgotPasswordFormType) => {
    try {
      const res = await forgotPassword(data).unwrap();
      if (res) {
        showSuccess("Success", res.message || "Account created successfully");
        await setValue(data.email);

        await setValueType("password");
        router.push("/(auth)/verify-email");
      }
    } catch (error: any) {
      showError("Error", error?.data?.message || "Something went wrong");
    }
  };

  return (
    <AuthLayout back>
      <View className={`flex-1 ${isTablet ? "px-10" : "px-5"}`}>
        {/* Header Section */}
        <View className="pt-6">
          <Text
            className={`${
              isTablet ? "text-3xl" : "text-2xl"
            } font-semibold text-textPrimary`}
          >
            Forgot Password
          </Text>
          <Text
            className={`${isTablet ? "text-xl" : "text-lg"} pt-2 text-[#666666] mb-5`}
          >
            Enter your email to reset your password. We will send you an OTP to
            create a new password.
          </Text>
        </View>

        {/* Form Section */}
        <View className="gap-5 mt-6 flex-1">
          <FormInput
            label="Email Address"
            control={control}
            name="email"
            placeholder="Enter your email address"
            rules={{
              required: "Email address is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Please enter a valid email address",
              },
            }}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <View className="pb-8 pt-4">
            <CustomButton
              onPress={handleSubmit(onSubmit)}
              containerClassName="w-[95%]"
              disabled={!isValid}
              title="Send OTP"
              loading={isLoading}
            />
          </View>
        </View>
      </View>
    </AuthLayout>
  );
};

export default ForgotPassword;
