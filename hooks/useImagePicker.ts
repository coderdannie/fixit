import { useState } from "react";
import * as ImagePicker from "expo-image-picker";

const useImagePicker = () => {
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);

  const pickImage = async () => {
    setSelectedImage(null);
    setBase64Image(null);

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
      base64: true,
    });

    if (result.canceled || !result.assets || result.assets.length === 0) {
      return null;
    }

    const file = result.assets[0];

    // Construct base64 data URI manually
    const base64DataUri = `data:${file.mimeType ?? "image/jpeg"};base64,${
      file.base64
    }`;

    setSelectedImage(file);
    setBase64Image(base64DataUri);

    return file;
  };

  return { selectedImage, pickImage, base64Image, setSelectedImage };
};

export default useImagePicker;
