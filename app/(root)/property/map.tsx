import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const triggerHaptic = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
};

export default function MapScreen() {
  const { latitude, longitude, title, address } = useLocalSearchParams<{
    latitude: string;
    longitude: string;
    title: string;
    address: string;
  }>();
  const router = useRouter();
  const [mapLoading, setMapLoading] = useState(true);

  const lat = parseFloat(latitude || "0");
  const lng = parseFloat(longitude || "0");

  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${
    lng - 0.005
  }%2C${lat - 0.005}%2C${lng + 0.005}%2C${
    lat + 0.005
  }&layer=mapnik&marker=${lat}%2C${lng}`;

  const handleOpenGoogleMaps = () => {
    triggerHaptic();
    // Open in Google Maps
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    Linking.openURL(googleMapsUrl).catch((err) => {
      console.error("Failed to open Google Maps:", err);
    });
  };

  const handleGetDirections = () => {
    triggerHaptic();
    // Open directions in Google Maps
    const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    Linking.openURL(directionsUrl).catch((err) => {
      console.error("Failed to open directions:", err);
    });
  };

  return (
    <View className="flex-1 bg-[#fdf9f3]">
      
      {/* Floating Top Header Bar */}
      <View className="absolute top-12 left-6 right-6 z-50 flex-row gap-3 items-center">
        
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => {
            triggerHaptic();
            router.back();
          }}
          activeOpacity={0.85}
          className="w-12 h-12 rounded-full bg-[#fdf9f3]/95 border border-[#00030c]/10 items-center justify-center shadow-lg"
        >
          <MaterialCommunityIcons name="arrow-left" size={22} color="#00030c" />
        </TouchableOpacity>

        {/* Google Maps Link Header Button */}
        <TouchableOpacity
          onPress={handleOpenGoogleMaps}
          activeOpacity={0.9}
          className="flex-1 h-12 bg-[#00030c] rounded-full flex-row items-center justify-center gap-2 shadow-lg px-4"
        >
          <MaterialCommunityIcons name="google-maps" size={18} color="#ffffff" />
          <Text className="text-white text-[11px] font-bold tracking-widest uppercase">
            Open in Google Maps
          </Text>
        </TouchableOpacity>

      </View>

      {/* Main Map Viewport */}
      <View className="flex-1 bg-[#f1ede8] relative">
        <WebView
          source={{ uri: mapUrl }}
          style={{ flex: 1 }}
          domStorageEnabled={true}
          javaScriptEnabled={true}
          onLoadStart={() => setMapLoading(true)}
          onLoadEnd={() => setMapLoading(false)}
        />
        
        {mapLoading && (
          <View className="absolute inset-0 items-center justify-center bg-[#fdf9f3]/50">
            <ActivityIndicator size="large" color="#00030c" />
          </View>
        )}
      </View>

      {/* Floating Bottom Info Panel (Context Card) */}
      <View className="absolute bottom-8 left-6 right-6 bg-[#fdf9f3]/95 border border-[#00030c]/10 p-5 rounded-3xl shadow-2xl z-50">
        <View className="mb-4">
          <Text className="text-[11px] font-bold text-[#76593b] tracking-widest uppercase mb-1">
            Sanctuary Location
          </Text>
          <Text className="text-[20px] font-bold text-[#00030c] leading-7 mb-1.5" numberOfLines={1}>
            {title || "Residence Details"}
          </Text>
          <View className="flex-row items-center gap-1.5">
            <MaterialCommunityIcons name="map-marker-outline" size={15} color="#76593b" />
            <Text className="text-[13px] text-[#45474d] font-medium flex-1" numberOfLines={1}>
              {address || "Exact coordinates located"}
            </Text>
          </View>
        </View>

        {/* Driving Directions Button */}
        <TouchableOpacity
          onPress={handleGetDirections}
          activeOpacity={0.85}
          className="w-full py-4 border border-[#00030c] rounded-full flex-row items-center justify-center gap-2"
        >
          <MaterialCommunityIcons name="navigation-variant-outline" size={16} color="#00030c" />
          <Text className="text-[#00030c] text-[11px] font-bold tracking-widest uppercase">
            Get Driving Directions
          </Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}
