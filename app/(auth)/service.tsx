import { useAddServicesMutation } from "@/apis/accountSetupQuery";
import { services } from "@/components/common/constant";
import CustomButton from "@/components/CustomButton";
import Icon from "@/components/Icon";
import useToast from "@/hooks/useToast";
import AuthLayout from "@/layout/AuthLayout";
import { isTablet } from "@/utils/utils";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

// Specialization dummy data
const specializations = [
  { id: "spec_1", name: "Premium fleet mechanic" },
  { id: "spec_2", name: "Truck Specialist" },
  { id: "spec_3", name: "Honda Specialist" },
  { id: "spec_4", name: "Luxury car specialist" },
  { id: "spec_5", name: "Diagnostic specialist" },
  { id: "spec_6", name: "Volkswagen Specialty" },
  { id: "spec_7", name: "Classic Car Restoration" },
  { id: "spec_8", name: "Hybrid/Electric Vehicle" },
  { id: "spec_9", name: "Performance Tuning" },
  { id: "spec_10", name: "Diesel Engine Specialist" },
  { id: "spec_11", name: "Transmission Specialist" },
  { id: "spec_12", name: "AC Specialist" },
];

const Service = () => {
  const { showSuccess, showError } = useToast();
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedSpecializations, setSelectedSpecializations] = useState<
    string[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [specializationSearchQuery, setSpecializationSearchQuery] =
    useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSpecializationDropdownOpen, setIsSpecializationDropdownOpen] =
    useState(false);
  const router = useRouter();

  const [addServices, { isLoading }] = useAddServicesMutation();

  // Filter services based on search query
  const filteredServices = useMemo(() => {
    if (!searchQuery.trim()) return services;
    return services.filter((service) =>
      service.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Filter specializations based on search query
  const filteredSpecializations = useMemo(() => {
    if (!specializationSearchQuery.trim()) return specializations;
    return specializations.filter((spec) =>
      spec.name.toLowerCase().includes(specializationSearchQuery.toLowerCase())
    );
  }, [specializationSearchQuery]);

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
    console.log("Selected services:", selectedServices);
    console.log("Selected specializations:", selectedSpecializations);

    const payload = {
      services: selectedServices,
      specializations: selectedSpecializations,
    };
    console.log("Payload:", JSON.stringify(payload));

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
    return services
      .filter((s) => selectedServices.includes(s.id))
      .map((s) => s.name);
  }, [selectedServices]);

  // Get selected specialization names for display
  const selectedSpecializationNames = useMemo(() => {
    return specializations
      .filter((s) => selectedSpecializations.includes(s.id))
      .map((s) => s.name);
  }, [selectedSpecializations]);

  return (
    <AuthLayout currentStep={3} showStepper={true}>
      <ScrollView
        className={`flex-1 ${isTablet ? "px-10" : "px-6"}`}
        showsVerticalScrollIndicator={false}
      >
        <Text
          className={`${
            isTablet ? "text-3xl" : "text-2xl"
          } font-semibold text-textPrimary mb-2`}
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

        {/* Searchable Dropdown Input */}
        <TouchableOpacity
          onPress={() => setIsDropdownOpen(true)}
          className="border border-[#E3E5E8] rounded-lg px-4 py-3 mb-4 bg-white"
          activeOpacity={0.7}
        >
          <View className="flex-row items-center justify-between">
            <Text
              className={`${
                selectedServices.length > 0 ? "text-[#191919]" : "text-[#999]"
              } ${isTablet ? "text-base" : "text-sm"}`}
              numberOfLines={1}
            >
              {selectedServices.length > 0
                ? `${selectedServices.length} service(s) selected`
                : "Select one or more"}
            </Text>
            <Icon type="Entypo" name="chevron-down" size={20} color="#666666" />
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

        {/* Specialization Section */}
        <Text
          className={`${
            isTablet ? "text-xl" : "text-lg"
          } font-semibold text-textPrimary mb-2 mt-4`}
        >
          Let us know your specialization
        </Text>
        <Text
          className={`text-[#666666] mb-4 ${isTablet ? "text-base" : "text-sm"}`}
        >
          Select your niche automotive specialties to help us match you with the
          right jobs.
        </Text>

        {/* Specialization Dropdown */}
        <TouchableOpacity
          onPress={() => setIsSpecializationDropdownOpen(true)}
          className="border border-[#E3E5E8] rounded-lg px-4 py-3 mb-4 bg-white"
          activeOpacity={0.7}
        >
          <View className="flex-row items-center justify-between">
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
            <Icon type="Entypo" name="chevron-down" size={20} color="#666666" />
          </View>
        </TouchableOpacity>

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

        <View className="pb-6">
          <CustomButton
            onPress={handleContinue}
            disabled={selectedServices.length === 0 || isLoading}
            loading={isLoading}
          />
        </View>
      </ScrollView>

      {/* Services Bottom Sheet */}
      <Modal
        visible={isDropdownOpen}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsDropdownOpen(false)}
      >
        <Pressable
          className="flex-1 bg-black/50"
          onPress={() => setIsDropdownOpen(false)}
        >
          <View className="flex-1 justify-end">
            <Pressable
              className="bg-white rounded-t-3xl"
              style={{ maxHeight: SCREEN_HEIGHT * 0.85 }}
              onPress={(e) => e.stopPropagation()}
            >
              {/* Handle Bar */}
              <View className="items-center pt-2 pb-3">
                <View className="w-12 h-1 bg-[#D1D5DB] rounded-full" />
              </View>

              {/* Bottom Sheet Header */}
              <View className="px-6 pb-4 border-b border-[#E3E5E8]">
                <View className="flex-row items-center justify-between mb-4">
                  <Text className="text-xl font-semibold text-[#191919]">
                    Select Services
                  </Text>
                  <TouchableOpacity
                    onPress={() => setIsDropdownOpen(false)}
                    className="w-8 h-8 items-center justify-center"
                  >
                    <Icon
                      type="AntDesign"
                      name="close"
                      size={22}
                      color="#666"
                    />
                  </TouchableOpacity>
                </View>

                {/* Search Input */}
                <View className="bg-[#F5F5F5] rounded-lg px-4 py-3 flex-row items-center">
                  <Icon
                    type="Feather"
                    name="search"
                    size={20}
                    color="#666666"
                  />
                  <TextInput
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder="Search services..."
                    placeholderTextColor="#999"
                    className="flex-1 ml-3 text-[#191919] text-base"
                  />
                  {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery("")}>
                      <Icon
                        type="AntDesign"
                        name="closecircle"
                        size={18}
                        color="#999"
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {/* Services List */}
              <ScrollView
                className="px-6 py-2"
                showsVerticalScrollIndicator={false}
              >
                {filteredServices.length > 0 ? (
                  filteredServices.map((service) => (
                    <TouchableOpacity
                      key={service.id}
                      onPress={() => toggleService(service.id)}
                      className="flex-row items-center py-4 border-b border-[#F0F0F0]"
                      activeOpacity={0.7}
                    >
                      {/* Checkbox */}
                      <View
                        className={`w-6 h-6 rounded border-2 items-center justify-center mr-3 ${
                          isSelected(service.id)
                            ? "bg-primary border-primary"
                            : "border-[#D1D5DB] bg-white"
                        }`}
                      >
                        {isSelected(service.id) && (
                          <Icon
                            type="Feather"
                            name="check"
                            size={16}
                            color="white"
                          />
                        )}
                      </View>

                      {/* Service Icon */}
                      <View className="w-10 h-10 rounded-full bg-[#F5F5F5] items-center justify-center mr-3">
                        <Icon
                          type={service.iconType as any}
                          name={service.iconName}
                          size={18}
                          color={service.color}
                        />
                      </View>

                      {/* Service Name */}
                      <Text
                        className={`flex-1 text-base ${
                          isSelected(service.id)
                            ? "text-[#191919] font-semibold"
                            : "text-[#464D53]"
                        }`}
                      >
                        {service.name}
                      </Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  <View className="py-12 items-center">
                    <Icon
                      type="Feather"
                      name="search"
                      size={48}
                      color="#D1D5DB"
                    />
                    <Text className="text-[#999] mt-3 text-base">
                      No services found
                    </Text>
                  </View>
                )}
              </ScrollView>

              {/* Bottom Sheet Footer */}
              <View className="px-6 py-4 border-t border-[#E3E5E8]">
                <TouchableOpacity
                  onPress={() => setIsDropdownOpen(false)}
                  className="bg-primary rounded-full py-4 items-center"
                  activeOpacity={0.8}
                >
                  <Text className="text-white font-semibold text-base">
                    Done ({selectedServices.length})
                  </Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      {/* Specialization Bottom Sheet */}
      <Modal
        visible={isSpecializationDropdownOpen}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsSpecializationDropdownOpen(false)}
      >
        <Pressable
          className="flex-1 bg-black/50"
          onPress={() => setIsSpecializationDropdownOpen(false)}
        >
          <View className="flex-1 justify-end">
            <Pressable
              className="bg-white rounded-t-3xl"
              style={{ maxHeight: SCREEN_HEIGHT * 0.85 }}
              onPress={(e) => e.stopPropagation()}
            >
              {/* Handle Bar */}
              <View className="items-center pt-2 pb-3">
                <View className="w-12 h-1 bg-[#D1D5DB] rounded-full" />
              </View>

              {/* Bottom Sheet Header */}
              <View className="px-6 pb-4 border-b border-[#E3E5E8]">
                <View className="flex-row items-center justify-between mb-4">
                  <Text className="text-xl font-semibold text-[#191919]">
                    Select Specializations
                  </Text>
                  <TouchableOpacity
                    onPress={() => setIsSpecializationDropdownOpen(false)}
                    className="w-8 h-8 items-center justify-center"
                  >
                    <Icon
                      type="AntDesign"
                      name="close"
                      size={22}
                      color="#666"
                    />
                  </TouchableOpacity>
                </View>

                {/* Search Input */}
                <View className="bg-[#F5F5F5] rounded-lg px-4 py-3 flex-row items-center">
                  <Icon
                    type="Feather"
                    name="search"
                    size={20}
                    color="#666666"
                  />
                  <TextInput
                    value={specializationSearchQuery}
                    onChangeText={setSpecializationSearchQuery}
                    placeholder="Search specializations..."
                    placeholderTextColor="#999"
                    className="flex-1 ml-3 text-[#191919] text-base"
                  />
                  {specializationSearchQuery.length > 0 && (
                    <TouchableOpacity
                      onPress={() => setSpecializationSearchQuery("")}
                    >
                      <Icon
                        type="AntDesign"
                        name="closecircle"
                        size={18}
                        color="#999"
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {/* Specializations List */}
              <ScrollView
                className="px-6 py-2"
                showsVerticalScrollIndicator={false}
              >
                {filteredSpecializations.length > 0 ? (
                  filteredSpecializations.map((spec) => (
                    <TouchableOpacity
                      key={spec.id}
                      onPress={() => toggleSpecialization(spec.id)}
                      className="flex-row items-center py-4 border-b border-[#F0F0F0]"
                      activeOpacity={0.7}
                    >
                      {/* Radio Button */}
                      <View
                        className={`w-6 h-6 rounded-full border-2 items-center justify-center mr-3 ${
                          isSpecializationSelected(spec.id)
                            ? "border-primary"
                            : "border-[#D1D5DB]"
                        }`}
                      >
                        {isSpecializationSelected(spec.id) && (
                          <View className="w-3.5 h-3.5 rounded-full bg-primary" />
                        )}
                      </View>

                      {/* Specialization Name */}
                      <Text
                        className={`flex-1 text-base ${
                          isSpecializationSelected(spec.id)
                            ? "text-[#191919] font-semibold"
                            : "text-[#464D53]"
                        }`}
                      >
                        {spec.name}
                      </Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  <View className="py-12 items-center">
                    <Icon
                      type="Feather"
                      name="search"
                      size={48}
                      color="#D1D5DB"
                    />
                    <Text className="text-[#999] mt-3 text-base">
                      No specializations found
                    </Text>
                  </View>
                )}
              </ScrollView>

              {/* Bottom Sheet Footer */}
              <View className="px-6 py-4 border-t border-[#E3E5E8]">
                <TouchableOpacity
                  onPress={() => setIsSpecializationDropdownOpen(false)}
                  className="bg-primary rounded-full py-4 items-center"
                  activeOpacity={0.8}
                >
                  <Text className="text-white font-semibold text-base">
                    Done ({selectedSpecializations.length})
                  </Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </AuthLayout>
  );
};

export default Service;
