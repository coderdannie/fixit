import { useResetPasswordMutation } from "@/apis/authQuery";
import CustomButton from "@/components/CustomButton";
import FormInput from "@/components/FormInput";
import SuccessModal from "@/components/modals/SuccessModal";
import { useAsyncStorage } from "@/hooks/useAsyncStorage";
import useToast from "@/hooks/useToast";
import AuthLayout from "@/layout/AuthLayout";
import { isTablet } from "@/utils/utils";
import {
  createNewPasswordSchema,
  CreatePasswordFormType,
} from "@/utils/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next"; // <-- Import useTranslation
import { Text, View } from "react-native";

const CreateNewPassword = () => {
  const { t } = useTranslation(); // <-- Initialize useTranslation
  const [isVisible, setIsVisible] = useState(false);
  const { showError } = useToast();

  const { storedValue: resetPasswordEmail } = useAsyncStorage("email");
  const { setValue } = useAsyncStorage("email");

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm({
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
    resolver: zodResolver(createNewPasswordSchema),
    mode: "onChange",
  });

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const onSubmit = async (values: CreatePasswordFormType) => {
    try {
      const response = await resetPassword({
        email: resetPasswordEmail || "",
        password: values.newPassword,
      }).unwrap();

      if (response) {
        setIsVisible(true);
        await setValue("");
      } else {
        // Fallback for unexpected API response
        showError(t("common.error"), t("common.somethingWentWrong"));
      }
    } catch (error: any) {
      showError(
        t("common.error"),
        error?.data?.message || t("createNewPasswordScreen.resetFailed") // <-- Translated fallback error
      );
    }
  };

  const router = useRouter();

  const handleProceed = () => {
    router.push("/(auth)/login");
  };

  return (
    <AuthLayout back>
      <View className={`flex-1 pt-6 ${isTablet ? "px-10" : "px-5"}`}>
        <Text
          className={`${
            isTablet ? "text-3xl" : "text-2xl"
          } font-semibold text-textPrimary`}
        >
          {t("createNewPasswordScreen.title")} {/* <-- Translated Title */}
        </Text>
        <Text
          className={`${isTablet ? "text-xl" : "text-lg"} pt-2 text-[#666666] mb-5`}
        >
          {t("createNewPasswordScreen.instruction")}{" "}
          {/* <-- Translated Instruction */}
        </Text>
        <View className="gap-5 mt-6">
          <FormInput
            label={t("createNewPasswordScreen.newPasswordLabel")}
            control={control}
            name="newPassword"
            placeholder={t("auth.passwordPlaceholder")}
            rules={{ required: t("auth.passwordRequired") }}
            secureTextEntry={true}
            showPasswordIcon={true}
          />
          <FormInput
            label={t("createNewPasswordScreen.confirmPasswordLabel")}
            control={control}
            name="confirmPassword"
            placeholder={t("auth.passwordPlaceholder")}
            rules={{ required: t("auth.passwordRequired") }}
            secureTextEntry={true}
            showPasswordIcon={true}
          />
          <View className="w-full items-center justify-center mt-5">
            <CustomButton
              onPress={handleSubmit(onSubmit)}
              containerClassName="w-[95%]"
              disabled={!isValid}
              title={t("common.continue")}
              loading={isLoading}
            />
          </View>
        </View>
      </View>
      <SuccessModal
        isVisible={isVisible}
        btnText={t("auth.logIn")}
        title={t("createNewPasswordScreen.successTitle")}
        desc={t("createNewPasswordScreen.successDesc")}
        onClose={() => setIsVisible(false)}
        onProceed={handleProceed}
      />
    </AuthLayout>
  );
};

export default CreateNewPassword;
