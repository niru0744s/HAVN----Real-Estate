import { useAuth, useUser } from '@clerk/expo';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from "expo-image-picker";
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Profile() {
  const { signOut } = useAuth();
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState<'account' | 'preferences' | 'support'>('account');

  const handleSignOut = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    try {
      await signOut();
      router.replace("/sign-in");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleUpdateProfileImage = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          "Permission Required",
          "Please allow access to your photo library to update your profile picture.",
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });

      if (result.canceled) return;

      setIsUpdating(true);

      const base64Image = result.assets[0].base64;
      const uri = result.assets[0].uri;
      const filename = uri.split("/").pop() || "profile.jpg";

      const match = /\.(\w+)$/.exec(filename);
      const mimeType = match ? `image/${match[1]}` : "image/jpeg";
      const dataUrl = `data:${mimeType};base64,${base64Image}`;

      await user?.setProfileImage({ file: dataUrl });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      Alert.alert("Success", "Profile picture updated successfully!");
    } catch (error) {
      console.error("Error updating profile image:", error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
      Alert.alert(
        "Error",
        "Failed to update profile picture. Please try again.",
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handleComingSoon = (featureName: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    Alert.alert(
      "Feature Coming Soon",
      `"${featureName}" is under development. Stay tuned for future HAVN sanctuary updates!`
    );
  };

  if (!isLoaded || !user) {
    return (
      <SafeAreaView className="flex-1 bg-[#fdf9f3] justify-center items-center">
        <ActivityIndicator size="large" color="#00030c" />
      </SafeAreaView>
    );
  }

  const joinYear = user.createdAt ? new Date(user.createdAt).getFullYear() : 2024;

  return (
    <SafeAreaView className="flex-1 bg-[#fdf9f3]" edges={['top']}>
      {/* Top Header */}
      <View className="flex-row justify-between items-center px-6 h-16 border-b border-[#00030c]/10">
        <TouchableOpacity 
          className="p-2 active:scale-95 duration-200" 
          onPress={() => handleComingSoon("Menu")}
        >
          <MaterialCommunityIcons name="menu" size={24} color="#00030c" />
        </TouchableOpacity>
        <Text style={{ fontSize: 24, letterSpacing: -1, color: '#00030c', fontWeight: '500' }}>
          HAVN
        </Text>
        <TouchableOpacity 
          className="p-2 active:scale-95 duration-200"
          onPress={() => handleComingSoon("Notifications")}
        >
          <MaterialCommunityIcons name="bell-outline" size={24} color="#00030c" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between', paddingBottom: 24 }}
      >
        <View className="flex-col pt-6">
          {/* Headline */}
          <Text className="text-[32px] text-[#00030c] font-medium tracking-tight px-6 mb-5 text-center">
            Account
          </Text>

          {/* Profile Hero section (horizontal) */}
          <View className="flex-row items-center px-6 mb-6">
            <View className="relative">
              <TouchableOpacity 
                activeOpacity={0.8}
                onPress={handleUpdateProfileImage}
                disabled={isUpdating}
                className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#00030c]/5 bg-[#f1ede8] justify-center items-center"
              >
                {isUpdating ? (
                  <ActivityIndicator color="#76593b" size="small" />
                ) : user.imageUrl ? (
                  <Image source={{ uri: user.imageUrl }} className="w-full h-full object-cover" />
                ) : (
                  <MaterialCommunityIcons name="account" size={40} color="#76593b" />
                )}
              </TouchableOpacity>
              <TouchableOpacity 
                activeOpacity={0.8}
                onPress={handleUpdateProfileImage}
                disabled={isUpdating}
                className="absolute bottom-0 right-0 bg-[#00030c] p-1.5 rounded-full shadow-md active:scale-90"
              >
                <MaterialCommunityIcons name="pencil" size={10} color="#fdf9f3" />
              </TouchableOpacity>
            </View>

            <View className="flex-col justify-center ml-4 flex-1">
              <Text className="text-[24px] text-[#00030c] font-semibold leading-7 mb-1.5" numberOfLines={1}>
                {user.fullName || "Alexander Vance"}
              </Text>
              <View className="flex-row items-center flex-wrap gap-1.5">
                <View className="bg-[#76593b]/10 px-2 py-0.5 rounded-full">
                  <Text className="text-[8px] font-bold text-[#76593b] uppercase tracking-widest">
                    Since {joinYear}
                  </Text>
                </View>
                <View className="w-1 h-1 rounded-full bg-[#76593b]" />
                <Text className="text-[11px] text-[#45474d] font-semibold">
                  Verified Resident
                </Text>
              </View>
            </View>
          </View>

          {/* Quick Stats Bento Row (horizontal) */}
          <View className="flex-row gap-x-3 mb-6 px-6">
            <TouchableOpacity 
              activeOpacity={0.9}
              onPress={() => router.push("/(root)/(tabs)/saved")}
              className="flex-1 bg-[#f1ede8]/50 border border-[#00030c]/5 p-3.5 rounded-xl items-center shadow-sm active:scale-95 duration-200"
            >
              <MaterialCommunityIcons name="bookmark-outline" size={18} color="#00030c" />
              <Text className="text-[18px] text-[#00030c] font-bold mt-1">3</Text>
              <Text className="text-[9px] uppercase tracking-[0.08em] text-[#75777e] font-bold mt-0.5">Saved</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              activeOpacity={0.9}
              onPress={() => handleComingSoon("Inquiries")}
              className="flex-1 bg-[#f1ede8]/50 border border-[#00030c]/5 p-3.5 rounded-xl items-center shadow-sm active:scale-95 duration-200"
            >
              <MaterialCommunityIcons name="chat-processing-outline" size={18} color="#00030c" />
              <Text className="text-[18px] text-[#00030c] font-bold mt-1">2</Text>
              <Text className="text-[9px] uppercase tracking-[0.08em] text-[#75777e] font-bold mt-0.5">Inquiries</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              activeOpacity={0.9}
              onPress={() => handleComingSoon("Premium Membership")}
              className="flex-1 bg-[#76593b]/5 border border-[#76593b]/20 p-3.5 rounded-xl items-center shadow-sm active:scale-95 duration-200"
            >
              <MaterialCommunityIcons name="seal" size={18} color="#76593b" />
              <Text className="text-[15px] text-[#76593b] font-bold mt-1">Premium</Text>
              <Text className="text-[9px] uppercase tracking-[0.08em] text-[#76593b] font-bold mt-0.5">Status</Text>
            </TouchableOpacity>
          </View>

          {/* Custom Tabs (Segmented Control) */}
          <View className="flex-row bg-[#f1ede8] p-1 rounded-full mx-6 mb-5">
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                setActiveTab('account');
              }}
              className={`flex-1 py-2 rounded-full items-center ${activeTab === 'account' ? 'bg-[#00030c]' : ''}`}
            >
              <Text className={`text-[11px] uppercase tracking-[0.06em] font-bold ${activeTab === 'account' ? 'text-white' : 'text-[#75777e]'}`}>
                Account
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                setActiveTab('preferences');
              }}
              className={`flex-1 py-2 rounded-full items-center ${activeTab === 'preferences' ? 'bg-[#00030c]' : ''}`}
            >
              <Text className={`text-[11px] uppercase tracking-[0.06em] font-bold ${activeTab === 'preferences' ? 'text-white' : 'text-[#75777e]'}`}>
                Preferences
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                setActiveTab('support');
              }}
              className={`flex-1 py-2 rounded-full items-center ${activeTab === 'support' ? 'bg-[#00030c]' : ''}`}
            >
              <Text className={`text-[11px] uppercase tracking-[0.06em] font-bold ${activeTab === 'support' ? 'text-white' : 'text-[#75777e]'}`}>
                Support
              </Text>
            </TouchableOpacity>
          </View>

          {/* Active Tab Panel */}
          <View className="mx-6 bg-[#fdf9f3]/70 border border-[#00030c]/10 rounded-2xl overflow-hidden shadow-sm min-h-[220px]">
            {activeTab === 'account' && (
              <View>
                <TouchableOpacity 
                  onPress={() => handleComingSoon("Personal Information")}
                  className="flex-row justify-between items-center p-4 border-b border-[#00030c]/5 active:bg-[#00030c]/5"
                >
                  <View className="flex-row items-center">
                    <MaterialCommunityIcons name="account-outline" size={20} color="#45474d" />
                    <Text className="text-[14px] text-[#00030c] font-medium ml-3.5">Personal Information</Text>
                  </View>
                  <MaterialCommunityIcons name="chevron-right" size={20} color="#75777e" />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  onPress={() => handleComingSoon("Security")}
                  className="flex-row justify-between items-center p-4 border-b border-[#00030c]/5 active:bg-[#00030c]/5"
                >
                  <View className="flex-row items-center">
                    <MaterialCommunityIcons name="shield-check-outline" size={20} color="#45474d" />
                    <Text className="text-[14px] text-[#00030c] font-medium ml-3.5">Security</Text>
                  </View>
                  <MaterialCommunityIcons name="chevron-right" size={20} color="#75777e" />
                </TouchableOpacity>

                <TouchableOpacity 
                  onPress={() => handleComingSoon("Notifications")}
                  className="flex-row justify-between items-center p-4 active:bg-[#00030c]/5"
                >
                  <View className="flex-row items-center">
                    <MaterialCommunityIcons name="bell-outline" size={20} color="#45474d" />
                    <Text className="text-[14px] text-[#00030c] font-medium ml-3.5">Notifications</Text>
                  </View>
                  <View className="flex-row items-center">
                    <Text className="text-[9px] font-bold uppercase tracking-[0.08em] text-[#76593b] mr-1">All Enabled</Text>
                    <MaterialCommunityIcons name="chevron-right" size={20} color="#75777e" />
                  </View>
                </TouchableOpacity>
              </View>
            )}

            {activeTab === 'preferences' && (
              <View className="p-4 gap-y-3.5">
                <View>
                  <View className="flex-row items-center mb-2">
                    <MaterialCommunityIcons name="tune" size={16} color="#45474d" />
                    <Text className="text-[12px] font-bold text-[#00030c] ml-2 tracking-wide">Search Filters</Text>
                  </View>
                  <View className="flex-row flex-wrap gap-1.5 pl-6">
                    <View className="bg-[#f1ede8] px-2.5 py-0.5 rounded-full"><Text className="text-[10px] text-[#45474d] font-semibold">4+ Bedrooms</Text></View>
                    <View className="bg-[#f1ede8] px-2.5 py-0.5 rounded-full"><Text className="text-[10px] text-[#45474d] font-semibold">Sea Facing</Text></View>
                    <View className="bg-[#f1ede8] px-2.5 py-0.5 rounded-full"><Text className="text-[10px] text-[#45474d] font-semibold">Private Pool</Text></View>
                  </View>
                </View>

                <View>
                  <View className="flex-row items-center mb-2">
                    <MaterialCommunityIcons name="map-marker-outline" size={16} color="#45474d" />
                    <Text className="text-[12px] font-bold text-[#00030c] ml-2 tracking-wide">Desired Locations</Text>
                  </View>
                  <View className="flex-row flex-wrap gap-1.5 pl-6">
                    <View className="bg-[#76593b]/10 px-2.5 py-0.5 rounded-full"><Text className="text-[10px] text-[#76593b] font-bold uppercase tracking-wider">Mumbai</Text></View>
                    <View className="bg-[#76593b]/10 px-2.5 py-0.5 rounded-full"><Text className="text-[10px] text-[#76593b] font-bold uppercase tracking-wider">Worli</Text></View>
                  </View>
                </View>

                <View>
                  <View className="flex-row items-center mb-2">
                    <MaterialCommunityIcons name="home-outline" size={16} color="#45474d" />
                    <Text className="text-[12px] font-bold text-[#00030c] ml-2 tracking-wide">Architectural Style</Text>
                  </View>
                  <View className="flex-row flex-wrap gap-1.5 pl-6">
                    <View className="bg-[#00030c]/5 border border-[#00030c]/10 px-2.5 py-0.5 rounded-full"><Text className="text-[10px] text-[#00030c] font-semibold">Modern</Text></View>
                    <View className="bg-[#00030c]/5 border border-[#00030c]/10 px-2.5 py-0.5 rounded-full"><Text className="text-[10px] text-[#00030c] font-semibold">Minimalist</Text></View>
                  </View>
                </View>
              </View>
            )}

            {activeTab === 'support' && (
              <View>
                <TouchableOpacity 
                  onPress={() => handleComingSoon("Concierge Support")}
                  className="flex-row justify-between items-center p-4 border-b border-[#00030c]/5 active:bg-[#00030c]/5"
                >
                  <View className="flex-row items-center">
                    <MaterialCommunityIcons name="face-agent" size={20} color="#45474d" />
                    <Text className="text-[14px] text-[#00030c] font-medium ml-3.5">Concierge</Text>
                  </View>
                  <MaterialCommunityIcons name="chevron-right" size={20} color="#75777e" />
                </TouchableOpacity>

                <TouchableOpacity 
                  onPress={() => handleComingSoon("Help Center")}
                  className="flex-row justify-between items-center p-4 border-b border-[#00030c]/5 active:bg-[#00030c]/5"
                >
                  <View className="flex-row items-center">
                    <MaterialCommunityIcons name="help-circle-outline" size={20} color="#45474d" />
                    <Text className="text-[14px] text-[#00030c] font-medium ml-3.5">Help Center</Text>
                  </View>
                  <MaterialCommunityIcons name="chevron-right" size={20} color="#75777e" />
                </TouchableOpacity>

                <TouchableOpacity 
                  onPress={() => handleComingSoon("Legal Terms & Info")}
                  className="flex-row justify-between items-center p-4 active:bg-[#00030c]/5"
                >
                  <View className="flex-row items-center">
                    <MaterialCommunityIcons name="gavel" size={20} color="#45474d" />
                    <Text className="text-[14px] text-[#00030c] font-medium ml-3.5">Legal</Text>
                  </View>
                  <MaterialCommunityIcons name="chevron-right" size={20} color="#75777e" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* Footer with Log Out and Version */}
        <View className="mt-8 items-center px-6">
          <TouchableOpacity 
            activeOpacity={0.8}
            onPress={handleSignOut}
            className="px-10 py-3.5 rounded-full border border-[#00030c]/15 bg-white/40 shadow-sm active:scale-95 duration-200"
          >
            <Text className="text-[#45474d] text-[11px] font-bold tracking-widest uppercase">
              Log Out
            </Text>
          </TouchableOpacity>
          <Text className="mt-6 text-[10px] text-[#75777e] font-medium">
            HAVN Realty • Version 2.4.1
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}