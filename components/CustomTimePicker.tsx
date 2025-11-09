import Icon from "@/components/Icon";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, { forwardRef, useCallback, useRef, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import CustomButton from "./CustomButton";

interface TimePickerProps {
  title?: string;
  selectedTime?: string; // "HH:mm" or "HH:mm AM/PM"
  onTimeSelect?: (time: string) => void;
  onClose?: () => void;
}

const ITEM_HEIGHT = 50;
const VISIBLE_ITEMS = 5;

const CustomTimePicker = forwardRef<BottomSheet, TimePickerProps>(
  (
    { title = "Select Time", selectedTime = "09:00", onTimeSelect, onClose },
    ref
  ) => {
    const snapPoints = React.useMemo(() => ["65%"], []);

    // --- Initial Time Parsing ---
    let initialHour = 9;
    let initialMinute = 0;
    let initialPeriod = "AM";

    if (selectedTime.includes(":") && !selectedTime.includes(" ")) {
      // Handle "HH:mm" (24-hour) format
      const [h, m] = selectedTime.split(":").map(Number);
      initialHour = h > 12 ? h - 12 : h === 0 ? 12 : h;
      initialMinute = m;
      initialPeriod = h >= 12 ? "PM" : "AM";
    } else if (selectedTime.includes(" ")) {
      // Handle "H:mm AM/PM" format
      const [timePart, periodPart] = selectedTime.split(" ");
      const [h, m] = timePart.split(":").map(Number);
      initialHour = h;
      initialMinute = m;
      initialPeriod = periodPart.toUpperCase() === "PM" ? "PM" : "AM";
    }

    // Store the wheel values separately
    const [wheelHour, setWheelHour] = useState<number>(initialHour);
    const [wheelMinute, setWheelMinute] = useState<number>(initialMinute);
    const [wheelPeriod, setWheelPeriod] = useState<string>(initialPeriod);

    const hours = Array.from({ length: 12 }, (_, i) => i + 1);
    const minutes = Array.from({ length: 60 }, (_, i) => i);
    const periods = ["AM", "PM"];

    const handleSheetChanges = useCallback(
      (index: number) => {
        if (index === -1) {
          onClose?.();
        }
      },
      [onClose]
    );

    const renderBackdrop = useCallback(
      (props: any) => (
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

    const handleConfirm = () => {
      // Logic for 24-hour time (not used in final output, but useful for logic)
      let hour24 = wheelHour;
      if (wheelPeriod === "PM" && wheelHour !== 12) {
        hour24 = wheelHour + 12;
      } else if (wheelPeriod === "AM" && wheelHour === 12) {
        hour24 = 0;
      }

      // --- REVISED: Construct time string to include AM/PM ---
      const timeStringWithPeriod = `${wheelHour.toString()}:${wheelMinute
        .toString()
        .padStart(2, "0")} ${wheelPeriod}`;
      // --------------------------------------------------------

      // Pass the time string with AM/PM to the parent state
      onTimeSelect?.(timeStringWithPeriod);

      if (ref && "current" in ref && ref.current) {
        ref.current.close();
      }
    };

    const handleClose = useCallback(() => {
      if (ref && "current" in ref && ref.current) {
        ref.current.close();
      }
    }, [ref]);

    const displayTime = `${wheelHour}:${wheelMinute
      .toString()
      .padStart(2, "0")} ${wheelPeriod}`;

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
          <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-100">
            <Text className="text-xl font-semibold text-gray-900">{title}</Text>
            <TouchableOpacity
              onPress={handleClose}
              className="p-2 -mr-2"
              activeOpacity={0.7}
            >
              <Icon type="Feather" name="x" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Picker Content */}
          <View className="flex-1 px-6 py-6 justify-between">
            {/* Current Time Display */}
            <View className="items-center mb-4">
              <Text className="text-3xl font-bold text-gray-900">
                {displayTime}
              </Text>
              <Text className="text-gray-500 mt-2">Selected Time</Text>
            </View>

            {/* Custom Wheel Pickers */}
            <View className="flex-row justify-center items-center gap-2">
              <View className="flex-1">
                <WheelPicker
                  key="hour"
                  data={hours}
                  value={wheelHour}
                  onValueChange={setWheelHour}
                />
              </View>

              <Text className="text-2xl font-bold text-gray-400 mb-8">:</Text>

              <View className="flex-1">
                <WheelPicker
                  key="minute"
                  data={minutes}
                  value={wheelMinute}
                  onValueChange={setWheelMinute}
                  unit="min"
                />
              </View>

              <View className="flex-1">
                <WheelPicker
                  key="period"
                  data={periods}
                  value={wheelPeriod}
                  onValueChange={setWheelPeriod}
                />
              </View>
            </View>

            {/* Confirm Button */}
            <View className="mt-6">
              <CustomButton title="Confirm" onPress={handleConfirm} />
            </View>
          </View>
        </BottomSheetView>
      </BottomSheet>
    );
  }
);

const WheelPicker = ({
  data,
  value,
  onValueChange,
  unit,
}: {
  data: (string | number)[];
  value: string | number;
  onValueChange: (value: any) => void;
  unit?: string;
}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const initializedRef = useRef(false);

  const valueIndex = data.findIndex((item) => item === value);
  const [displayIndex, setDisplayIndex] = useState(valueIndex);

  // Initialize scroll position only once
  React.useEffect(() => {
    if (!initializedRef.current && scrollViewRef.current && valueIndex !== -1) {
      scrollViewRef.current.scrollTo({
        y: valueIndex * ITEM_HEIGHT,
        animated: false,
      });
      initializedRef.current = true;
    }
  }, [valueIndex]);

  // --- REVISED: Centralize selection logic to MomentumScrollEnd and ScrollEndDrag ---
  const handleSelection = (event: any) => {
    const yOffset = event.nativeEvent.contentOffset.y;
    const index = Math.round(yOffset / ITEM_HEIGHT);
    const clampedIndex = Math.max(0, Math.min(index, data.length - 1));

    // Update the state with the final selected value
    onValueChange(data[clampedIndex]);

    // Ensure the scroll snaps perfectly
    scrollViewRef.current?.scrollTo({
      y: clampedIndex * ITEM_HEIGHT,
      animated: true,
    });
  };

  const handleScroll = (event: any) => {
    const yOffset = event.nativeEvent.contentOffset.y;
    const index = Math.round(yOffset / ITEM_HEIGHT);
    const clampedIndex = Math.max(0, Math.min(index, data.length - 1));
    // Only update the display index here for visual feedback
    setDisplayIndex(clampedIndex);
  };
  // ---------------------------------------------------------------------------------

  return (
    <View style={{ height: ITEM_HEIGHT * VISIBLE_ITEMS, overflow: "hidden" }}>
      {/* Selection indicator */}
      <View
        style={{
          position: "absolute",
          top: ITEM_HEIGHT * 2,
          left: 0,
          right: 0,
          height: ITEM_HEIGHT,
          backgroundColor: "#F3F4F6",
          borderRadius: 8,
          zIndex: 0,
        }}
      />

      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        // --- REVISED: Use a single function for final selection ---
        onMomentumScrollEnd={handleSelection}
        onScrollEndDrag={handleSelection}
        // ----------------------------------------------------------
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingVertical: ITEM_HEIGHT * 2,
        }}
      >
        {data.map((item, index) => {
          const isSelected = index === displayIndex;
          return (
            <TouchableOpacity
              key={index}
              activeOpacity={0.7}
              onPress={() => {
                setDisplayIndex(index);
                onValueChange(item);
                scrollViewRef.current?.scrollTo({
                  y: index * ITEM_HEIGHT,
                  animated: true,
                });
              }}
              style={{
                height: ITEM_HEIGHT,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: isSelected ? 24 : 18,
                  fontWeight: isSelected ? "600" : "400",
                  color: isSelected ? "#111827" : "#9CA3AF",
                }}
              >
                {typeof item === "number"
                  ? item.toString().padStart(2, "0")
                  : item}
                {unit && isSelected ? ` ${unit}` : ""}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

CustomTimePicker.displayName = "CustomTimePicker";
export default CustomTimePicker;
