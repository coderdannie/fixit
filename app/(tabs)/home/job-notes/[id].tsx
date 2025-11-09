import { useCreateGeneralSignatureMutation } from "@/apis/authQuery";
import {
  useAddNoteMutation,
  useDeleteNoteMutation,
  useGetNoteByIdQuery,
  useUpdateNoteMutation,
} from "@/apis/jobQuery";
import BackBtn from "@/components/BackBtn";
import CustomButton from "@/components/CustomButton";
import Icon from "@/components/Icon";
import DeleteConfirmationModal from "@/components/modals/DeleteModal";
import useImagePicker from "@/hooks/useImagePicker";
import useToast from "@/hooks/useToast";
import { uploadToCloudinary } from "@/utils/cloudinaryUpload";
import { isTablet } from "@/utils/utils";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface AttachedImage {
  uri: string;
  fileName?: string | null;
  mimeType?: string | null;
  isNew?: boolean;
  [key: string]: any;
}

interface ExistingAttachment {
  secureUrl: string;
  publicId: string;
  uploadedAt: string;
}

const Note = () => {
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  const { pickImage } = useImagePicker();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [attachedImages, setAttachedImages] = useState<AttachedImage[]>([]);
  const [existingAttachments, setExistingAttachments] = useState<
    ExistingAttachment[]
  >([]);
  const [removedImagePublicIds, setRemovedImagePublicIds] = useState<string[]>(
    []
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [noteId, setNoteId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [addNote, { isLoading: isSavingNote }] = useAddNoteMutation();
  const [updateNote, { isLoading: isUpdatingNote }] = useUpdateNoteMutation();
  const [deleteNote, { isLoading: isDeletingNote }] = useDeleteNoteMutation();
  const [createGeneralSignature, { isLoading: isCreatingSignature }] =
    useCreateGeneralSignatureMutation();

  const { id } = useLocalSearchParams();

  const shouldFetchDetails = id && id !== "add";

  const { data, isLoading: isPending } = useGetNoteByIdQuery(id as string, {
    skip: !shouldFetchDetails,
  });

  useEffect(() => {
    const noteData = data?.data?.note || data?.note;
    if (noteData) {
      setIsEditMode(true);
      setNoteId(noteData.id);
      setTitle(noteData.title);
      setContent(noteData.content || "");
      setExistingAttachments(noteData.attachments || []);
      setRemovedImagePublicIds([]);
      setAttachedImages([]);
    }
  }, [data]);

  const handleAddImage = async () => {
    try {
      const image = await pickImage();
      if (image) {
        const normalizedImage: AttachedImage = {
          ...image,
          fileName: image.fileName ?? undefined,
          mimeType: image.mimeType ?? undefined,
          isNew: true,
        };
        setAttachedImages((prev) => [...prev, normalizedImage]);
      }
    } catch (error: any) {
      showError("Error", "Failed to pick image");
    }
  };

  const handleRemoveNewImage = (index: number) => {
    Alert.alert("Remove Image", "Are you sure you want to remove this image?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => {
          setAttachedImages((prev) => prev.filter((_, i) => i !== index));
        },
      },
    ]);
  };

  const handleRemoveExistingImage = (index: number) => {
    Alert.alert("Remove Image", "Are you sure you want to remove this image?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => {
          const removedImage = existingAttachments[index];
          setRemovedImagePublicIds((prev) => [...prev, removedImage.publicId]);
          setExistingAttachments((prev) => prev.filter((_, i) => i !== index));
        },
      },
    ]);
  };

  const uploadImages = async () => {
    const uploadedUrls: string[] = [];

    for (const image of attachedImages) {
      try {
        const signatureResponse = await createGeneralSignature({
          resourceType: "image",
          folderName: "job-notes",
          tags: ["note", "attachment"],
        }).unwrap();

        const fileToUpload = {
          uri: image.uri,
          type: image.mimeType ?? "image/jpeg",
          name: image.fileName ?? `note_${Date.now()}.jpg`,
        };

        const uploadResult = await uploadToCloudinary(fileToUpload, {
          signature: signatureResponse.data.signature,
          timestamp: signatureResponse.data.timestamp,
          cloudName: signatureResponse.data.cloudName,
          apiKey: signatureResponse.data.apiKey,
          folder: signatureResponse.data.params.folder,
          publicId: signatureResponse.data.params.public_id,
          tags: signatureResponse.data.params.tags.split(","),
        });

        uploadedUrls.push(uploadResult.secure_url);
      } catch (error) {
        console.error("Error uploading image:", error);
        throw error;
      }
    }

    return uploadedUrls;
  };

  const handleSaveNote = async () => {
    if (!title.trim()) {
      showError("Error", "Please enter a title");
      return;
    }

    if (!content.trim()) {
      showError("Error", "Please enter some content");
      return;
    }

    try {
      setIsUploading(true);

      if (isEditMode && noteId) {
        // Update existing note - upload new images first if any
        let newImageUrls: string[] = [];
        if (attachedImages.length > 0) {
          newImageUrls = await uploadImages();
        }

        // Combine existing attachments with newly uploaded ones
        const allAttachments = [
          ...existingAttachments.map((att) => att.secureUrl),
          ...newImageUrls,
        ];

        // Build update payload
        const updatePayload: any = {
          id: noteId,
          title: title.trim(),
          content: content.trim(),
        };

        // Only add removePublicIds if images were removed
        if (removedImagePublicIds.length > 0) {
          updatePayload.removePublicIds = removedImagePublicIds;
        }

        // TODO: If backend needs attachments array in update, add:
        updatePayload.addAttachments = allAttachments;

        await updateNote(updatePayload).unwrap();
      } else {
        // Create new note
        let newImageUrls: string[] = [];
        if (attachedImages.length > 0) {
          newImageUrls = await uploadImages();
        }

        const noteData = {
          title: title.trim(),
          content: content.trim(),
          attachments: newImageUrls,
        };

        await addNote(noteData).unwrap();
      }

      router.back();
    } catch (error: any) {
      showError(
        "Error",
        error?.data?.message ||
          error?.message ||
          "Failed to save note. Please try again."
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!noteId) {
      showError("Error", "Note ID not found");
      setShowDeleteModal(false);
      return;
    }

    try {
      await deleteNote({ id: noteId }).unwrap();
      // showSuccess("Success", "Note deleted successfully");
      setShowDeleteModal(false);
      router.back();
    } catch (error: any) {
      showError(
        "Error",
        error?.data?.message ||
          error?.message ||
          "Failed to delete note. Please try again."
      );
      setShowDeleteModal(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  const isLoading =
    isSavingNote || isCreatingSignature || isUploading || isUpdatingNote;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View
        className={`flex-row items-center justify-between ${
          isTablet ? "px-10 pb-6" : "px-4 pb-4"
        } bg-white border-b border-gray-200`}
      >
        <BackBtn />
        <View className="flex-row items-center gap-4">
          <TouchableOpacity onPress={handleAddImage} disabled={isLoading}>
            <Icon type="Feather" name="camera" size={22} color="#000" />
          </TouchableOpacity>

          {isEditMode && (
            <TouchableOpacity onPress={handleDelete} disabled={isLoading}>
              <Icon type="Feather" name="trash-2" size={22} color="#EF4444" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        className={`flex-1 ${isTablet ? "px-10" : "px-6"}`}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Title"
          placeholderTextColor="#999"
          className={`${
            isTablet ? "text-3xl pt-8" : "text-2xl pt-6"
          } font-semibold text-textPrimary`}
          editable={!isLoading}
        />

        <TextInput
          value={content}
          onChangeText={setContent}
          placeholder="Type something here..."
          placeholderTextColor="#999"
          multiline
          textAlignVertical="top"
          className={`${
            isTablet
              ? "text-lg pt-6 min-h-[400px]"
              : "text-base pt-4 min-h-[300px]"
          } text-gray-700`}
          editable={!isLoading}
        />

        {(existingAttachments.length > 0 || attachedImages.length > 0) && (
          <View className="mt-6 mb-4">
            <Text
              className={`${
                isTablet ? "text-lg" : "text-base"
              } font-semibold text-textPrimary mb-3`}
            >
              Attached Images (
              {existingAttachments.length + attachedImages.length})
            </Text>
            <View className="flex-row flex-wrap gap-3">
              {existingAttachments.map((attachment, index) => (
                <View key={`existing-${index}`} className="relative">
                  <Image
                    source={{ uri: attachment.secureUrl }}
                    className={`${
                      isTablet ? "w-32 h-32" : "w-24 h-24"
                    } rounded-lg`}
                    resizeMode="cover"
                  />
                  <TouchableOpacity
                    onPress={() => handleRemoveExistingImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
                    disabled={isLoading}
                  >
                    <Icon type="Feather" name="x" size={16} color="#FFF" />
                  </TouchableOpacity>
                </View>
              ))}

              {attachedImages.map((image, index) => (
                <View key={`new-${index}`} className="relative">
                  <Image
                    source={{ uri: image.uri }}
                    className={`${
                      isTablet ? "w-32 h-32" : "w-24 h-24"
                    } rounded-lg border border-blue-300`}
                    resizeMode="cover"
                  />
                  <TouchableOpacity
                    onPress={() => handleRemoveNewImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
                    disabled={isLoading}
                  >
                    <Icon type="Feather" name="x" size={16} color="#FFF" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}

        <View className="h-32" />
      </ScrollView>

      <View
        className={`${
          isTablet ? "px-10 pb-10" : "px-6 pb-6"
        } bg-white border-t border-gray-100`}
      >
        <CustomButton
          onPress={handleSaveNote}
          disabled={!title.trim() || !content.trim() || isLoading}
          loading={isLoading}
          containerClassName="mt-4"
          title={isEditMode ? "Update note" : "Save note"}
        />
      </View>
      <DeleteConfirmationModal
        isVisible={showDeleteModal}
        onClose={handleCancelDelete}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeletingNote}
        title="Delete Note"
        description="Are you sure you want to delete this note? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </SafeAreaView>
  );
};

export default Note;
