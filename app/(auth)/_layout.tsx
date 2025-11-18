import { Stack } from "expo-router";
import React from "react";

const AuthStack = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="account_type" />
      <Stack.Screen name="create-new-password" />
      <Stack.Screen name="forgot_password" />
      <Stack.Screen name="login" />
      <Stack.Screen name="mechanic-profile-setup" />
      <Stack.Screen name="register" />
      <Stack.Screen name="service" />
      <Stack.Screen name="stay_connected" />
      <Stack.Screen name="upload-profile-picture" />
      <Stack.Screen name="vehicle-owner" />
      <Stack.Screen name="verify-email" />
    </Stack>
  );
};

export default AuthStack;
