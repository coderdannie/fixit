import Toast, { ToastOptions } from "react-native-toast-message";

type ToastType = "success" | "error" | "default";

interface ExtendedToastOptions extends ToastOptions {
  text2?: string;
  text2NumberOfLines?: number;
}

const useToast = () => {
  const showToast = (
    text1: string,
    type: ToastType = "default",
    options?: ExtendedToastOptions
  ) => {
    const defaultOptions: ExtendedToastOptions = {
      position: "top",
      topOffset: 50,
      autoHide: true,
      visibilityTime: 3000, // 3 seconds default for all toasts
      text2NumberOfLines: 0,
      ...options,
    };

    Toast.show({
      type,
      text1,
      text2: options?.text2,
      ...defaultOptions,
    });
  };

  const showSuccess = (
    text1: string,
    text2?: string,
    options?: Omit<ExtendedToastOptions, "text2">
  ) => {
    showToast(text1, "success", {
      text2,
      visibilityTime: 3000, // 3 seconds for success
      ...options,
    });
  };

  const showError = (
    text1: string,
    text2?: string,
    options?: Omit<ExtendedToastOptions, "text2">
  ) => {
    showToast(text1, "error", {
      text2,
      visibilityTime: 5000, // 5 seconds for errors since they might need more reading time
      ...options,
    });
  };

  return {
    showToast,
    showSuccess,
    showError,
  };
};

export default useToast;
