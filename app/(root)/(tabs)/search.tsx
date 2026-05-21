import FilterModel from '@/app/components/FilterModel';
import PropertyCard from '@/app/components/propertyCard';
import SelectedFilterChips from '@/app/components/SelectedFilterChips';
import { supabase } from '@/lib/supabase';
import { useFilterStore } from '@/store/filterStrore';
import { Property } from '@/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const triggerHaptic = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
};

export default function Search() {
  const [results, setResults] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const { openFilters } = useLocalSearchParams<{ openFilters?: string }>();

  const {
    search,
    type,
    bedrooms,
    minPrice,
    maxPrice,
    setSearch,
  } = useFilterStore();

  const [localSearch, setLocalSearch] = useState(search);

  // Sync modal open triggers
  useEffect(() => {
    if (openFilters === "true") {
      setShowFilter(true);
    }
  }, [openFilters]);

  // Sync input text with store if store is reset
  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  // Debounce search input text
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearch(localSearch);
    }, 400);

    return () => {
      clearTimeout(handler);
    };
  }, [localSearch]);

  const activeFilterCount = [
    type !== null,
    bedrooms !== null,
    minPrice !== null,
    maxPrice !== null,
    search.trim() !== "",
  ].filter(Boolean).length;

  // Query Supabase for properties based on filter state
  const fetchSearchResults = async () => {
    if (activeFilterCount === 0) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      let query = supabase.from("properties").select("*");

      if (search.trim()) {
        query = query.or(`title.ilike.%${search}%,city.ilike.%${search}%,address.ilike.%${search}%,description.ilike.%${search}%`);
      }

      if (type) {
        query = query.eq("type", type);
      }

      if (bedrooms !== null) {
        if (bedrooms >= 4) {
          query = query.gte("bedrooms", 4);
        } else {
          query = query.eq("bedrooms", bedrooms);
        }
      }

      if (minPrice !== null) {
        query = query.gte("price", minPrice);
      }

      if (maxPrice !== null) {
        query = query.lte("price", maxPrice);
      }

      query = query.order("created_at", { ascending: false });

      const { data, error } = await query;
      console.log(data);
      if (error) {
        console.error("Search query error:", error);
      } else {
        setResults(data ?? []);
      }
    } catch (err) {
      console.error("Search fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch when store filter criteria changes
  useEffect(() => {
    fetchSearchResults();
  }, [search, type, bedrooms, minPrice, maxPrice]);

  return (
    <SafeAreaView className="flex-1 bg-[#fdf9f3]" edges={['top']}>
      {/* Sleek, Modern Header Section */}
      <View className="bg-[#fdf9f3] border-b border-[#00030c]/5 px-6 pb-4 pt-3">
        <View className="flex-row items-center gap-3">
          {/* Elegant Search Input Bar */}
          <View className="flex-1 bg-white border border-[#00030c]/10 flex-row items-center px-4 rounded-full h-[50px] shadow-sm">
            <MaterialCommunityIcons name="magnify" size={20} color="#75777e" className="mr-2" />
            <TextInput
              placeholder="Search sanctuaries..."
              placeholderTextColor="#a0a0a0"
              value={localSearch}
              onChangeText={setLocalSearch}
              className="flex-1 text-[#00030c] font-semibold text-[15px] p-0"
            />
            {localSearch.length > 0 && (
              <TouchableOpacity
                onPress={() => {
                  triggerHaptic();
                  setLocalSearch("");
                }}
                className="p-1"
              >
                <MaterialCommunityIcons name="close-circle" size={16} color="#75777e" />
              </TouchableOpacity>
            )}
          </View>

          {/* Sleek Filter Toggle Button */}
          <TouchableOpacity
            onPress={() => {
              triggerHaptic();
              setShowFilter(true);
            }}
            activeOpacity={0.8}
            className="bg-white w-[50px] h-[50px] rounded-full items-center justify-center border border-[#00030c]/10 shadow-sm relative"
          >
            <MaterialCommunityIcons name="tune-variant" size={20} color="#00030c" />
            {activeFilterCount > 0 && (
              <View className="absolute -top-1 -right-1 bg-[#76593b] w-5 h-5 rounded-full items-center justify-center shadow-sm">
                <Text className="text-white text-[9px] font-bold">
                  {activeFilterCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Selected Active Filter Chips */}
        <SelectedFilterChips />
      </View>

      {/* Main Content Area */}
      <View className="flex-1 bg-[#fdf9f3]">
        {activeFilterCount === 0 ? (
          /* Sleek Minimalist Initial State */
          <View className="flex-1 items-center justify-center px-8 pb-12">
            <Text style={{ fontSize: 36, letterSpacing: -1, color: '#00030c', fontWeight: '500', marginBottom: 8 }}>
              HAVN
            </Text>
            <Text className="text-[18px] font-medium text-[#76593b] tracking-wider uppercase mb-3">
              Find Your Sanctuary
            </Text>
            <Text className="text-[14px] text-[#75777e] text-center leading-5 max-w-[280px]">
              Apply a filter or type a keyword in the search bar above to explore properties.
            </Text>
          </View>
        ) : loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#00030c" />
          </View>
        ) : results.length === 0 ? (
          /* Empty Search Results */
          <View className="flex-1 items-center justify-center px-8 pb-12">
            <MaterialCommunityIcons name="home-search-outline" size={72} color="#75777e" />
            <Text className="text-[20px] font-semibold text-[#00030c] mt-4 mb-2">
              No Sanctuaries Found
            </Text>
            <Text className="text-[14px] text-[#45474d] text-center leading-5 max-w-[300px]">
              Try adjusting your search query or properties filters to discover available sanctuaries.
            </Text>
          </View>
        ) : (
          /* Search Results List */
          <FlatList
            data={results}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <PropertyCard property={item} />}
            contentContainerStyle={{
              paddingHorizontal: 24,
              paddingTop: 20,
              paddingBottom: 40,
              gap: 24,
            }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {/* Luxury Filter Modal */}
      <FilterModel
        visible={showFilter}
        onClose={() => setShowFilter(false)}
      />
    </SafeAreaView>
  );
}