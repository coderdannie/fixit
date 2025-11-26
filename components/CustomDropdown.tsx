import Icon from "@/components/Icon";
import React, { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface DropdownItem {
  name: string;
  value: string;
}

interface CustomDropdownProps {
  options: DropdownItem[];
  selectedValue: string;
  onSelect: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const CustomDropdown = ({
  options,
  selectedValue,
  onSelect,
  placeholder = "Select an option",
  disabled = false,
}: CustomDropdownProps) => {
  const [isVisible, setIsVisible] = useState(false);

  const selectedItem = options.find((item) => item.value === selectedValue);
  const displayText = selectedItem ? selectedItem.name : placeholder;

  const handleSelect = (value: string) => {
    onSelect(value);
    setIsVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        className={`w-full h-[50px] border border-[#E6E6E6] rounded-[50px] px-5 flex-row items-center justify-between ${
          disabled ? "bg-gray-100 opacity-50" : "bg-white"
        }`}
        onPress={() => !disabled && setIsVisible(true)}
        activeOpacity={0.8}
        disabled={disabled}
      >
        <Text
          className={`text-base flex-1 ${
            !selectedValue ? "text-gray-400" : "text-black"
          }`}
        >
          {displayText}
        </Text>
        <Icon
          type="Feather"
          name={isVisible ? "chevron-up" : "chevron-down"}
          size={20}
          color="#666"
        />
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
      >
        <Pressable
          className="flex-1 bg-black/50 justify-end"
          onPress={() => setIsVisible(false)}
        >
          <View className="bg-white rounded-t-3xl max-h-[70%] pb-5">
            <View className="flex-row justify-between items-center px-5 py-5 border-b border-[#E6E6E6]">
              <Text className="text-lg font-semibold text-gray-900">
                {placeholder || "Select an option"}
              </Text>
              <TouchableOpacity onPress={() => setIsVisible(false)}>
                <Icon type="Feather" name="x" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView className="px-5" showsVerticalScrollIndicator={false}>
              {options.map((item, index) => {
                const isSelected = item.value === selectedValue;
                const isLast = index === options.length - 1;
                return (
                  <TouchableOpacity
                    key={item.value}
                    className={`flex-row justify-between items-center py-4 ${
                      isSelected
                        ? "bg-blue-50 -mx-5 px-5 rounded-lg"
                        : isLast
                          ? ""
                          : "border-b border-gray-100"
                    }`}
                    onPress={() => handleSelect(item.value)}
                    activeOpacity={0.7}
                  >
                    <Text
                      className={`text-base flex-1 ${
                        isSelected
                          ? "font-semibold text-gray-900"
                          : "text-gray-700"
                      }`}
                    >
                      {item.name}
                    </Text>
                    {isSelected && (
                      <Icon
                        type="AntDesign"
                        name="check-circle"
                        size={20}
                        color="#2964C2"
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

export default CustomDropdown;
