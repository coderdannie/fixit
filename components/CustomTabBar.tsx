import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useSegments } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "./Icon";

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);
const AnimatedSafeAreaView = Animated.createAnimatedComponent(SafeAreaView);

const CustomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const segment = useSegments();

  const page = segment[segment.length - 1];

  const pagesToHideTabBar = ["home", "job-history", "account"];
  const shouldHide = pagesToHideTabBar.includes(page);

  if (!shouldHide) return null;

  return (
    <AnimatedSafeAreaView
      edges={["bottom"]}
      style={styles.safeArea}
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(200)}
    >
      <Animated.View
        style={styles.container}
        entering={FadeIn.duration(200)}
        exiting={FadeOut.duration(200)}
      >
        {state.routes.map((route, index) => {
          if (["_sitemap", "+not-found"].includes(route.name)) return null;

          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
                ? options.title
                : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          return (
            <AnimatedTouchableOpacity
              layout={LinearTransition.springify().mass(0.5)}
              key={route.key}
              onPress={onPress}
              style={[styles.tabItem, { width: isFocused ? null : 52 }]}
              activeOpacity={10}
            >
              <View style={isFocused && styles.iconActiveBg}>
                {getIconByRouteName(
                  route.name,
                  isFocused ? "white" : "#666666"
                )}
              </View>

              {isFocused && (
                <Animated.Text
                  entering={FadeIn.duration(200)}
                  exiting={FadeOut.duration(200)}
                  style={styles.text}
                >
                  {label as string}
                </Animated.Text>
              )}
            </AnimatedTouchableOpacity>
          );
        })}
      </Animated.View>
    </AnimatedSafeAreaView>
  );

  function getIconByRouteName(routeName: string, color: string) {
    switch (routeName) {
      case "home":
        return <Icon type="Feather" name="home" color={color} size={24} />;
      case "ai-copilot":
        return (
          <Icon type="Octicons" name="dependabot" color={color} size={24} />
        );
      case "job-history":
        return (
          <Icon type="MaterialIcons" name="history" color={color} size={24} />
        );
      case "account":
        return (
          <Icon
            type="MaterialCommunityIcons"
            name="account-circle-outline"
            color={color}
            size={24}
          />
        );
      default:
        return <Icon type="Feather" name="home" color={color} size={24} />;
    }
  }
};

export default CustomTabBar;

const styles = StyleSheet.create({
  safeArea: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFF",
  },
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFF",
    alignSelf: "center",
    gap: 30,
    borderRadius: 40,
    paddingHorizontal: 12,
    paddingTop: 15,
    paddingBottom: 0,
  },
  tabItem: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 52,
    gap: 6,
    backgroundColor: "#F2F2F2",
    borderRadius: 100,
    paddingHorizontal: 6,
  },
  text: {
    color: "#191919",
    fontWeight: "500",
  },
  iconActiveBg: {
    backgroundColor: "#2964C2",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    width: 42,
    height: 42,
  },
});
