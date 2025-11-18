import CustomButton from "@/components/CustomButton";
import Icon from "@/components/Icon";
import { isTablet } from "@/utils/utils";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, { forwardRef, useCallback } from "react";
import { Pressable, Text, View } from "react-native";

interface LogoutBottomSheetProps {
  onConfirm: () => void;
  onClose?: () => void;
}

const LogoutBottomSheet = forwardRef<BottomSheet, LogoutBottomSheetProps>(
  ({ onConfirm, onClose }, ref) => {
    const snapPoints = React.useMemo(() => ["41%"], []);

    const handleSheetChanges = useCallback(
      (index: number) => {
        if (index === -1) {
          onClose?.();
        }
      },
      [onClose]
    );

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.5}
          pressBehavior="close"
        />
      ),
      []
    );

    const handleConfirm = (): void => {
      onConfirm();
      if (ref && "current" in ref && ref.current) {
        ref.current.close();
      }
    };

    const handleClose = useCallback((): void => {
      if (ref && "current" in ref && ref.current) {
        ref.current.close();
      }
    }, [ref]);

    return (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        enablePanDownToClose
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
      >
        <BottomSheetView style={{ flex: 1 }}>
          {/* Header */}
          <View className="justify-end px-6 ">
            <Pressable onPress={handleClose} className="p-2 ml-auto">
              <Icon type="Ionicons" name="close" size={24} color="#666" />
            </Pressable>
          </View>

          {/* Content */}
          <View className={`flex-1 ${isTablet ? "px-8 py-6" : "px-6 py-6"}`}>
            {/* Title */}
            <Text
              className={`text-gray-900 font-semibold mb-4 ${
                isTablet ? "text-lg leading-7" : "text-base leading-6"
              }`}
            >
              Are you sure you want to log out?
            </Text>

            {/* Information Text */}
            <View className="mb-8">
              <Text
                className={`text-gray-600 ${
                  isTablet ? "text-base leading-6" : "text-sm leading-5"
                }`}
              >
                You'll be signed out of your FIXIT account on this device. Your
                ongoing jobs, diagnostic sessions, and AI Copilot activity will
                be paused, but your data will remain saved.
              </Text>
            </View>

            {/* Action Buttons Container */}
            <View className="flex-row justify-between  gap-4">
              {/* Cancel Button */}
              <View className="flex-1">
                <CustomButton
                  title="Cancel"
                  onPress={handleClose}
                  containerClassName="!bg-white"
                  textClassName="!text-primary"
                />
              </View>

              {/* Confirm/Logout Button */}
              <View className="flex-1">
                <CustomButton
                  title="Log Out"
                  onPress={handleConfirm}
                  containerClassName="bg-red-600"
                />
              </View>
            </View>
          </View>
        </BottomSheetView>
      </BottomSheet>
    );
  }
);

LogoutBottomSheet.displayName = "LogoutBottomSheet";
export default LogoutBottomSheet;
