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
    </Stack>
  );
};

export default AuthStack;
