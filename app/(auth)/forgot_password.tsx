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
import { useTranslation } from "react-i18next"; // <-- Import useTranslation
import { Text, View } from "react-native";

// Form validation schema
interface ForgotPasswordFormType {
  email: string;
}

const ForgotPassword = () => {
  const router = useRouter();
  const { t } = useTranslation();

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
        showSuccess(
          t("common.success"),
          res.message || t("auth.accountCreatedSuccess")
        );
        await setValue(data.email);

        await setValueType("password");
        router.push("/(auth)/verify-email");
      }
    } catch (error: any) {
      showError(
        t("common.error"),
        error?.data?.message || t("common.somethingWentWrong")
      );
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
            {t("forgotPasswordScreen.title")}
          </Text>
          <Text
            className={`${isTablet ? "text-xl" : "text-lg"} pt-2 text-[#666666] mb-5`}
          >
            {t("forgotPasswordScreen.instruction")}{" "}
          </Text>
        </View>

        {/* Form Section */}
        <View className="gap-5 mt-6 flex-1">
          <FormInput
            label={t("auth.emailLabel")}
            control={control}
            name="email"
            placeholder={t("forgotPasswordScreen.emailPlaceholder")}
            rules={{
              required: t("auth.emailRequired"), // <-- Translated Requirement
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: t("auth.emailInvalid"), // <-- You may need to add this key for invalid email
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
              title={t("forgotPasswordScreen.sendOTP")}
              loading={isLoading}
            />
          </View>
        </View>
      </View>
    </AuthLayout>
  );
};

export default ForgotPassword;
