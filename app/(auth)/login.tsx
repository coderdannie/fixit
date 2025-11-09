import {
  useGoogleSigninAndSignUpMutation,
  useLoginMutation,
} from "@/apis/authQuery";
import CustomButton from "@/components/CustomButton";
import FormInput from "@/components/FormInput";
import useAuthUser from "@/hooks/useAuthUser";
import useToast from "@/hooks/useToast";
import AuthLayout from "@/layout/AuthLayout";
import { isTablet } from "@/utils/utils";
import { LoginFormType, loginSchema } from "@/utils/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Image,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const Login = () => {
  const { updateAuthUser } = useAuthUser();

  const [googleSignInSignUp, { isLoading: isGoogleloading }] =
    useGoogleSigninAndSignUpMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      email: "dannie2@yopmail.com",
      password: "Dannie123#%",
    },
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const router = useRouter();
  const [login, { isLoading }] = useLoginMutation();

  const { showSuccess, showError } = useToast();

  const onSubmit = async (data: LoginFormType) => {
    try {
      const res = await login(data).unwrap();
      const steps = res?.data?.onboarding?.steps;
      console.log("res", res);
      updateAuthUser({
        data: res.data,
        accessToken: res?.data?.token?.accessToken,
        expiresIn: res.data.expiresIn,
      });
      if (res) {
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
    } catch (error: any) {
      showError("Error", error?.data?.message || "An error occurred");
    }
  };

  const onGoogleSignIn = async () => {
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
          } else if (steps?.mechanicServices?.completed) {
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
          "Sign-in Error",
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

  const onLoginPress = () => {
    router.push("/(auth)/register");
  };

  const onForgotPassPress = () => {
    router.push("/(auth)/forgot_password");
  };
  return (
    <AuthLayout>
      <View className={`flex-1 ${isTablet ? "px-10" : "px-5"}`}>
        <Text
          className={`${
            isTablet ? "text-3xl" : "text-2xl"
          } font-semibold text-textPrimary text-center`}
        >
          Log In to Your Fixit Account
        </Text>

        <View className="gap-5 mt-6">
          <FormInput
            label="Email Address"
            control={control}
            name="email"
            placeholder="Enter your email name"
            rules={{ required: "Please enter your email address" }}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <FormInput
            label="Enter Your Password"
            control={control}
            name="password"
            placeholder="Enter password"
            rules={{ required: "Password must min.8 characters" }}
            secureTextEntry={true}
            showPasswordIcon={true}
          />
        </View>
        <View>
          <Pressable onPress={onForgotPassPress}>
            <Text className="text-primary text-right">Forgot Password?</Text>
          </Pressable>
        </View>
        <CustomButton
          onPress={handleSubmit(onSubmit)}
          containerClassName="w-[95%] mt-[30px]"
          disabled={!isValid}
          title="Log In"
          loading={isLoading}
        />
        {/* Divider */}
        <View className="flex-row items-center justify-center my-5">
          <View className="flex-1 h-px bg-[#E6E6E6]" />
          <Text className="mx-4 text-[#9099A2] font-normal">or</Text>
          <View className="flex-1 h-px bg-[#E6E6E6]" />
        </View>

        {/* Google Sign Up Button */}
        <View className="w-full items-center justify-center">
          <TouchableOpacity
            onPress={onGoogleSignIn}
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
                  Please wait...
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
                  } ml-3 text-base  text-textPrimary font-semibold`}
                >
                  Continue With Google
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Login Link */}
        <View className="flex-row items-center justify-center mt-8 mb-6">
          <Text className="text-gray-600 font-normal">
            Do not have an account?{" "}
          </Text>
          <TouchableOpacity onPress={onLoginPress} activeOpacity={0.7}>
            <Text className="text-primary font-medium">Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </AuthLayout>
  );
};

export default Login;
