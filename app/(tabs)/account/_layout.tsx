import { Stack } from "expo-router";
import React from "react";

export default function AccountLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="notification-settings" />{" "}
      <Stack.Screen name="delete-account" />
    </Stack>
  );
}
