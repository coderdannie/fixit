import { isTablet } from "@/utils/utils";
import React, { useState, type RefObject } from "react";
import { TextInput, View } from "react-native";

interface OTPInputProps {
  codes: string[];
  refs: RefObject<TextInput | null>[];
  errorMessages: string[];
  onChangeCode: (text: string, index: number) => void;
}

const CustomOTPInput = ({
  codes,
  refs,
  errorMessages,
  onChangeCode,
}: OTPInputProps) => {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const handleFocus = (index: number) => setFocusedIndex(index);
  const handleBlur = () => setFocusedIndex(null);

  const maskValue = (value: string) => {
    return value.replace(/./g, "*");
  };

  const hasError = errorMessages?.length > 0;

  const getInputStyles = (index: number, code: string) => {
    const isEmpty = code.trim() === "";
    const isFocused = focusedIndex === index;

    let borderColor = "#E6E6E6"; // default for empty
    let backgroundColor = "#F2F2F2"; // default for empty

    if (hasError) {
      borderColor = "#DC2626"; // red for error
    } else if (isFocused) {
      borderColor = "#000000"; // black for focused
      backgroundColor = isEmpty ? "#F2F2F2" : "#EAF0FB";
    } else if (!isEmpty) {
      borderColor = "#2964C2"; // blue for filled
      backgroundColor = "#EAF0FB"; // light blue for filled
    }

    return { borderColor, backgroundColor };
  };

  return (
    <View className={`w-full flex-row items-center gap-0 justify-between `}>
      {codes.map((code, index) => {
        const styles = getInputStyles(index, code);

        return (
          <TextInput
            key={index}
            autoComplete="one-time-code"
            className={`${
              isTablet ? " w-28 h-28 text-2xl" : "w-16 h-16 text-3xl"
            } font-medium rounded-2xl text-center border ${
              errorMessages?.length > 0 ? "text-red-600" : "text-black"
            }`}
            style={{
              borderColor: styles.borderColor,
              backgroundColor: styles.backgroundColor,
            }}
            onChangeText={(text) => onChangeCode(text, index)}
            value={maskValue(code)}
            onFocus={() => handleFocus(index)}
            onBlur={handleBlur}
            maxLength={1}
            ref={refs[index]}
            onKeyPress={({ nativeEvent: { key } }) => {
              if (key === "Backspace" && index > 0) {
                onChangeCode("", index - 1);
                refs[index - 1]?.current?.focus();
              }
            }}
          />
        );
      })}
    </View>
  );
};

export default CustomOTPInput;
