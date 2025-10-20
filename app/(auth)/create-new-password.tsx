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
import { Text, View } from "react-native";

const CreateNewPassword = () => {
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
        showError("Error", `Unexpected status: ${response.status}`);
      }
    } catch (error: any) {
      showError(
        "Error",
        error?.data?.message || "Failed to reset password. Please try again."
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
          Create a new password
        </Text>
        <Text
          className={`${isTablet ? "text-xl" : "text-lg"} pt-2 text-[#666666] mb-5`}
        >
          Enter a strong password to secure your account. Pick a secure password
          you will remember.
        </Text>
        <View className="gap-5 mt-6">
          <FormInput
            label="Create New Password"
            control={control}
            name="newPassword"
            placeholder="min. 8 characters"
            rules={{ required: "Password must min.8 characters" }}
            secureTextEntry={true}
            showPasswordIcon={true}
          />
          <FormInput
            label="Confirm New Password"
            control={control}
            name="confirmPassword"
            placeholder="min. 8 characters"
            rules={{ required: "Password must min.8 characters" }}
            secureTextEntry={true}
            showPasswordIcon={true}
          />
          <View className="w-full items-center justify-center mt-5">
            <CustomButton
              onPress={handleSubmit(onSubmit)}
              containerClassName="w-[95%]"
              disabled={!isValid}
              title="Continue"
              loading={isLoading}
            />
          </View>
        </View>
      </View>
      <SuccessModal
        isVisible={isVisible}
        btnText="Log In"
        title="Password Reset Successful"
        desc="You can now log in with your new password."
        onClose={() => setIsVisible(false)}
        onProceed={handleProceed}
      />
    </AuthLayout>
  );
};

export default CreateNewPassword;
