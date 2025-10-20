import { isTablet } from "@/utils/utils";
import React, { useRef, useState } from "react";
import { Controller } from "react-hook-form";
import {
  KeyboardTypeOptions,
  StyleProp,
  Text,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import Icon from "./Icon";

interface FormFieldProps {
  label: string;
  labelOptional?: string;
  isShowCountryCode?: boolean;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  name: string;
  control: any;
  rules?: any;
  placeholder?: string;
  secureTextEntry?: boolean;
  showPasswordIcon?: boolean;
  hideErrorMessage?: boolean;
  otherProps?: { [key: string]: any };
  keyboardType?: KeyboardTypeOptions;
  icon?: any;
  maxLength?: number;
  suffix?: any;
  editable?: boolean;
  autoCapitalize?: any;
  customLabel?: StyleProp<TextStyle>;
  customLabelOptional?: StyleProp<TextStyle>;
  customInput?: StyleProp<TextStyle>;
  multiline?: boolean;
  maxChar?: string;
}

const FormInput: React.FC<FormFieldProps> = ({
  label,
  labelOptional = "",
  isShowCountryCode = false,
  style = {},
  containerStyle = {},
  name,
  control,
  rules = {},
  placeholder = "",
  secureTextEntry = false,
  showPasswordIcon = false,
  hideErrorMessage = false,
  keyboardType = "default",
  icon = null,
  maxLength = 255,
  suffix = null,
  editable = true,
  autoCapitalize,
  customLabel,
  customLabelOptional,
  customInput,
  multiline,
  maxChar,
  ...otherProps
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  // Use a local ref for the TextInput
  const inputRef = useRef<TextInput>(null);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  return (
    <View className="w-full mb-6" style={containerStyle}>
      {/* Label Section */}
      <View className="flex-row items-center justify-start mb-2">
        <Text
          className={`${
            isTablet ? "text-lg" : "text-base"
          } font-medium text-gray-900`}
          style={customLabel}
        >
          {label}
        </Text>
        {labelOptional && (
          <Text
            className={`${
              isTablet ? "text-base" : "text-sm"
            } font-normal italic text-gray-500 ml-1`}
            style={customLabelOptional}
          >
            {labelOptional}
          </Text>
        )}
      </View>

      {/* Controller */}
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { onChange, onBlur, value }, fieldState }) => (
          <>
            {/* Input Container */}
            <View
              className={`w-full rounded-full bg-white border border-gray-200 flex-row items-center ${
                fieldState.error ? "border-red-300" : "border-gray-200"
              } ${secureTextEntry && showPasswordIcon ? "pr-4" : "pr-0"}`}
              style={[
                {
                  minHeight: 52, // Taller input to match design
                },
                style,
              ]}
            >
              <TextInput
                ref={inputRef}
                key={String(isPasswordVisible)}
                className={`${
                  isTablet ? "text-lg" : "text-base"
                } flex-1 font-normal text-gray-900`}
                style={[
                  {
                    paddingHorizontal: 16,
                    lineHeight: 18,
                  },
                  customInput,
                ]}
                placeholder={placeholder}
                placeholderTextColor={"#9CA3AF"}
                secureTextEntry={secureTextEntry && !isPasswordVisible}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value?.toString()}
                maxLength={maxLength}
                keyboardType={keyboardType}
                autoCorrect={false}
                editable={editable}
                autoCapitalize={autoCapitalize}
                multiline={multiline}
                spellCheck={false}
                {...otherProps}
              />

              {/* Password Toggle Icon */}
              {secureTextEntry && showPasswordIcon && (
                <TouchableOpacity
                  onPress={togglePasswordVisibility}
                  className="p-2"
                  activeOpacity={0.7}
                >
                  <Icon
                    type="Feather"
                    name={isPasswordVisible ? "eye" : "eye-off"}
                    color={"#6B7280"}
                    size={20}
                  />
                </TouchableOpacity>
              )}

              {/* Suffix */}
              {suffix && suffix}

              {/* Character Count */}
              {maxChar && (
                <Text
                  className={`${
                    isTablet ? "text-base" : "text-sm"
                  } font-medium text-gray-500 mr-4`}
                >
                  {maxChar}
                </Text>
              )}
            </View>

            {/* Error Message */}
            {fieldState.error && !hideErrorMessage && (
              <Text
                className={`${
                  isTablet ? "text-sm" : "text-xs"
                } text-red-600 font-normal mt-1`}
              >
                {fieldState.error.message}
              </Text>
            )}
          </>
        )}
      />
    </View>
  );
};

export default FormInput;
