import { useResendOtpMutation, useVerifyCodeMutation } from "@/apis/authQuery";
import CustomButton from "@/components/CustomButton";
import SuccessModal from "@/components/modals/SuccessModal";
import { useAsyncStorage } from "@/hooks/useAsyncStorage";
import useToast from "@/hooks/useToast";
import AuthLayout from "@/layout/AuthLayout";
import { isTablet } from "@/utils/utils";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Text, View } from "react-native";
import { OtpInput } from "react-native-otp-entry";

const VerifyEmail = () => {
  const { t } = useTranslation();
  const [otp, setOtp] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [countdown, setCountdown] = useState<number>(0);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState(false);
  const { showSuccess, showError } = useToast();

  const [verifyUserCode, { isLoading }] = useVerifyCodeMutation();
  const [resendOtpMutation, { isLoading: isResending }] =
    useResendOtpMutation();

  const { storedValue: email } = useAsyncStorage("email");
  const { storedValue: type } = useAsyncStorage("type");

  const router = useRouter();

  useEffect(() => {
    if (!isTimerActive) return;

    const intervalId = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(intervalId);
          setIsTimerActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isTimerActive]);

  const formatCountdown = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const isButtonDisabled = () => {
    return otp.length !== 4 || isLoading;
  };

  const handleProceed = () => {
    router.push("/(auth)/create-new-password");
  };

  const verifyCode = async () => {
    if (otp.length !== 4) {
      setError(t("verifyCodeScreen.incompleteCodeError")); // <-- Translated Error
      return;
    }

    try {
      const response = await verifyUserCode({
        email: email || "",
        otpCode: otp,
      }).unwrap();

      if (response) {
        showSuccess(
          t("common.success"), // <-- Translated Success Title
          response.message || t("verifyCodeScreen.verificationSuccess") // <-- Translated Message
        );

        if (type === "password") {
          handleProceed();
        } else {
          setIsVisible(true);
        }
      } else {
        // Fallback for non-error status
        showError(t("common.error"), t("common.somethingWentWrong"));
      }
    } catch (error: any) {
      showError(
        t("common.error"),
        error?.data?.message || t("verifyCodeScreen.invalidCodeError") // <-- Translated Error
      );
      setError(error?.data?.message || t("verifyCodeScreen.invalidCodeError")); // <-- Translated Error
    }
  };

  const handleResend = async () => {
    if (isTimerActive || isResending || countdown > 0) return;

    try {
      const response = await resendOtpMutation({
        email: email || "",
      }).unwrap();

      if (response) {
        showSuccess(
          t("verifyCodeScreen.codeResentTitle"), // <-- Translated Title
          response.message || t("verifyCodeScreen.codeResentSuccess") // <-- Translated Message
        );
        setIsTimerActive(true);
        setCountdown(60);
        setError("");
        setOtp("");
      }
    } catch (error: any) {
      showError(
        t("common.error"),
        error?.data?.message || t("verifyCodeScreen.resendFailed") // <-- Translated Error
      );
    }
  };

  const handleOtpChange = (text: string) => {
    setOtp(text);
    if (error) setError("");
  };

  const handleOtpFilled = (text: string) => {
    setOtp(text);
    // verifyCode(); // Optional: auto-verify
  };

  // Determine Title and Instruction Text based on 'type'
  const title =
    type === "password"
      ? t("verifyCodeScreen.resetPasswordTitle")
      : t("verifyCodeScreen.verificationTitle");

  const instruction =
    type === "password"
      ? t("verifyCodeScreen.resetInstruction", { email: email })
      : t("verifyCodeScreen.verificationInstruction", { email: email });

  return (
    <AuthLayout back>
      <View className={`flex-1 pt-6 ${isTablet ? "px-10" : "px-5"}`}>
        <Text
          className={`${
            isTablet ? "text-3xl" : "text-2xl"
          } font-semibold text-textPrimary`}
        >
          {title} {/* <-- Translated Title */}
        </Text>
        <Text
          className={`${isTablet ? "text-xl" : "text-lg"} pt-2 text-[#666666] mb-5`}
        >
          {instruction} {/* <-- Translated Instruction */}
        </Text>

        <View className="w-full">
          <OtpInput
            numberOfDigits={4}
            onTextChange={handleOtpChange}
            onFilled={handleOtpFilled}
            autoFocus
            focusColor="#000000"
            secureTextEntry
            theme={{
              containerStyle: {
                marginVertical: 20,
              },
              inputsContainerStyle: {
                flexDirection: "row",
                justifyContent: "space-between",
              },
              pinCodeContainerStyle: {
                backgroundColor: "#F2F2F2",
                borderColor: "#E6E6E6",
                borderWidth: 1,
                borderRadius: 10,
                width: isTablet ? 112 : 55,
                height: isTablet ? 112 : 55,
              },
              pinCodeTextStyle: {
                fontSize: isTablet ? 24 : 30,
                fontWeight: "500",
                color: "#000000",
              },
              filledPinCodeContainerStyle: {
                backgroundColor: "#EAF0FB",
                borderColor: "#2964C2",
              },
              focusStickStyle: {
                backgroundColor: "#000000",
                height: 2,
                width: 20,
              },
              focusedPinCodeContainerStyle: {
                borderColor: "#2964C2",
              },
            }}
          />

          {error ? (
            <Text className="text-red-600 text-sm mt-2 text-center">
              {error}
            </Text>
          ) : null}
        </View>

        {countdown > 0 && (
          <View className="flex-row items-center justify-center">
            <Text className="text-[#666666]">
              {t("verifyCodeScreen.resendTimerLabel")}{" "}
              {/* <-- Translated Timer Label */}
            </Text>
            <Text className="text-primary font-medium">
              {formatCountdown(countdown)}
            </Text>
          </View>
        )}

        <View className="flex-row items-center justify-center mt-5">
          <Text
            onPress={isTimerActive ? undefined : handleResend}
            className={`font-medium text-center ${
              isTimerActive ? "text-gray-400" : "text-primary"
            }`}
          >
            {t("verifyCodeScreen.resendButton")} {/* <-- Translated Button */}
          </Text>
          {isResending && (
            <ActivityIndicator size="small" color="#2964C2" className="ml-2" />
          )}
        </View>

        <View
          className={`${
            isTablet ? "w-full" : "w-full"
          } item-center justify-center mt-40`}
        >
          <CustomButton
            disabled={isButtonDisabled()}
            onPress={verifyCode}
            title={t("verifyCodeScreen.verifyButton")}
            loading={isLoading}
          />
        </View>

        <SuccessModal
          isVisible={isVisible}
          btnText={t("auth.logIn")}
          title={t("verifyCodeScreen.modalSuccessTitle")}
          desc={t("verifyCodeScreen.modalSuccessDesc")}
          onClose={() => setIsVisible(false)}
          onProceed={() => router.push("/(auth)/login")}
        />
      </View>
    </AuthLayout>
  );
};

export default VerifyEmail;
