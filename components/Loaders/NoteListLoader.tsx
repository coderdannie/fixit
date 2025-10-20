import React from "react";
import { View } from "react-native";

// Individual Skeleton Note Item (for pagination loading)
export const SkeletonNoteItem = () => (
  <View className="mb-4 pb-4 border border-[#E6E6E6] rounded-[10px] py-3 px-[10px] bg-white overflow-hidden">
    <View className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-pulse" />

    <View className="flex-row justify-between items-start mb-2">
      <View className="flex-1">
        <View className="w-3/4 h-5 bg-gray-200 rounded-md mb-2" />
        <View className="w-1/2 h-4 bg-gray-200 rounded-md" />
      </View>
      <View className="w-16 h-4 bg-gray-200 rounded-md ml-2" />
    </View>

    <View className="w-full h-4 bg-gray-200 rounded-md mb-2" />
    <View className="w-2/3 h-4 bg-gray-200 rounded-md" />
  </View>
);

// Loading Footer Component for pagination
export const SkeletonLoadingFooter = () => (
  <View className="py-5">
    {[1, 2, 3].map((item) => (
      <SkeletonNoteItem key={item} />
    ))}
  </View>
);

// Main Skeleton Loader Component
interface SkeletonLoaderProps {
  itemCount?: number;
  showHeader?: boolean;
  showSearch?: boolean;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  itemCount = 5,
  showHeader,
  showSearch,
}) => {
  return (
    <View className="flex-1">
      {/* Header Skeleton */}
      {showHeader && (
        <View className="flex-row justify-between items-center pt-4 pb-3">
          <View className="flex-row items-center gap-3">
            <View className="w-32 h-8 bg-gray-200 rounded-lg overflow-hidden">
              <View className="flex-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-pulse" />
            </View>
          </View>
          <View className="w-10 h-10 bg-gray-200 rounded-md overflow-hidden">
            <View className="flex-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-pulse" />
          </View>
        </View>
      )}

      {/* Search Bar Skeleton */}
      {showSearch && (
        <View className="flex-row gap-2 mt-3 items-center border border-[#E6E6E6] rounded-full px-4 py-3 mb-4">
          <View className="w-5 h-5 bg-gray-200 rounded-full overflow-hidden">
            <View className="flex-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-pulse" />
          </View>
          <View className="flex-1 h-6 bg-gray-200 rounded-md overflow-hidden">
            <View className="flex-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-pulse" />
          </View>
        </View>
      )}

      {/* Notes List Skeleton */}
      <View className="flex-1">
        {Array.from({ length: itemCount }, (_, index) => (
          <SkeletonNoteItem key={index} />
        ))}
      </View>
    </View>
  );
};

export const ShimmerSkeleton: React.FC = () => {
  return (
    <View className="flex-1">
      {/* Header Skeleton */}
      <View className="flex-row justify-between items-center pt-4 pb-3">
        <View className="flex-row items-center gap-3">
          <View className="w-32 h-8 bg-gray-200 rounded-lg overflow-hidden">
            <View className="flex-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-pulse" />
          </View>
        </View>
        <View className="w-10 h-10 bg-gray-200 rounded-md overflow-hidden">
          <View className="flex-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-pulse" />
        </View>
      </View>

      {/* Search Bar Skeleton */}
      <View className="flex-row gap-2 mt-3 items-center border border-[#E6E6E6] rounded-full px-4 py-3 mb-4">
        <View className="w-5 h-5 bg-gray-200 rounded-full overflow-hidden">
          <View className="flex-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-pulse" />
        </View>
        <View className="flex-1 h-6 bg-gray-200 rounded-md overflow-hidden">
          <View className="flex-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-pulse" />
        </View>
      </View>

      {/* Notes List Skeleton */}
      <View className="flex-1">
        {[1, 2, 3, 4, 5].map((item) => (
          <SkeletonNoteItem key={item} />
        ))}
      </View>
    </View>
  );
};
