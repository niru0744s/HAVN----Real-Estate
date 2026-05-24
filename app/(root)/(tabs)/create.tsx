import { useSupabase } from "@/hooks/useSupabase";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TYPES = ["apartment", "house", "villa", "studio"] as const;
type PropertyType = (typeof TYPES)[number];

const MIN_PRICE = 1;
const MAX_PRICE = 999_999_999;

interface FormState {
  title: string;
  description: string;
  price: number;
  type: PropertyType;
  bedrooms: number;
  bathrooms: number;
  areaSqft: number;
  address: string;
  city: string;
  latitude: string;
  longitude: string;
  images: string[];
  isFeatured: boolean;
  localImages: string[];
}

const INITIAL_FORM: FormState = {
  title: "",
  description: "",
  price: 1,
  type: "apartment",
  bedrooms: 1,
  bathrooms: 1,
  areaSqft: 1,
  address: "",
  city: "",
  latitude: "",
  longitude: "",
  images: [],
  isFeatured: false,
  localImages: [],
};

export default function Create() {
  const router = useRouter();
  const authSupabase = useSupabase();

  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [step, setStep] = useState(1);

  const [submitting, setSubmitting] = useState(false);
  const [uploadImages, setUploadImages] = useState(false);
  const [deletingLocation, setDeletingLocation] = useState(false);

  const updateForm = (fields: Partial<FormState>) =>
    setForm((prev) => ({ ...prev, ...fields }));

  const handlePickImages = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    const permission = await ImagePicker.getMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      const askPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!askPermission.granted) {
        Alert.alert(
          "Permission Required",
          "Please allow access to your photo library to pick images."
        );
        return;
      }
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsMultipleSelection: true,
      quality: 0.7,
      base64: true,
      selectionLimit: 6 - form.localImages.length,
    });

    if (result.canceled) return;

    setUploadImages(true);
    const uploadUrls: string[] = [];
    const previewUris: string[] = [];

    for (const asset of result.assets) {
      try {
        const filename = `property_${Date.now()}_${Math.random()
          .toString(36)
          .slice(2)}.jpg`;

        const base64 = asset.base64!;
        const buffer = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));

        const { error } = await authSupabase.storage
          .from("property-images")
          .upload(filename, buffer, {
            contentType: "image/jpeg",
            upsert: false,
          });

        if (error) throw error;

        const { data: urlData } = authSupabase.storage
          .from("property-images")
          .getPublicUrl(filename);

        uploadUrls.push(urlData.publicUrl);
        previewUris.push(asset.uri);
      } catch (error) {
        console.error("Upload error:", error);
        Alert.alert(
          "Upload Failed",
          "One or more images failed to upload.",
        );
      }
    }

    updateForm({
      images: [...form.images, ...uploadUrls],
      localImages: [...form.localImages, ...previewUris],
    });

    setUploadImages(false);
  };

  const handleRemoveImage = (index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    updateForm({
      images: form.images.filter((_, i) => i !== index),
      localImages: form.localImages.filter((_, i) => i !== index),
    });
  };

  const handleDetectLocation = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setDeletingLocation(true);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Location permission is required to detect coordinates.",
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      updateForm({
        latitude: String(location.coords.latitude),
        longitude: String(location.coords.longitude),
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    } catch (error) {
      Alert.alert("Error", "Could not detect location. Enter manually.");
    } finally {
      setDeletingLocation(false);
    }
  };

  const handleSUbmit = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    if (!form.title.trim())
      return Alert.alert("Validate", "Title is required.");

    if (!form.price)
      return Alert.alert("Validate", "Price is required.");

    const priceNum = form.price;
    if (isNaN(priceNum) || priceNum < MIN_PRICE)
      return Alert.alert("Validation", "Price must be greater than 0");
    if (priceNum > MAX_PRICE)
      return Alert.alert(
        "Validation",
        `Price cannot exceed ${MAX_PRICE.toLocaleString("en-IN")}.`,
      );

    if (!form.address.trim())
      return Alert.alert("Validation", "Address is required.");
    if (!form.city.trim())
      return Alert.alert("Validation", "City is required.");
    if (form.images.length === 0)
      return Alert.alert(
        "Validation",
        "Please upload at least one image.",
      );

    setSubmitting(true);

    const { error } = await authSupabase.from("properties").insert({
      title: form.title.trim(),
      description: form.description.trim(),
      price: priceNum,
      type: form.type,
      bedrooms: form.bedrooms,
      bathrooms: form.bathrooms,
      area_sqft: form.areaSqft ? Number(form.areaSqft) : null,
      address: form.address.trim(),
      city: form.city.trim(),
      latitude: form.latitude ? Number(form.latitude) : null,
      longitude: form.longitude ? Number(form.longitude) : null,
      images: form.images,
      is_featured: form.isFeatured,
      is_sold: false,
    });

    setSubmitting(false);
    if (error) {
      Alert.alert("Error", "Failed to create property. Please try again.");
      console.error(error);
      return;
    }

    setForm(INITIAL_FORM);
    setStep(1);

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    Alert.alert("Success", "Property listed successfully.", [
      { text: "ok", onPress: () => router.replace("/(root)/(tabs)") },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#fdf9f3]" edges={["top"]}>
      {/* Top Header with Progress */}
      <View className="flex-row justify-between items-center px-6 h-20 border-b border-[#00030c]/10 bg-[#fdf9f3] z-50">
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
            setForm(INITIAL_FORM);
            setStep(1);
            router.replace("/(root)/(tabs)");
          }}
          className="w-10 h-10 items-center justify-center rounded-full bg-[#f1ede8]/50 border border-[#00030c]/10"
        >
          <MaterialCommunityIcons name="close" size={20} color="#00030c" />
        </TouchableOpacity>

        {/* Progress Bar Container */}
        <View className="flex-1 px-5 justify-center">
          <View className="h-1.5 w-full bg-[#f1ede8] rounded-full overflow-hidden">
            <View
              className="h-full bg-[#76593b] rounded-full"
              style={{ width: step === 1 ? "33%" : step === 2 ? "66%" : "100%" }}
            />
          </View>
        </View>

        <Text className="text-[10px] font-bold text-[#76593b] uppercase tracking-[0.1em]">
          Step {step} of 3
        </Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          bounces={false}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
          className="flex-1 px-6 pt-6"
        >
          {step === 1 && (
            <View className="flex-col">
              <Text className="text-[32px] text-[#00030c] font-medium leading-10 mb-2">
                Begin your story
              </Text>
              <Text className="text-[14px] text-[#45474d] mb-8 leading-5">
                Every masterpiece starts with a vision. Share the beauty and title of your sanctuary.
              </Text>

              {/* Media gallery grid */}
              <View className="space-y-2 mb-6">
                <Text className="text-[10px] font-bold text-[#75777e] uppercase tracking-widest mb-3">
                  Media Gallery ({form.localImages.length} / 6)
                </Text>

                <View className="flex-row flex-wrap gap-3">
                  {form.localImages.map((uri, index) => (
                    <View key={index} className="w-[85px] h-[85px] rounded-xl overflow-hidden relative border border-[#00030c]/10 bg-white">
                      <Image source={{ uri }} className="w-full h-full object-cover" />
                      <TouchableOpacity
                        onPress={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 bg-black/60 p-1.5 rounded-full"
                      >
                        <MaterialCommunityIcons name="delete-outline" size={12} color="white" />
                      </TouchableOpacity>
                    </View>
                  ))}
                  {form.localImages.length < 6 && (
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={handlePickImages}
                      disabled={uploadImages}
                      className="w-[85px] h-[85px] border-dashed border-2 border-[#00030c]/20 rounded-xl items-center justify-center bg-[#fdf9f3]/50"
                    >
                      {uploadImages ? (
                        <ActivityIndicator size="small" color="#76593b" />
                      ) : (
                        <>
                          <MaterialCommunityIcons name="camera-plus-outline" size={20} color="#76593b" />
                          <Text className="text-[8px] font-bold text-[#75777e] mt-1.5 uppercase tracking-wider">Add Photo</Text>
                        </>
                      )}
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {/* Title input */}
              <View className="flex-col mb-6">
                <Text className="text-[10px] font-bold text-[#75777e] uppercase tracking-widest mb-2.5">
                  Property Title
                </Text>
                <TextInput
                  value={form.title}
                  onChangeText={(text) => updateForm({ title: text })}
                  placeholder="e.g. The Obsidian Sanctuary"
                  placeholderTextColor="#c5c6cd"
                  className="w-full bg-[#f7f3ee] border border-[#00030c]/10 rounded-xl py-4 px-5 text-[20px] text-[#00030c] font-medium transition-all focus:bg-white"
                />
              </View>

              {/* Description input */}
              <View className="flex-col">
                <Text className="text-[10px] font-bold text-[#75777e] uppercase tracking-widest mb-2.5">
                  Description
                </Text>
                <TextInput
                  value={form.description}
                  onChangeText={(text) => updateForm({ description: text })}
                  placeholder="Narrate the living experience..."
                  placeholderTextColor="#c5c6cd"
                  multiline={true}
                  numberOfLines={4}
                  textAlignVertical="top"
                  className="w-full bg-[#f7f3ee] border border-[#00030c]/10 rounded-xl py-4 px-5 text-[14px] text-[#00030c] min-h-[120px] transition-all focus:bg-white"
                />
              </View>
            </View>
          )}

          {step === 2 && (
            <View className="flex-col">
              <Text className="text-[32px] text-[#00030c] font-medium leading-10 mb-2">
                Define the essence
              </Text>
              <Text className="text-[14px] text-[#45474d] mb-8 leading-5">
                The architecture is in the details. Specify the dimensions and investment value.
              </Text>

              {/* Property Type Selection */}
              <View className="flex-col mb-6">
                <Text className="text-[10px] font-bold text-[#75777e] uppercase tracking-widest mb-3">
                  Property Type
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {TYPES.map((typeOption) => {
                    const isSelected = form.type === typeOption;
                    return (
                      <TouchableOpacity
                        key={typeOption}
                        activeOpacity={0.8}
                        onPress={() => {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                          updateForm({ type: typeOption });
                        }}
                        className={`px-5 py-2.5 rounded-full border border-[#00030c]/10 ${
                          isSelected ? "bg-[#00030c]" : "bg-[#f7f3ee]"
                        }`}
                      >
                        <Text
                          className={`text-[10px] font-bold uppercase tracking-widest ${
                            isSelected ? "text-white" : "text-[#75777e]"
                          }`}
                        >
                          {typeOption}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Bedrooms & Bathrooms Steppers */}
              <View className="flex-row gap-x-4 mb-6">
                <View className="flex-1">
                  <Text className="text-[10px] font-bold text-[#75777e] uppercase tracking-widest mb-2.5">
                    Bedrooms
                  </Text>
                  <View className="flex-row items-center justify-between bg-[#fdf9f3] border border-[#00030c]/10 px-3 py-2 rounded-xl">
                    <TouchableOpacity
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                        updateForm({ bedrooms: Math.max(1, form.bedrooms - 1) });
                      }}
                      className="w-8 h-8 rounded-full items-center justify-center bg-[#f1ede8] active:scale-95"
                    >
                      <MaterialCommunityIcons name="minus" size={16} color="#00030c" />
                    </TouchableOpacity>
                    <Text className="text-[18px] text-[#00030c] font-semibold">
                      {form.bedrooms < 10 ? `0${form.bedrooms}` : form.bedrooms}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                        updateForm({ bedrooms: form.bedrooms + 1 });
                      }}
                      className="w-8 h-8 rounded-full items-center justify-center bg-[#f1ede8] active:scale-95"
                    >
                      <MaterialCommunityIcons name="plus" size={16} color="#00030c" />
                    </TouchableOpacity>
                  </View>
                </View>

                <View className="flex-1">
                  <Text className="text-[10px] font-bold text-[#75777e] uppercase tracking-widest mb-2.5">
                    Bathrooms
                  </Text>
                  <View className="flex-row items-center justify-between bg-[#fdf9f3] border border-[#00030c]/10 px-3 py-2 rounded-xl">
                    <TouchableOpacity
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                        updateForm({ bathrooms: Math.max(1, form.bathrooms - 1) });
                      }}
                      className="w-8 h-8 rounded-full items-center justify-center bg-[#f1ede8] active:scale-95"
                    >
                      <MaterialCommunityIcons name="minus" size={16} color="#00030c" />
                    </TouchableOpacity>
                    <Text className="text-[18px] text-[#00030c] font-semibold">
                      {form.bathrooms < 10 ? `0${form.bathrooms}` : form.bathrooms}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                        updateForm({ bathrooms: form.bathrooms + 1 });
                      }}
                      className="w-8 h-8 rounded-full items-center justify-center bg-[#f1ede8] active:scale-95"
                    >
                      <MaterialCommunityIcons name="plus" size={16} color="#00030c" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Area (sq ft) input */}
              <View className="flex-col mb-6">
                <Text className="text-[10px] font-bold text-[#75777e] uppercase tracking-widest mb-2.5">
                  Area (Sq Ft)
                </Text>
                <TextInput
                  value={form.areaSqft ? String(form.areaSqft) : ""}
                  onChangeText={(text) => updateForm({ areaSqft: Number(text) || 0 })}
                  placeholder="e.g. 2400"
                  placeholderTextColor="#c5c6cd"
                  keyboardType="numeric"
                  className="w-full bg-[#f7f3ee] border border-[#00030c]/10 rounded-xl py-3.5 px-5 text-[16px] text-[#00030c] font-medium transition-all focus:bg-white"
                />
              </View>

              {/* Listing Price input */}
              <View className="flex-col">
                <Text className="text-[10px] font-bold text-[#75777e] uppercase tracking-widest mb-2.5">
                  Listing Price (USD)
                </Text>
                <View className="relative">
                  <Text className="absolute left-5 top-4 text-[16px] text-[#76593b] font-bold">$</Text>
                  <TextInput
                    value={form.price ? String(form.price) : ""}
                    onChangeText={(text) => updateForm({ price: Number(text) || 0 })}
                    placeholder="0"
                    placeholderTextColor="#c5c6cd"
                    keyboardType="numeric"
                    className="w-full bg-[#f7f3ee] border border-[#00030c]/10 rounded-xl py-3.5 pl-9 pr-5 text-[16px] text-[#00030c] font-medium transition-all focus:bg-white"
                  />
                </View>
              </View>
            </View>
          )}

          {step === 3 && (
            <View className="flex-col">
              <Text className="text-[32px] text-[#00030c] font-medium leading-10 mb-2">
                The HAVN's Anchor
              </Text>
              <Text className="text-[14px] text-[#45474d] mb-8 leading-5">
                Precision in placement ensures the right souls find your retreat.
              </Text>

              {/* Abstract Map Graphic Pin Location */}
              <View className="h-44 w-full rounded-2xl overflow-hidden border border-[#00030c]/10 relative bg-[#f1ede8] justify-center items-center mb-6">
                <View className="absolute inset-0 opacity-10 flex-row flex-wrap">
                  {Array.from({ length: 48 }).map((_, i) => (
                    <View key={i} className="w-12 h-12 border border-[#00030c]/40" />
                  ))}
                </View>
                <View className="absolute w-8 h-8 bg-[#76593b]/10 rounded-full border border-[#76593b]/30 items-center justify-center shadow-lg">
                  <View className="w-2.5 h-2.5 bg-[#76593b] rounded-full" />
                </View>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handleDetectLocation}
                  disabled={deletingLocation}
                  className="absolute bottom-3 right-3 bg-[#fdf9f3]/95 border border-[#00030c]/20 px-3.5 py-2 rounded-full flex-row items-center shadow-md active:scale-95 duration-200"
                >
                  {deletingLocation ? (
                    <ActivityIndicator size="small" color="#00030c" className="mr-1.5" />
                  ) : (
                    <MaterialCommunityIcons name="crosshairs-gps" size={14} color="#00030c" className="mr-1.5" />
                  )}
                  <Text className="text-[9px] font-bold text-[#00030c] tracking-widest uppercase">
                    {deletingLocation ? "Detecting..." : "Detect Location"}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Street Address & City */}
              <View className="flex-col gap-y-4 mb-6">
                <View className="flex-col">
                  <Text className="text-[10px] font-bold text-[#75777e] uppercase tracking-widest mb-2.5">
                    Street Address
                  </Text>
                  <TextInput
                    value={form.address}
                    onChangeText={(text) => updateForm({ address: text })}
                    placeholder="123 Sanctuary Drive"
                    placeholderTextColor="#c5c6cd"
                    className="w-full bg-[#f7f3ee] border border-[#00030c]/10 rounded-xl py-3.5 px-5 text-[15px] text-[#00030c] transition-all focus:bg-white"
                  />
                </View>

                <View className="flex-col">
                  <Text className="text-[10px] font-bold text-[#75777e] uppercase tracking-widest mb-2.5">
                    City
                  </Text>
                  <TextInput
                    value={form.city}
                    onChangeText={(text) => updateForm({ city: text })}
                    placeholder="Dubai, UAE"
                    placeholderTextColor="#c5c6cd"
                    className="w-full bg-[#f7f3ee] border border-[#00030c]/10 rounded-xl py-3.5 px-5 text-[15px] text-[#00030c] transition-all focus:bg-white"
                  />
                </View>
              </View>

              {/* Latitude & Longitude */}
              <View className="flex-row gap-x-4 mb-6">
                <View className="flex-1">
                  <Text className="text-[10px] font-bold text-[#75777e] uppercase tracking-widest mb-2.5">
                    Latitude
                  </Text>
                  <TextInput
                    value={form.latitude}
                    onChangeText={(text) => updateForm({ latitude: text })}
                    placeholder="0.0000"
                    placeholderTextColor="#c5c6cd"
                    keyboardType="numeric"
                    className="w-full bg-[#f7f3ee] border border-[#00030c]/10 rounded-xl py-3.5 px-5 text-[14px] text-[#00030c] transition-all focus:bg-white"
                  />
                </View>

                <View className="flex-1">
                  <Text className="text-[10px] font-bold text-[#75777e] uppercase tracking-widest mb-2.5">
                    Longitude
                  </Text>
                  <TextInput
                    value={form.longitude}
                    onChangeText={(text) => updateForm({ longitude: text })}
                    placeholder="0.0000"
                    placeholderTextColor="#c5c6cd"
                    keyboardType="numeric"
                    className="w-full bg-[#f7f3ee] border border-[#00030c]/10 rounded-xl py-3.5 px-5 text-[14px] text-[#00030c] transition-all focus:bg-white"
                  />
                </View>
              </View>

              {/* Featured Selection Toggle Switch */}
              <View className="flex-row items-center justify-between bg-[#fdf9f3]/70 border border-[#00030c]/10 p-5 rounded-2xl shadow-sm">
                <View className="flex-1 pr-4">
                  <Text className="text-[16px] text-[#00030c] font-semibold mb-0.5">Featured Selection</Text>
                  <Text className="text-[11px] text-[#75777e] leading-4">
                    Promote this as a premium highlight on the HAVN homepage feed.
                  </Text>
                </View>
                <Switch
                  value={form.isFeatured}
                  onValueChange={(val) => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                    updateForm({ isFeatured: val });
                  }}
                  trackColor={{ false: "#e6e2dd", true: "#76593b" }}
                  thumbColor={Platform.OS === "android" ? "#fdf9f3" : undefined}
                />
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Sticky Bottom Action Footer */}
      <View className="absolute bottom-0 left-0 w-full bg-[#fdf9f3]/95 border-t border-[#00030c]/10 py-5 px-6 flex-row items-center justify-between z-40 shadow-lg">
        {step > 1 && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
              setStep((prev) => prev - 1);
            }}
            className="py-4 px-5 items-center justify-center rounded-xl"
          >
            <Text className="text-[#75777e] text-[12px] font-bold uppercase tracking-widest">
              Previous
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            if (step < 3) {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
              setStep((prev) => prev + 1);
            } else {
              handleSUbmit();
            }
          }}
          className={`py-4 rounded-xl items-center shadow-lg active:scale-95 duration-200 ${
            step > 1 ? "flex-1 ml-4" : "w-full"
          } ${step === 3 ? "bg-[#76593b]" : "bg-[#00030c]"}`}
        >
          <Text className="text-white text-[12px] font-bold uppercase tracking-widest">
            {step === 3 ? "List Property" : "Continue"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Absolute Fullscreen Submitting Overlay Loader */}
      {submitting && (
        <View className="absolute inset-0 bg-black/60 items-center justify-center z-50">
          <View className="bg-[#fdf9f3] p-8 rounded-2xl items-center shadow-2xl border border-white/20 mx-10 max-w-[280px]">
            <ActivityIndicator size="large" color="#76593b" className="mb-4" />
            <Text className="text-[14px] text-[#00030c] font-bold text-center tracking-wide uppercase">
              Securing Sanctuary
            </Text>
            <Text className="text-[11px] text-[#75777e] mt-2 text-center leading-4">
              Recording details and connecting coordinates to the HAVN network...
            </Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}