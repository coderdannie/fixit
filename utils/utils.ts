import { Message } from "@/types/chats";
import { Image } from "expo-image";
import { Dimensions, Platform } from "react-native";

const { width, height } = Dimensions.get("window");
export { height, width };

export const isTablet =
  (Platform.OS === "ios" && Platform.isPad) ||
  (Platform.OS === "android" && Math.min(width, height) >= 600);

export const blurhash = "L6PZfSi_.AyE_3t7t7R**0o#DgR4";

export function timeAgo(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  const seconds = Math.floor(diffMs / 1000);
  if (seconds < 60) {
    const unit = seconds === 1 ? "sec" : "secs";
    return `${seconds} ${unit}`;
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    const unit = minutes === 1 ? "min" : "mins";
    return `${minutes} ${unit}`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    const unit = hours === 1 ? "hour" : "hours";
    return `${hours} ${unit}`;
  }

  const days = Math.floor(hours / 24);
  if (days < 365) {
    const unit = days === 1 ? "day" : "days";
    return `${days} ${unit}`;
  }

  const years = Math.floor(days / 365);
  const unit = years === 1 ? "year" : "years";
  return `${years} ${unit}`;
}

export const formatAmount = (
  balance: number | string | undefined,
  hideDecimal: boolean = false,
  hideSymbol: boolean = false
): string | number => {
  if (balance === undefined) return 0;

  if (typeof balance === "string") balance = Number(balance);
  if (hideDecimal) {
    balance = Math.floor(balance);
  }

  const options: Intl.NumberFormatOptions = {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: hideDecimal ? 0 : 2,
  };

  let formattedBalance: string = balance?.toLocaleString("en-NG", options);

  if (hideSymbol) {
    const currencySymbol = new Intl.NumberFormat(
      "en-NG",
      options
    ).formatToParts()[0].value;
    formattedBalance = formattedBalance?.replace(currencySymbol, "");
  }

  return formattedBalance;
};

export async function prefetchImages(
  urls: string | string[],
  policy: "memory" | "disk" | "memory-disk" = "memory-disk"
): Promise<void> {
  if (!urls || urls.length === 0) {
    return;
  }

  try {
    await Image.prefetch(urls, policy);
  } catch (error) {
    console.warn("prefetchImages error:", error);
  }
}

export function formatTime(isoString: string): string {
  const date = new Date(isoString);
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "pm" : "am";

  hours = hours % 12 || 12;

  const hh = String(hours).padStart(2, "0");
  const mm = String(minutes).padStart(2, "0");

  return `${hh}:${mm}${ampm}`;
}

export const formatCurrency = (amount: number) => {
  return `₦ ${amount.toLocaleString()}`;
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInWeeks = Math.floor(diffInDays / 7);

  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  } else if (diffInWeeks < 4) {
    return `${diffInWeeks}w ago`;
  } else {
    return date.toLocaleDateString();
  }
};

// Helper function to check if we need to show date separator
export const shouldShowDateSeparator = (
  messages: Message[],
  currentIndex: number
) => {
  if (currentIndex === 0) return true;

  const currentMsg = messages[currentIndex];
  const previousMsg = messages[currentIndex - 1];

  const currentDate = new Date(currentMsg.timestamp);
  const previousDate = new Date(previousMsg.timestamp);

  currentDate.setHours(0, 0, 0, 0);
  previousDate.setHours(0, 0, 0, 0);

  return currentDate.getTime() !== previousDate.getTime();
};

export const formatDates = (date: Date): string => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const messageDate = new Date(date);

  today.setHours(0, 0, 0, 0);
  yesterday.setHours(0, 0, 0, 0);
  messageDate.setHours(0, 0, 0, 0);

  if (messageDate.getTime() === today.getTime()) {
    return "Today";
  } else if (messageDate.getTime() === yesterday.getTime()) {
    return "Yesterday";
  } else {
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }
};

export const fileToImagePayload = (
  uri: string,
  type: string
): Promise<{ base64: string; mime_type: string }> =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const reader = new FileReader();

      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.onload = () => {
        try {
          const result = String(reader.result || "");
          const m = result.match(/^data:(.+?);base64,(.+)$/);
          const meta = m?.[1] || type;
          const data = m?.[2] || result;
          resolve({ base64: data, mime_type: meta });
        } catch (e) {
          reject(e);
        }
      };
      reader.readAsDataURL(blob);
    } catch (e) {
      reject(e);
    }
  });

export const fileToBase64 = async (uri: string): Promise<string> => {
  const response = await fetch(uri);
  const blob = await response.blob();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      resolve(base64.split(",")[1]); // Remove data:audio/...;base64, prefix
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export const convertTo24Hour = (time12: string): string => {
  if (!time12 || !time12.includes(" ")) return "";

  const [time, period] = time12.split(" ");
  let [hours, minutes] = time.split(":");
  let h = parseInt(hours, 10);

  if (period === "PM" && h !== 12) {
    h += 12;
  } else if (period === "AM" && h === 12) {
    h = 0;
  }

  return `${h.toString().padStart(2, "0")}:${minutes.padStart(2, "0")}`;
};
