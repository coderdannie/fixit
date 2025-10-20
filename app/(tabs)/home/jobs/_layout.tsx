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
      <Stack.Screen name="upcoming" />
      <Stack.Screen name="request-extension" />
      <Stack.Screen name="set-estimated-time" />
      <Stack.Screen name="start-job" />
      <Stack.Screen name="[id]" />
    </Stack>
  );
}
