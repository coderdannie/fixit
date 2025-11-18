import CustomButton from "@/components/CustomButton";
import Icon from "@/components/Icon";
import { isTablet } from "@/utils/utils";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, { forwardRef, useCallback, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

interface DeleteAccountBottomSheetProps {
  onConfirm: (password: string) => void;
  onClose?: () => void;
}

const DeleteAccountBottomSheet = forwardRef<
  BottomSheet,
  DeleteAccountBottomSheetProps
>(({ onConfirm, onClose }, ref) => {
  const snapPoints = React.useMemo(() => ["36%"], []);
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        setPassword("");
        setShowPassword(false);
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
    if (password.trim()) {
      onConfirm(password);
      setPassword("");
      setShowPassword(false);
      if (ref && "current" in ref && ref.current) {
        ref.current.close();
      }
    }
  };

  const handleClose = useCallback((): void => {
    setPassword("");
    setShowPassword(false);
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
        <View className="flex-row items-center justify-between px-6 py-4 ">
          <Pressable onPress={handleClose} className="p-2  ml-auto">
            <Icon type="Ionicons" name="close" size={24} color="#000" />
          </Pressable>
        </View>

        {/* Content */}
        <View className={`flex-1 ${isTablet ? "px-8 py-2" : "px-6 "}`}>
          <Text
            className={`text-gray-900 font-semibold  mb-6 ${
              isTablet ? "text-lg leading-7" : "text-base leading-6"
            }`}
          >
            Please confirm that you want to delete your account
          </Text>

          {/* Password Input Section */}
          <View className="mb-6">
            <Text
              className={`text-[#191919] mb-2 ${
                isTablet ? "text-base" : "text-sm"
              }`}
            >
              Enter Your Password to Continue
            </Text>

            <View className="relative">
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Enter password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showPassword}
                className={`border border-gray-300 rounded-full pr-12 py-4 px-4 font-system ${
                  isTablet ? "text-base" : "text-sm"
                }`}
              />

              {/* Eye Icon */}
              <Pressable
                onPress={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -mt-3 w-6 h-6 items-center justify-center"
              >
                <Icon
                  type="Ionicons"
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color="#9CA3AF"
                />
              </Pressable>
            </View>
          </View>

          {/* Delete Button */}
          <CustomButton
            title="Delete My Account"
            onPress={handleConfirm}
            disabled={!password.trim()}
            containerClassName="!bg-[#CC0000] mt-4"
            isCustomDisabled
          />
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
});

DeleteAccountBottomSheet.displayName = "DeleteAccountBottomSheet";
export default DeleteAccountBottomSheet;
