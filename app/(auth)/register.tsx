import {
  useGoogleSigninAndSignUpMutation,
  useSignUpMutation,
} from "@/apis/authQuery";
import CustomButton from "@/components/CustomButton";
import FormInput from "@/components/FormInput";
import { useAsyncStorage } from "@/hooks/useAsyncStorage";
import useAuthUser from "@/hooks/useAuthUser";
import useToast from "@/hooks/useToast";
import AuthLayout from "@/layout/AuthLayout";
import { isTablet } from "@/utils/utils";
import { RegisterFormType, registerSchema } from "@/utils/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Image,
  Linking,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const Register = () => {
  const { t } = useTranslation();
  const { updateAuthUser } = useAuthUser();
  const { showSuccess, showError } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm({
    defaultValues: {
      firstName: "Dannie",
      lastName: "Emmanuel",
      email: "dannie@yopmail.com",
      password: "Dannie123#%",
      agreeToTermsAndCondition: false,
    },
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const agreedToTerms = watch("agreeToTermsAndCondition");

  const [signUpEmail, { isLoading }] = useSignUpMutation();
  const [googleSignInSignUp, { isLoading: isGoogleloading }] =
    useGoogleSigninAndSignUpMutation();

  const router = useRouter();

  const { setValue } = useAsyncStorage("email");
  const { setValue: setValueType } = useAsyncStorage("type");

  const onSubmit = async (values: RegisterFormType) => {
    console.log(values);
    try {
      const response = await signUpEmail(values).unwrap();

      if (response) {
        updateAuthUser({
          data: response?.data,
          accessToken: response.data?.token?.accessToken,
          expiresIn: response?.data?.expiresIn,
        });
        showSuccess(
          "Success",
          response.message || t("auth.accountCreatedSuccess")
        );
        router.push("/(auth)/verify-email");
        await setValue(values.email);
        await setValueType("email");
      } else {
        showError("Error", `Unexpected status: ${response.status}`);
      }
    } catch (error: any) {
      showError("Error", error?.data?.message || "Something went wrong");
    }
  };

  const onGoogleSignUp = async () => {
    setIsSubmitting(true);

    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();

      if (!isSuccessResponse(response)) {
        return;
      }
      const { idToken } = response.data;
      try {
        const googleRes = await googleSignInSignUp({
          idToken,
        }).unwrap();
        const user = googleRes.data.user;
        const steps = googleRes?.data?.onboarding?.steps;

        console.log("user", googleRes);
        updateAuthUser({
          data: googleRes?.data,
          accessToken: googleRes.data.token.accessToken,
          expiresIn: googleRes.data.expiresIn,
        });

        if (googleRes.data?.onboarding?.role === "MECHANIC") {
          if (!steps?.selectUserRole?.completed) {
            router.push("/(auth)/account_type");
          } else if (!steps?.mechanicProfileSetup?.completed) {
            router.push("/mechanic-profile-setup");
          } else if (!steps?.mechanicProfilePicture?.completed) {
            router.push("/upload-profile-picture");
          } else if (!steps?.mechanicServices?.completed) {
            router.push("/service");
          } else if (!steps?.userSettings?.completed) {
            router.push("/stay_connected");
          } else {
            router.push("/(tabs)/home");
          }
        }
      } catch (apiError: any) {
        console.error("API error:", apiError);
        showError(
          "Sign-up Error",
          apiError?.data?.message ?? "An unexpected error occurred"
        );
      }
    } catch (err: any) {
      // Google Sign-In errors
      if (isErrorWithCode(err)) {
        switch (err.code) {
          case statusCodes.IN_PROGRESS:
            console.warn("Google Sign-In already in progress");
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            console.warn("Google Play Services not available");
            break;
          default:
            console.error("Google Sign-In failed:", err);
        }
      } else {
        console.error("Unknown error during Google Sign-In:", err);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTermsPress = () => {
    // Replace with your actual terms URL
    Linking.openURL("https://fixit.com/terms");
  };

  const handlePrivacyPress = () => {
    // Replace with your actual privacy policy URL
    Linking.openURL("https://fixit.com/privacy");
  };

  const onLoginPress = () => {
    console.log("Navigate to login");
    router.push("/(auth)/login");
  };

  return (
    <AuthLayout>
      <View className={`flex-1 ${isTablet ? "px-10" : "px-5"}`}>
        <Text
          className={`${
            isTablet ? "text-3xl" : "text-2xl"
          } font-semibold text-textPrimary text-center`}
        >
          {t("auth.signUpTitle")}
        </Text>

        <View className="gap-5 mt-6">
          <FormInput
            label={t("auth.firstName")}
            control={control}
            name="firstName"
            placeholder={t("auth.firstNamePlaceholder")}
            rules={{ required: t("auth.firstNameRequired") }}
          />
          <FormInput
            label={t("auth.lastName")}
            control={control}
            name="lastName"
            placeholder={t("auth.lastNamePlaceholder")}
            rules={{ required: t("auth.lastNameRequired") }}
          />
          <FormInput
            label={t("auth.emailLabel")}
            control={control}
            name="email"
            placeholder={t("auth.emailPlaceholder")}
            rules={{ required: t("auth.emailRequired") }}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <FormInput
            label={t("auth.choosePassword")}
            control={control}
            name="password"
            placeholder={t("auth.passwordPlaceholder")}
            rules={{ required: t("auth.passwordRequired") }}
            secureTextEntry={true}
            showPasswordIcon={true}
          />
        </View>

        {/* Terms and Conditions Checkbox */}
        <Controller
          control={control}
          name="agreeToTermsAndCondition"
          render={({ field: { onChange, value } }) => (
            <View className="mt-5 items-center">
              <TouchableOpacity
                onPress={() => onChange(!value)}
                className="flex-row items-center justify-center"
                activeOpacity={0.9}
              >
                <View
                  className={`w-5 h-5 rounded border-2 items-center justify-center mr-3 ${
                    value
                      ? "bg-primary border-primary"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  {value && (
                    <Text className="text-white text-xs font-bold">✓</Text>
                  )}
                </View>
                <Text className="text-textPrimary">
                  {t("auth.agreeToTerms")}{" "}
                  <Text
                    className="text-primary font-medium"
                    onPress={handleTermsPress}
                  >
                    {t("auth.terms")}
                  </Text>{" "}
                  {t("auth.and")}{" "}
                  <Text
                    className="text-primary font-medium"
                    onPress={handlePrivacyPress}
                  >
                    {t("auth.privacyPolicy")}
                  </Text>
                </Text>
              </TouchableOpacity>
              {errors.agreeToTermsAndCondition && (
                <Text className="text-red-500 text-xs mt-1 text-center">
                  {errors.agreeToTermsAndCondition.message}
                </Text>
              )}
            </View>
          )}
        />

        {/* Continue Button */}
        <View className="w-full items-center justify-center mt-[22px]">
          <CustomButton
            onPress={handleSubmit(onSubmit)}
            containerClassName="w-[95%]"
            disabled={!isValid}
            title={t("common.continue")}
            loading={isLoading}
          />
        </View>

        {/* Divider */}
        <View className="flex-row items-center justify-center my-5">
          <View className="flex-1 h-px bg-[#E6E6E6]" />
          <Text className="mx-4 text-[#9099A2] font-normal">
            {t("common.or")}
          </Text>
          <View className="flex-1 h-px bg-[#E6E6E6]" />
        </View>

        {/* Google Sign Up Button */}
        <View className="w-full items-center justify-center">
          <TouchableOpacity
            onPress={onGoogleSignUp}
            className="w-[95%] bg-white border border-[#E6E6E6] rounded-full py-4 px-6 flex-row items-center justify-center"
            style={{
              minHeight: 52,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.1,
              shadowRadius: 2,
              elevation: 2,
            }}
            activeOpacity={0.8}
          >
            {isGoogleloading ? (
              <>
                <ActivityIndicator color={"#F23A4A"} size="small" />
                <Text
                  className={` ${
                    isTablet ? "text-xl" : "text-base"
                  } font-semibold text-textPrimary text-center `}
                >
                  {t("common.pleaseWait")}
                </Text>
              </>
            ) : (
              <>
                <Image
                  source={require("../../assets/images/google.png")}
                  className={`${isTablet ? "" : "w-6 h-6"}`}
                  resizeMode="cover"
                />
                <Text
                  className={` ${
                    isTablet ? "text-xl" : "text-base"
                  } ml-3 text-base text-textPrimary font-semibold`}
                >
                  {t("auth.signUpWithGoogle")}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Login Link */}
        <View className="flex-row items-center justify-center mt-8 mb-6">
          <Text className="text-gray-600 font-normal">
            {t("auth.haveAccount")}{" "}
          </Text>
          <TouchableOpacity onPress={onLoginPress} activeOpacity={0.7}>
            <Text className="text-primary font-medium">{t("auth.logIn")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </AuthLayout>
  );
};

export default Register;
