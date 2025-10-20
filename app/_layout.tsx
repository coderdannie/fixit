import { persistor, store } from "@/store";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { ActivityIndicator, StatusBar, Text, View } from "react-native";
import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
import { Provider as ReduxProvider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import "../global.css";

SplashScreen.preventAutoHideAsync();

function RootLayout() {
  const [loaded] = useFonts({
    thin: require("../assets/fonts/SourceSans3-Italic-VariableFont_wght.ttf"),
    regular: require("../assets/fonts/SourceSans3-VariableFont_wght.ttf"),
  });

  useEffect(() => {
    GoogleSignin.configure({
      iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID,
      webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
      offlineAccess: false,
      profileImageSize: 150,
    });
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const toastConfig = {
    success: (props: any) => (
      <BaseToast
        {...props}
        style={{ borderLeftColor: "green" }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          fontSize: 14,
          fontWeight: "400",
          fontFamily: "regular",
        }}
        text2NumberOfLines={0}
      />
    ),

    error: (props: any) => (
      <ErrorToast
        {...props}
        style={{ borderLeftColor: "red" }}
        text1Style={{
          fontSize: 14,
          fontWeight: "400",
          fontFamily: "regular",
        }}
        text2Style={{
          fontSize: 12,
        }}
        text2NumberOfLines={0}
      />
    ),

    tomatoToast: ({ text1, props }: any) => (
      <View style={{ height: 60, width: "100%", backgroundColor: "tomato" }}>
        <Text>{text1}</Text>
        <Text>{props.uuid}</Text>
      </View>
    ),
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ReduxProvider store={store}>
        <PersistGate
          loading={
            <View className="flex-1 items-center justify-center bg-white">
              <ActivityIndicator size="large" color="#222883" />
            </View>
          }
          persistor={persistor}
        >
          <Slot />
          <StatusBar backgroundColor="white" />
          <Toast config={toastConfig} />
        </PersistGate>
      </ReduxProvider>
    </GestureHandlerRootView>
  );
}

const AppProvider = () => <RootLayout />;

export default AppProvider;
