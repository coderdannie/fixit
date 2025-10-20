import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  containerStyle?: object;
  titleStyle?: object;
  subtitleStyle?: object;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  subtitle,
  containerStyle,
  titleStyle,
  subtitleStyle,
}) => (
  <View style={[styles.emptyContainer, containerStyle]}>
    {icon && <View style={styles.iconContainer}>{icon}</View>}
    <Text style={[styles.emptyTitle, titleStyle]}>{title}</Text>
    {subtitle && (
      <Text style={[styles.emptySubtitle, subtitleStyle]}>{subtitle}</Text>
    )}
  </View>
);

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  iconContainer: {
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },
});

export default EmptyState;
