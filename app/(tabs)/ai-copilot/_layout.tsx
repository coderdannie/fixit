import { Stack } from "expo-router";
import React from "react";

export default function BotLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="chat-history" />
    </Stack>
  );
}
