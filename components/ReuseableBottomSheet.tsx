import Icon, { IconType } from "@/components/Icon";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetProps,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import React, { forwardRef, useCallback, useMemo } from "react";
import { Text, TouchableOpacity, View, ViewStyle } from "react-native";

// Types for different content types
export interface ListItem {
  id: string;
  label: string;
  value?: any;
  icon?: string;
  iconType?: IconType;
  disabled?: boolean;
}

export interface ReusableBottomSheetProps extends Partial<BottomSheetProps> {
  // Content props
  title?: string;
  showHeader?: boolean;
  showCloseButton?: boolean;

  // List props (for list-based content)
  data?: ListItem[];
  selectedValue?: any;
  onItemSelect?: (item: ListItem) => void;
  renderCustomItem?: (item: ListItem, isSelected: boolean) => React.ReactNode;

  // Custom content props (for non-list content)
  children?: React.ReactNode;

  // Styling props
  snapPoints?: string[];
  headerStyle?: ViewStyle;
  contentContainerStyle?: ViewStyle;

  // Behavior props
  enablePanDownToClose?: boolean;
  closeOnBackdrop?: boolean;
  backdropOpacity?: number;

  // Callbacks
  onClose?: () => void;
  onChange?: (index: number) => void;
}

const ReusableBottomSheet = forwardRef<BottomSheet, ReusableBottomSheetProps>(
  (
    {
      // Content props
      title,
      showHeader = true,
      showCloseButton = true,

      // List props
      data,
      selectedValue,
      onItemSelect,
      renderCustomItem,

      // Custom content
      children,

      // Styling props
      snapPoints: customSnapPoints,
      headerStyle,
      contentContainerStyle,

      // Behavior props
      enablePanDownToClose = true,
      closeOnBackdrop = true,
      backdropOpacity = 0.5,

      // Callbacks
      onClose,
      onChange,

      // Rest of BottomSheet props
      ...bottomSheetProps
    },
    ref
  ) => {
    // Default snap points
    const snapPoints = useMemo(
      () => customSnapPoints || ["50%", "80%"],
      [customSnapPoints]
    );

    // Handle sheet changes
    const handleSheetChanges = useCallback(
      (index: number) => {
        onChange?.(index);
        if (index === -1) {
          onClose?.();
        }
      },
      [onChange, onClose]
    );

    // Handle close button press
    const handleClosePress = useCallback(() => {
      if (ref && "current" in ref && ref.current) {
        ref.current.close();
      }
    }, [ref]);

    // Custom backdrop component
    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={backdropOpacity}
          pressBehavior={closeOnBackdrop ? "close" : "none"}
        />
      ),
      [backdropOpacity, closeOnBackdrop]
    );

    // Default list item renderer
    const renderDefaultItem = useCallback(
      (item: ListItem) => {
        const isSelected =
          selectedValue === item.value || selectedValue === item.id;

        return (
          <TouchableOpacity
            key={item.id}
            onPress={() => !item.disabled && onItemSelect?.(item)}
            className={`px-6 py-4 border-b border-gray-100 ${
              item.disabled ? "opacity-50" : ""
            }`}
            activeOpacity={0.7}
            disabled={item.disabled}
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center flex-1">
                {item.icon && (
                  <View className="mr-3">
                    <Icon
                      type={item.iconType || "AntDesign"}
                      name={item.icon}
                      size={20}
                      color={isSelected ? "#2563eb" : "#666"}
                    />
                  </View>
                )}
                <Text
                  className={`text-base ${
                    isSelected
                      ? "font-semibold text-primary"
                      : "text-textPrimary"
                  }`}
                >
                  {item.label}
                </Text>
              </View>
              {isSelected && (
                <Icon type="Feather" name="check" size={20} color="#2563eb" />
              )}
            </View>
          </TouchableOpacity>
        );
      },
      [selectedValue, onItemSelect]
    );

    // List item renderer with custom support
    const renderListItem = useCallback(
      ({ item }: { item: ListItem }) => {
        const isSelected =
          selectedValue === item.value || selectedValue === item.id;

        if (renderCustomItem) {
          return renderCustomItem(item, isSelected);
        }

        return renderDefaultItem(item);
      },
      [selectedValue, renderCustomItem, renderDefaultItem]
    );

    return (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        enablePanDownToClose={enablePanDownToClose}
        backdropComponent={renderBackdrop}
        backgroundStyle={{
          backgroundColor: "white",
          borderRadius: 24,
        }}
        handleIndicatorStyle={{
          backgroundColor: "#D1D5DB",
          width: 40,
          height: 4,
        }}
        style={{
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: -4,
          },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 10,
        }}
        {...bottomSheetProps}
      >
        {/* Header */}
        {showHeader && (
          <View
            className={`flex-row items-center justify-between px-6 py-4 ${
              data || children ? "border-b border-gray-100" : ""
            }`}
            style={headerStyle}
          >
            <Text className="text-xl font-semibold text-gray-900">
              {title || "Select Option"}
            </Text>
            {showCloseButton && (
              <TouchableOpacity
                onPress={handleClosePress}
                className="p-2 -mr-2"
                activeOpacity={0.7}
              >
                <Icon type="Feather" name="x" size={24} color="#666" />
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Content */}
        {data ? (
          // List content
          <BottomSheetFlatList
            data={data}
            renderItem={renderListItem}
            keyExtractor={(item: ListItem) => item.id}
            contentContainerStyle={{
              paddingBottom: 40,
              ...contentContainerStyle,
            }}
            showsVerticalScrollIndicator={false}
          />
        ) : children ? (
          // Custom content
          <BottomSheetScrollView
            contentContainerStyle={{
              paddingBottom: 40,
              ...contentContainerStyle,
            }}
            showsVerticalScrollIndicator={false}
          >
            {children}
          </BottomSheetScrollView>
        ) : null}
      </BottomSheet>
    );
  }
);

ReusableBottomSheet.displayName = "ReusableBottomSheet";

export default ReusableBottomSheet;
