import Icon from "@/components/Icon";
import { CopilotMessage } from "@/types/chats";
import { formatDates } from "@/utils/utils";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export const MessageStatusIcon = ({
  status,
}: {
  status: CopilotMessage["status"];
}) => {
  switch (status) {
    case "pending":
      return (
        <Icon
          type="Ionicons"
          name="time-outline"
          size={12}
          color="#fff"
          style={{ marginLeft: 4, opacity: 0.8 }}
        />
      );
    case "sent":
      return (
        <Icon
          type="Ionicons"
          name="checkmark-done"
          size={14}
          color="#fff"
          style={{ marginLeft: 4, opacity: 0.9 }}
        />
      );
    case "failed":
      return (
        <Icon
          type="MaterialIcons"
          name="error-outline"
          size={14}
          color="#FF5555"
          style={{ marginLeft: 4 }}
        />
      );
    default:
      return null;
  }
};

export const ImagePreview = ({
  images,
  onRemove,
}: {
  images: Array<{ uri: string; type: string }>;
  onRemove: (index: number) => void;
}) => {
  if (images.length === 0) return null;

  return (
    <View className="px-5 py-3 bg-white border-t border-gray-200">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex-row"
      >
        {images.map((img, index) => (
          <View key={index} className="mr-2 relative">
            <Image
              source={{ uri: img.uri }}
              style={{
                width: 80,
                height: 80,
                borderRadius: 8,
              }}
              resizeMode="cover"
            />
            <TouchableOpacity
              onPress={() => onRemove(index)}
              className="absolute -top-2 -right-2 bg-red-500 rounded-full w-6 h-6 items-center justify-center"
              activeOpacity={0.7}
            >
              <Icon type="Ionicons" name="close" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export const DateSeparator = ({ date }: { date: Date }) => (
  <View className="items-center my-4">
    <View className="bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
      <Text className="text-xs text-gray-600 font-medium">
        {formatDates(date)}
      </Text>
    </View>
  </View>
);
