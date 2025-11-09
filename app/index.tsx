import { useGetOnboardingStageQuery } from "@/apis/accountSetupQuery";
import useAuthUser from "@/hooks/useAuthUser";
import useOnboarding from "@/hooks/useOnboarding";
import { Redirect } from "expo-router";
import React from "react";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const { authUser } = useAuthUser();
  const { isOnboarded } = useOnboarding();

  const accessToken = authUser?.accessToken;
  const onboardingCompleted = authUser?.data?.onboarding?.onboardingCompleted;

  // Only fetch onboarding if logged in AND onboarding not completed
  const shouldFetchOnboarding = accessToken && !onboardingCompleted;

  const { data: onboardingData, isLoading } = useGetOnboardingStageQuery(
    undefined,
    { skip: !shouldFetchOnboarding }
  );

  const steps =
    onboardingData?.data?.steps || authUser?.data?.onboarding?.steps;

  console.log("steps", steps);
  // Handle non-authenticated states first (no loading needed)
  if (!isOnboarded) {
    return <Redirect href="/onboarding" />;
  }

  if (!accessToken) {
    return <Redirect href="/login" />;
  }

  // Show loading only when we're actually fetching onboarding data
  if (shouldFetchOnboarding && isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#222883" />
      </View>
    );
  }

  if (onboardingCompleted) {
    return <Redirect href="/(tabs)/home" />;
  }

  // Determine which step to redirect to
  if (!steps?.selectUserRole?.completed) {
    return <Redirect href="/account_type" />;
  }

  if (!steps?.mechanicProfileSetup?.completed) {
    return <Redirect href="/mechanic-profile-setup" />;
  }

  if (!steps?.mechanicProfilePicture?.completed) {
    return <Redirect href="/upload-profile-picture" />;
  }

  if (!steps?.mechanicServices?.completed) {
    return <Redirect href="/service" />;
  }

  if (!steps?.userSettings?.completed) {
    return <Redirect href="/stay_connected" />;
  }

  // All steps completed, go home
  return <Redirect href="/upload-profile-picture" />;
}
