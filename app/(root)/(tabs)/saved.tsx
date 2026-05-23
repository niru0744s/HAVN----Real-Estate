import PropertyCard from '@/app/components/propertyCard';
import { useSupabase } from '@/hooks/useSupabase';
import { Property } from '@/types';
import { useAuth } from '@clerk/expo';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface SavedProperty {
  id: string;
  property_id: string;
  properties: Property;
}

export default function Saved() {
  const { userId } = useAuth();
  const authSupabase = useSupabase();
  const router = useRouter();

  const [saved, setSaved] = useState<SavedProperty[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSaved = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const { data } = await authSupabase
        .from("saved_properties")
        .select("id, property_id, properties(*)")
        .eq("user_clerk_id", userId)
        .order("id", { ascending: false });

      setSaved((data as unknown as SavedProperty[]) ?? []);
    } catch (err) {
      console.error("Error fetching saved properties:", err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Refresh every time the tab comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchSaved();
    }, [fetchSaved])
  );

  // Filter out any entries where property details were deleted from database
  const validSaved = saved.filter((item) => item.properties !== null);

  const renderHeader = () => (
    <View className="pt-6 pb-4">
      <Text className="text-[10px] font-bold text-[#76593b] tracking-[0.16em] uppercase mb-1">
        COLLECTION
      </Text>
      <Text className="text-[28px] font-bold text-[#00030c] leading-9 mb-1">
        Saved Sanctuaries
      </Text>
      <Text className="text-[13px] text-[#45474d] font-semibold">
        {validSaved.length} {validSaved.length === 1 ? 'residence' : 'residences'} bookmarked
      </Text>
    </View>
  );

  const renderEmpty = () => (
    <View className="flex-1 justify-center items-center py-20 px-6">
      <View className="w-20 h-20 rounded-full bg-[#f1ede8] items-center justify-center mb-6">
        <MaterialCommunityIcons name="bookmark-outline" size={36} color="#76593b" />
      </View>
      <Text className="text-[20px] font-bold text-[#00030c] text-center mb-2">
        No Saved Sanctuaries
      </Text>
      <Text className="text-[14px] text-[#45474d] text-center leading-5 mb-8 max-w-[280px]">
        Explore our curated collection of handpicked residences and save your favorites here.
      </Text>
      <TouchableOpacity
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
          router.replace("/(root)/(tabs)");
        }}
        activeOpacity={0.8}
        className="bg-[#00030c] px-8 py-4 rounded-full shadow-md active:scale-95"
      >
        <Text className="text-white text-[11px] font-bold tracking-widest uppercase">
          EXPLORE HOMES
        </Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-[#fdf9f3] justify-center items-center">
        <ActivityIndicator size="large" color="#00030c" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#fdf9f3]">
      <FlatList
        data={validSaved}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: 40,
          gap: 20,
        }}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        renderItem={({ item }) => (
          <PropertyCard property={item.properties} onUnsave={fetchSaved} />
        )}
      />
    </SafeAreaView>
  );
}