import { useSignUpMutation } from "@/apis/authQuery";
import CustomButton from "@/components/CustomButton";
import FormInput from "@/components/FormInput";
import { useAsyncStorage } from "@/hooks/useAsyncStorage";
import useAuthUser from "@/hooks/useAuthUser";
import useToast from "@/hooks/useToast";
import AuthLayout from "@/layout/AuthLayout";
import { isTablet } from "@/utils/utils";
import { RegisterFormType, registerSchema } from "@/utils/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Image, Linking, Text, TouchableOpacity, View } from "react-native";

const Register = () => {
  const { updateAuthUser } = useAuthUser();
  const { showSuccess, showError } = useToast();

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
          response.message || "Account created successfully"
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

  const handleTermsPress = () => {
    // Replace with your actual terms URL
    Linking.openURL("https://fixit.com/terms");
  };

  const handlePrivacyPress = () => {
    // Replace with your actual privacy policy URL
    Linking.openURL("https://fixit.com/privacy");
  };

  const onGoogleSignUp = () => {
    console.log("Google sign up pressed");
    // Implement Google sign up logic here
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
          Create a Fixit Account
        </Text>

        <View className="gap-5 mt-6">
          <FormInput
            label="First Name"
            control={control}
            name="firstName"
            placeholder="Enter your first name"
            rules={{ required: "Please enter your first name" }}
          />
          <FormInput
            label="Last Name"
            control={control}
            name="lastName"
            placeholder="Enter your last name"
            rules={{ required: "Please enter your last name" }}
          />
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
            label="Choose a Password"
            control={control}
            name="password"
            placeholder="Enter password"
            rules={{ required: "Password must min.8 characters" }}
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
                  I agree to FIXIT's{" "}
                  <Text
                    className="text-primary font-medium"
                    onPress={handleTermsPress}
                  >
                    Terms
                  </Text>
                  {" & "}
                  <Text
                    className="text-primary font-medium"
                    onPress={handlePrivacyPress}
                  >
                    Privacy Policy
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
            title="Continue"
            loading={isLoading}
          />
        </View>

        {/* Divider */}
        <View className="flex-row items-center justify-center my-5">
          <View className="flex-1 h-px bg-[#E6E6E6]" />
          <Text className="mx-4 text-[#9099A2] font-normal">or</Text>
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
            <Image source={require("../../assets/images/google.png")} />
            <Text className="ml-3 text-base text-textPrimary">
              Sign up with Google
            </Text>
          </TouchableOpacity>
        </View>

        {/* Login Link */}
        <View className="flex-row items-center justify-center mt-8 mb-6">
          <Text className="text-gray-600 font-normal">
            Already have an account?{" "}
          </Text>
          <TouchableOpacity onPress={onLoginPress} activeOpacity={0.7}>
            <Text className="text-primary font-medium">Log In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </AuthLayout>
  );
};

export default Register;
