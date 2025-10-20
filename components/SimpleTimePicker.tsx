import BottomSheet from "@gorhom/bottom-sheet";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { forwardRef, useState } from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";

interface CustomTimePickerProps {
  title: string;
  selectedTime: string;
  onTimeSelect: (time: string) => void;
  placeHolder?: string;
}

const CustomTimePicker = forwardRef<BottomSheet, CustomTimePickerProps>(
  ({ title, selectedTime, onTimeSelect }, ref) => {
    const [tempDate, setTempDate] = useState(() => {
      const [hours, minutes] = selectedTime.split(":").map(Number);
      const d = new Date();
      d.setHours(hours, minutes, 0, 0);
      return d;
    });

    const handleConfirm = () => {
      const timeString = `${tempDate
        .getHours()
        .toString()
        .padStart(2, "0")}:${tempDate
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;
      onTimeSelect(timeString);
      // close sheet
      (ref as any)?.current?.close();
    };

    return (
      <BottomSheet
        ref={ref}
        snapPoints={["50%"]}
        enablePanDownToClose
        index={-1}
      >
        <View className="flex-1 px-4 py-6">
          <Text className="text-lg font-semibold text-textPrimary mb-4">
            {title}
          </Text>

          <DateTimePicker
            value={tempDate}
            mode="time"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            is24Hour={false} // ensures AM/PM column
            onChange={(event, date) => {
              if (date) setTempDate(date);
            }}
          />

          <TouchableOpacity
            onPress={handleConfirm}
            className="mt-6 py-3 rounded-xl bg-blue-600"
          >
            <Text className="text-white text-center text-base font-medium">
              Done
            </Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>
    );
  }
);

export default CustomTimePicker;
