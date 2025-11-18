import BackBtn from "@/components/BackBtn";
import CustomButton from "@/components/CustomButton";
import Icon from "@/components/Icon";

import DeleteAccountBottomSheet from "@/components/modals/DeleteAccountModal";
import RequestSentModal from "@/components/modals/RequestSent";
import { isTablet } from "@/utils/utils";
import BottomSheet from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";

import React, { useRef, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface DeleteReason {
  id: string;
  label: string;
}

const DeleteAccount: React.FC = () => {
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [otherReason, setOtherReason] = useState<string>("");
  const [visible, setVisible] = useState(false);
  const deleteAccountRef = useRef<BottomSheet>(null);

  const router = useRouter();
  const reasons: DeleteReason[] = [
    { id: "no-longer-using", label: "I'm no longer using FIXIT" },
    { id: "another-account", label: "I created another account by mistake" },
    { id: "payments-issue", label: "Had issues with payments or withdrawals" },
    { id: "better-alternative", label: "I found a better alternative" },
    {
      id: "issue-not-resolved",
      label: "My issue or complaint was not resolved",
    },
    { id: "others", label: "Others" },
  ];

  const handleContinue = () => {
    if (selectedReason) {
      deleteAccountRef.current?.expand();
    }
  };

  const handleClose = () => {
    setVisible(false);
  };

  const handleNavigate = () => {
    router.push("/(tabs)/home");
    setVisible(false);
  };

  const handleConfirmDelete = (password: string) => {
    // Handle actual delete account action
    console.log("Deleting account with password:", password);
    console.log("Selected reason:", selectedReason);
    if (selectedReason === "others") {
      console.log("Other reason:", otherReason);
    }
    setVisible(true);
    // Add your delete account logic here
  };

  const isButtonDisabled =
    !selectedReason ||
    (selectedReason === "others" && otherReason.trim() === "");

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom", "left"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        className={isTablet ? "px-10 pb-10" : "px-6 pb-10"}
      >
        <View className="pt-6 pb-4">
          <BackBtn isMarginBottom />
        </View>

        <View className="mb-6">
          <Text
            className={`font-semibold text-gray-900 mb-3 ${
              isTablet ? "text-[32px] leading-[40px]" : "text-2xl leading-8"
            }`}
          >
            Deleting your account{"\n"}is permanent
          </Text>
          <Text
            className={`text-gray-600 ${
              isTablet ? "text-base leading-6" : "text-sm leading-5"
            }`}
          >
            Once you delete your FIXIT account, all your data — including job
            history, diagnostic records, AI Copilot history, and subscriptions,
            will be permanently removed. This action cannot be undone.
          </Text>
        </View>

        <View className="mb-6 bg-white rounded-lg shadow-sm shadow-black/5 elevation-5">
          {reasons.map((reason) => (
            <View key={reason.id}>
              <Pressable
                onPress={() => setSelectedReason(reason.id)}
                className={`flex-row items-center border-b border-gray-100 ${
                  isTablet ? "py-5 px-4" : "py-4 px-3"
                }`}
              >
                {selectedReason === reason.id ? (
                  <View className="mr-2">
                    <Icon
                      type="Ionicons"
                      name="checkmark-circle-sharp"
                      color="#2964C2"
                      size={isTablet ? 26 : 22}
                    />
                  </View>
                ) : (
                  <View className="mr-2">
                    <Icon
                      type="FontAwesome"
                      name="circle-thin"
                      color="#2964C2"
                      size={isTablet ? 26 : 22}
                    />
                  </View>
                )}

                <Text
                  className={`text-gray-800 flex-1 ${
                    isTablet
                      ? "text-lg leading-[26px]"
                      : "text-base leading-[22px]"
                  }`}
                >
                  {reason.label}
                </Text>
              </Pressable>

              {/* Text Input for Others */}
              {selectedReason === "others" && reason.id === "others" && (
                <View
                  className={`border-b border-gray-100 ${
                    isTablet ? "px-4 pb-5" : "px-3 pb-4"
                  }`}
                >
                  <TextInput
                    value={otherReason}
                    onChangeText={setOtherReason}
                    placeholder="Please tell us a bit more, so we can improve FIXIT"
                    placeholderTextColor="#9099A2"
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                    className={`border border-[#E6E6E6] rounded-lg p-3 font-system ${
                      isTablet
                        ? "text-base min-h-[120px]"
                        : "text-sm min-h-[100px]"
                    }`}
                  />
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      <View className="px-6 pb-6 pt-4">
        <CustomButton
          title="Continue"
          onPress={handleContinue}
          disabled={isButtonDisabled}
        />
      </View>

      {/* Delete Account Bottom Sheet */}
      <DeleteAccountBottomSheet
        ref={deleteAccountRef}
        onConfirm={handleConfirmDelete}
        onClose={() => console.log("Bottom sheet closed")}
      />

      <RequestSentModal
        title="Your FIXIT account has been deleted successfully!"
        desc="We're sorry to see you go"
        btnText="Return to Sign up"
        visible={visible}
        onClose={handleClose}
        handleNavigate={handleNavigate}
      />
    </SafeAreaView>
  );
};

export default DeleteAccount;
