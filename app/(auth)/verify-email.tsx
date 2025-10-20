import { useResendOtpMutation, useVerifyCodeMutation } from "@/apis/authQuery";
import CustomButton from "@/components/CustomButton";
import SuccessModal from "@/components/modals/SuccessModal";
import { useAsyncStorage } from "@/hooks/useAsyncStorage";
import useToast from "@/hooks/useToast";
import AuthLayout from "@/layout/AuthLayout";
import { isTablet } from "@/utils/utils";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { OtpInput } from "react-native-otp-entry";

const VerifyEmail = () => {
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

  console.log("active", email);

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
      setError("Please enter a complete 4-digit code");
      return;
    }

    try {
      const response = await verifyUserCode({
        email: email || "",
        otpCode: otp,
      }).unwrap();

      if (response) {
        showSuccess("Success", response.message || "Verification successful");

        if (type === "password") {
          handleProceed();
        } else {
          setIsVisible(true);
        }
      } else {
        showError("Error", `Unexpected status: ${response.status}`);
      }
    } catch (error: any) {
      showError(
        "Error",
        error?.data?.message || "Invalid verification code. Please try again."
      );
      setError(error?.data?.message || "Invalid code");
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
          "Code Resent",
          response.message ||
            "A new verification code has been sent to your email"
        );
        setIsTimerActive(true);
        setCountdown(60);
        setError("");
        setOtp("");
      }
    } catch (error: any) {
      showError(
        "Error",
        error?.data?.message || "Failed to resend code. Please try again."
      );
    }
  };

  const handleOtpChange = (text: string) => {
    setOtp(text);
    if (error) setError("");
  };

  const handleOtpFilled = (text: string) => {
    setOtp(text);
    // Optionally auto-verify when filled
    // verifyCode();
  };

  return (
    <AuthLayout back>
      <View className={`flex-1 pt-6 ${isTablet ? "px-10" : "px-5"}`}>
        <Text
          className={`${
            isTablet ? "text-3xl" : "text-2xl"
          } font-semibold text-textPrimary`}
        >
          {type === "password" ? "Reset Password" : "Verification"}
        </Text>
        <Text
          className={`${isTablet ? "text-xl" : "text-lg"} pt-2 text-[#666666] mb-5`}
        >
          {type === "password"
            ? `Please enter the 4-digit code we sent to ${email} to reset your password`
            : `For your security, please enter the 4-digit code we sent to ${email}`}
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
            <Text className="text-[#666666]">You can resend code in </Text>
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
            Resend Code
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
            title="Verify"
            loading={isLoading}
          />
        </View>
      </View>

      <SuccessModal
        isVisible={isVisible}
        btnText="Log In"
        title="Email Verification Successful"
        desc="Your email has been successfully verified. You can now log in and start using your account"
        onClose={() => setIsVisible(false)}
        onProceed={() => router.push("/(auth)/login")}
      />
    </AuthLayout>
  );
};

export default VerifyEmail;
