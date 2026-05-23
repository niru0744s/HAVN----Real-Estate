import PropertyCard from '@/app/components/propertyCard';
import { useSavedProperty } from '@/hooks/useSavedProperty';
import { supabase } from '@/lib/supabase';
import { formatPrice } from '@/lib/utils';
import { Property } from '@/types';
import { useUser } from '@clerk/expo';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function FeaturedBookmarkButton({ propertyId }: { propertyId: string }) {
  const { isSaved, toggleSave, saveLoading } = useSavedProperty(propertyId);

  const handlePress = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    await toggleSave();
  };

  return (
    <TouchableOpacity onPress={handlePress} disabled={saveLoading} className="active:scale-95 duration-200">
      <MaterialCommunityIcons 
        name={isSaved ? "bookmark" : "bookmark-outline"} 
        size={24} 
        color={isSaved ? "#76593b" : "#00030c"} 
      />
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const { user } = useUser();
  const router = useRouter();

  const [featured, setFeatured] = useState<Property[]>([]);
  const [recommended, setRecommended] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 }).current;

  const onViewableItemsChanged = useCallback(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  }, []);

  const fetchProperties = async () => {
    setLoading(true);

    const { data: featuredData } = await supabase
      .from("properties")
      .select("*")
      .eq("is_featured", true)
      .order("created_at", { ascending: false });

    const { data: recommendedData } = await supabase
      .from("properties")
      .select("*")
      .eq("is_featured", true)
      .order("created_at", { ascending: false });

    setFeatured(featuredData ?? []);
    setRecommended(recommendedData ?? []);
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchProperties();
    }, []),
  );

  return (
    <SafeAreaView className='flex-1 bg-[#fdf9f3]' edges={['top']}>
      {/* Header */}
      <View className="flex-row justify-between items-center px-6 h-20 bg-[#fdf9f3]/90 border-b border-[#00030c]/10 z-50">
        <TouchableOpacity 
          className="p-2 active:scale-95 duration-200"
          onPress={() => router.push('/search')}
        >
          <MaterialCommunityIcons name="magnify" size={24} color="#75777e" />
        </TouchableOpacity>

        <View style={{ position: 'absolute', left: '50%', transform: [{ translateX: '-50%' }] }}>
          <Text style={{ fontSize: 36, letterSpacing: -1, color: '#00030c', fontWeight: '500' }}>
            HAVN
          </Text>
        </View>

        <TouchableOpacity 
          className="p-2 active:scale-95 duration-200"
          onPress={() => router.push({ pathname: '/search', params: { openFilters: 'true' } })}
        >
          <MaterialCommunityIcons name="tune" size={24} color="#75777e" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#00030c" />
        </View>
      ) : (
        <ScrollView className="flex-1 pb-12" showsVerticalScrollIndicator={false} bounces={false}>
          {/* Hero Slider Section */}
          <View className="w-full mb-8 relative">
            <FlatList
              data={featured}
              keyExtractor={item => item.id}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onViewableItemsChanged={onViewableItemsChanged}
              viewabilityConfig={viewabilityConfig}
              renderItem={({ item }) => (
                <View style={{ width: Dimensions.get('window').width, height: 500 }}>
                  <Image 
                  source={{
                    uri:
                        item.images.length>0
                        ? item.images?.[0] 
                        : require("@/assets/images/HAVNlogo.png")
                    }}
                  className="w-full h-full object-cover" />
                  <View className="absolute inset-0 bg-black/40" />
                </View>
              )}
            />

            {/* Dynamic Property Details Overlay */}
            {featured[activeIndex] && (
              <View className="absolute bottom-6 left-6 right-6 bg-[#fdf9f3]/90 rounded-xl p-6 shadow-lg border border-white/50">
                <View className="flex-row justify-between items-start mb-4">
                  <View>
                    <Text className="text-[12px] uppercase tracking-[0.08em] text-[#76593b] font-bold mb-1">
                      Featured Sanctuary
                    </Text>
                    <Text className="text-[32px] text-[#00030c] font-medium leading-10">
                      {featured[activeIndex].title}
                    </Text>
                  </View>
                  <FeaturedBookmarkButton propertyId={featured[activeIndex].id} />
                </View>
                <View className="flex-row items-center mb-4">
                  <MaterialCommunityIcons name="map-marker-outline" size={16} color="#45474d" />
                  <Text className="text-[14px] text-[#45474d] ml-1">
                    {featured[activeIndex].city}
                  </Text>
                </View>
                <View className="flex-row justify-between items-end border-t border-[#00030c]/10 pt-4">
                  <Text className="text-[20px] text-[#00030c] font-semibold">
                    {formatPrice(featured[activeIndex].price)}
                  </Text>
                  <TouchableOpacity className="bg-[#00030c] px-6 py-2 rounded">
                    <Text className="text-white text-[16px]">View</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          {/* Recommended Section */}
          <View className="px-6 mb-10">
            <View className="flex-row justify-between items-end mb-6">
              <Text className="text-[36px] text-[#00030c] font-medium tracking-tight">
                Curated Listings
              </Text>
              <TouchableOpacity className="flex-row items-center mb-2">
                <Text className="text-[12px] uppercase tracking-[0.08em] text-[#76593b] font-bold mr-1">
                  See All
                </Text>
                <MaterialCommunityIcons name="arrow-right" size={14} color="#76593b" />
              </TouchableOpacity>
            </View>

            <View className="flex-col gap-y-6">
              {recommended.map((item) => (
                <PropertyCard key={item.id} property={item} />
              ))}
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}