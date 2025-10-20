// utils/cloudinaryUpload.ts
export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  asset_id: string;
  version: number;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  bytes: number;
  type: string;
  url: string;
}

// React Native file object type
interface ReactNativeFile {
  uri: string;
  type: string;
  name: string;
}

export const uploadToCloudinary = async (
  file: ReactNativeFile,
  signatureData: {
    signature: string;
    timestamp: number;
    cloudName: string;
    apiKey: string;
    folder: string;
    publicId: string;
    tags: string[];
  }
): Promise<CloudinaryUploadResponse> => {
  const formData = new FormData();

  formData.append("file", file as any);
  formData.append("api_key", signatureData.apiKey);
  formData.append("signature", signatureData.signature);
  formData.append("timestamp", signatureData.timestamp.toString());
  formData.append("folder", signatureData.folder);
  formData.append("public_id", signatureData.publicId);
  formData.append("tags", signatureData.tags.join(","));
  formData.append("upload_preset", "secure-server-signed");

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData?.error?.message || "Failed to upload to Cloudinary"
    );
  }

  return response.json();
};
