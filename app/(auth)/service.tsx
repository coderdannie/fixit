import {
  useAddServicesMutation,
  useGetServicesQuery,
  useGetSpecializationQuery,
} from "@/apis/accountSetupQuery";
import CustomButton from "@/components/CustomButton";
import Icon from "@/components/Icon";
import useToast from "@/hooks/useToast";
import AuthLayout from "@/layout/AuthLayout";
import { isTablet } from "@/utils/utils";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface ApiItem {
  id: string;
  name: string;
}

const Service = () => {
  const { showSuccess, showError } = useToast();
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedSpecializations, setSelectedSpecializations] = useState<
    string[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [specializationSearchQuery, setSpecializationSearchQuery] =
    useState("");
  const [isServiceDropdownOpen, setIsServiceDropdownOpen] = useState(false);
  const [isSpecializationDropdownOpen, setIsSpecializationDropdownOpen] =
    useState(false);
  const router = useRouter();

  // API DATA FETCHING
  const { data: specializationData, isLoading: isLoadingSpecializations } =
    useGetSpecializationQuery();

  const { data: serviceData, isLoading: isLoadingServices } =
    useGetServicesQuery();

  const [addServices, { isLoading: isMutating }] = useAddServicesMutation();

  // Extract and memoize items from API responses
  const allServices: ApiItem[] = useMemo(() => {
    return serviceData?.data?.items || [];
  }, [serviceData]);

  const allSpecializations: ApiItem[] = useMemo(() => {
    return specializationData?.data?.items || [];
  }, [specializationData]);

  // Filter services based on search query
  const filteredServices = useMemo(() => {
    if (!searchQuery.trim()) return allServices;
    return allServices.filter((service) =>
      service.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, allServices]);

  // Filter specializations based on search query
  const filteredSpecializations = useMemo(() => {
    if (!specializationSearchQuery.trim()) return allSpecializations;
    return allSpecializations.filter((spec) =>
      spec.name.toLowerCase().includes(specializationSearchQuery.toLowerCase())
    );
  }, [specializationSearchQuery, allSpecializations]);

  const toggleService = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const toggleSpecialization = (specId: string) => {
    setSelectedSpecializations((prev) =>
      prev.includes(specId)
        ? prev.filter((id) => id !== specId)
        : [...prev, specId]
    );
  };

  const handleContinue = async () => {
    const payload = {
      serviceIds: selectedServices,
      specializationIds: selectedSpecializations,
    };

    try {
      const res = await addServices(payload).unwrap();

      if (res) {
        showSuccess("Success", res.message || "Service(s) added successfully");
        router.push("/(auth)/stay_connected");
      }
    } catch (error: any) {
      console.error(
        "Validation errors:",
        JSON.stringify(error?.data?.errors, null, 2)
      );
      const errorMessage =
        error?.data?.message || "Failed to save services. Please try again.";
      showError("Error", errorMessage);
      console.error("Add services error:", error);
    }
  };

  const isSelected = (serviceId: string) =>
    selectedServices.includes(serviceId);
  const isSpecializationSelected = (specId: string) =>
    selectedSpecializations.includes(specId);

  // Get selected service names for display
  const selectedServiceNames = useMemo(() => {
    return allServices
      .filter((s) => selectedServices.includes(s.id))
      .map((s) => s.name);
  }, [selectedServices, allServices]);

  // Get selected specialization names for display
  const selectedSpecializationNames = useMemo(() => {
    return allSpecializations
      .filter((s) => selectedSpecializations.includes(s.id))
      .map((s) => s.name);
  }, [selectedSpecializations, allSpecializations]);

  const isContinueDisabled = selectedServices.length === 0 || isMutating;

  return (
    <AuthLayout currentStep={3} showStepper={true}>
      <ScrollView
        className={`flex-1 ${isTablet ? "px-10" : "px-6"}`}
        showsVerticalScrollIndicator={false}
      >
        <Text
          className={`${isTablet ? "text-3xl" : "text-2xl"} font-semibold text-textPrimary mb-2`}
        >
          What services would you offer on Fixit?
        </Text>
        <Text
          className={`text-[#666666] pt-1 mb-6 ${isTablet ? "text-xl" : "text-base"}`}
        >
          Tell us what you're great at! From engine repairs to electrical work,
          choose the services you'd like to offer so drivers and fleet owners
          can connect with the right mechanic for the job.
        </Text>

        {/* Services Dropdown Trigger */}
        <TouchableOpacity
          onPress={() =>
            !isLoadingServices &&
            setIsServiceDropdownOpen(!isServiceDropdownOpen)
          }
          className="border border-[#E3E5E8] rounded-lg px-4 py-3 mb-4 bg-white"
          activeOpacity={0.7}
          disabled={isLoadingServices}
        >
          <View className="flex-row items-center justify-between">
            {isLoadingServices ? (
              <ActivityIndicator size="small" color="#666" />
            ) : (
              <Text
                className={`${selectedServices.length > 0 ? "text-[#191919]" : "text-[#999]"} ${
                  isTablet ? "text-base" : "text-sm"
                }`}
                numberOfLines={1}
              >
                {selectedServices.length > 0
                  ? `${selectedServices.length} service(s) selected`
                  : "Select one or more"}
              </Text>
            )}
            <Icon
              type="Entypo"
              name={isServiceDropdownOpen ? "chevron-up" : "chevron-down"}
              size={20}
              color="#666666"
            />
          </View>
        </TouchableOpacity>
        {/* Selected Services Chips */}
        {selectedServices.length > 0 && (
          <View className="flex-row flex-wrap gap-2 mb-6">
            {selectedServiceNames.map((name, index) => (
              <View
                key={index}
                className="bg-[#191919] rounded-full px-4 py-2 flex-row items-center"
              >
                <Text
                  className={`text-white font-medium ${isTablet ? "text-base" : "text-sm"}`}
                >
                  {name}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Services Dropdown List */}
        {isServiceDropdownOpen && (
          <View className="border border-[#E3E5E8] rounded-lg mb-4 bg-white overflow-hidden">
            {/* Search Input */}
            <View className="px-4 pt-4 pb-3 ">
              <View className=" rounded-lg border border-[#E6E6E6] px-3 py-4 flex-row items-center">
                <Icon type="Feather" name="search" size={18} color="#808080" />
                <TextInput
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Search"
                  placeholderTextColor="#808080"
                  className="flex-1 ml-2 text-[#191919] text-sm"
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery("")}>
                    <Icon
                      type="AntDesign"
                      name="closecircle"
                      size={16}
                      color="#999"
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Services List */}
            <ScrollView
              style={{ maxHeight: 300 }}
              showsVerticalScrollIndicator={false}
            >
              {isLoadingServices ? (
                <View className="py-8 items-center">
                  <ActivityIndicator size="small" color="#191919" />
                </View>
              ) : filteredServices.length > 0 ? (
                filteredServices.map((service) => (
                  <TouchableOpacity
                    key={service.id}
                    onPress={() => toggleService(service.id)}
                    className="flex-row items-center px-4 py-3"
                    activeOpacity={0.7}
                  >
                    <View
                      className={`w-5 h-5 border-2 rounded-full items-center justify-center mr-3 ${
                        isSelected(service.id)
                          ? "bg-primary border-primary"
                          : "border-[#D1D5DB] bg-white"
                      }`}
                    >
                      {isSelected(service.id) && (
                        <Icon
                          type="Feather"
                          name="check"
                          size={12}
                          color="white"
                        />
                      )}
                    </View>
                    <Text
                      className={`flex-1 ${
                        isSelected(service.id)
                          ? "text-[#191919] font-semibold"
                          : "text-[#464D53]"
                      } ${isTablet ? "text-base" : "text-sm"}`}
                    >
                      {service.name}
                    </Text>
                  </TouchableOpacity>
                ))
              ) : (
                <View className="py-8 items-center">
                  <Icon
                    type="Feather"
                    name="search"
                    size={32}
                    color="#D1D5DB"
                  />
                  <Text className="text-[#999] mt-2 text-sm">
                    No services found
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        )}

        {/* Specialization Section */}
        <Text
          className={`${isTablet ? "text-xl" : "text-lg"} font-semibold text-textPrimary mb-2 mt-4`}
        >
          Let us know your specialization
        </Text>
        <Text
          className={`text-[#666666] mb-4 ${isTablet ? "text-base" : "text-sm"}`}
        >
          Select your niche automotive specialties to help us match you with the
          right jobs.
        </Text>

        {/* Specialization Dropdown Trigger */}
        <TouchableOpacity
          onPress={() =>
            !isLoadingSpecializations &&
            setIsSpecializationDropdownOpen(!isSpecializationDropdownOpen)
          }
          className="border border-[#E3E5E8] rounded-lg px-4 py-3 mb-4 bg-white"
          activeOpacity={0.7}
          disabled={isLoadingSpecializations}
        >
          <View className="flex-row items-center justify-between">
            {isLoadingSpecializations ? (
              <ActivityIndicator size="small" color="#666" />
            ) : (
              <Text
                className={`${
                  selectedSpecializations.length > 0
                    ? "text-[#191919]"
                    : "text-[#999]"
                } ${isTablet ? "text-base" : "text-sm"}`}
                numberOfLines={1}
              >
                {selectedSpecializations.length > 0
                  ? `${selectedSpecializations.length} specialization(s) selected`
                  : "Select one or more"}
              </Text>
            )}
            <Icon
              type="Entypo"
              name={
                isSpecializationDropdownOpen ? "chevron-up" : "chevron-down"
              }
              size={20}
              color="#666666"
            />
          </View>
        </TouchableOpacity>

        {/* Specialization Dropdown List */}
        {isSpecializationDropdownOpen && (
          <View className="border border-[#E3E5E8] rounded-lg mb-4 bg-white overflow-hidden">
            {/* Search Input */}
            <View className="px-4 pt-4 pb-3 ">
              <View className=" rounded-lg border border-[#E6E6E6] px-3 py-4 flex-row items-center">
                <Icon type="Feather" name="search" size={18} color="#999" />
                <TextInput
                  value={specializationSearchQuery}
                  onChangeText={setSpecializationSearchQuery}
                  placeholder="Search"
                  placeholderTextColor="#999"
                  className="flex-1 ml-2 text-[#191919] text-sm"
                />
                {specializationSearchQuery.length > 0 && (
                  <TouchableOpacity
                    onPress={() => setSpecializationSearchQuery("")}
                  >
                    <Icon
                      type="AntDesign"
                      name="closecircle"
                      size={16}
                      color="#999"
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>
            {/* Selected Specializations Chips */}
            {selectedSpecializations.length > 0 && (
              <View className="flex-row flex-wrap gap-2 mb-6">
                {selectedSpecializationNames.map((name, index) => (
                  <View
                    key={index}
                    className="bg-[#191919] rounded-full px-4 py-2 flex-row items-center"
                  >
                    <Text
                      className={`text-white font-medium ${isTablet ? "text-base" : "text-sm"}`}
                    >
                      {name}
                    </Text>
                  </View>
                ))}
              </View>
            )}
            {/* Specializations List */}
            <ScrollView
              style={{ maxHeight: 300 }}
              showsVerticalScrollIndicator={false}
            >
              {isLoadingSpecializations ? (
                <View className="py-8 items-center">
                  <ActivityIndicator size="small" color="#191919" />
                </View>
              ) : filteredSpecializations.length > 0 ? (
                filteredSpecializations.map((spec) => (
                  <TouchableOpacity
                    key={spec.id}
                    onPress={() => toggleSpecialization(spec.id)}
                    className="flex-row items-center px-4 py-3 "
                    activeOpacity={0.7}
                  >
                    <View
                      className={`w-5 h-5 border-2 rounded-full items-center justify-center mr-3  ${
                        isSpecializationSelected(spec.id)
                          ? "bg-primary border-primary"
                          : "border-[#D1D5DB] bg-white"
                      }`}
                    >
                      {isSpecializationSelected(spec.id) && (
                        <Icon
                          type="Feather"
                          name="check"
                          size={12}
                          color="white"
                        />
                      )}
                    </View>
                    <Text
                      className={`flex-1 ${
                        isSpecializationSelected(spec.id)
                          ? "text-[#191919] font-semibold"
                          : "text-[#464D53]"
                      } ${isTablet ? "text-base" : "text-sm"}`}
                    >
                      {spec.name}
                    </Text>
                  </TouchableOpacity>
                ))
              ) : (
                <View className="py-8 items-center">
                  <Icon
                    type="Feather"
                    name="search"
                    size={32}
                    color="#D1D5DB"
                  />
                  <Text className="text-[#999] mt-2 text-sm">
                    No specializations found
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        )}

        <View className="pb-6">
          <CustomButton
            onPress={handleContinue}
            disabled={isContinueDisabled}
            loading={isMutating}
          />
        </View>
      </ScrollView>
    </AuthLayout>
  );
};

export default Service;
