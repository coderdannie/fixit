import { Stack } from "expo-router";
import React from "react";

export default function Jobs() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="uploadID" />
    </Stack>
  );
}
