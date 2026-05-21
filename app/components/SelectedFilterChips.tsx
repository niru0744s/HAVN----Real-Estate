import { useFilterStore } from '@/store/filterStrore';
import { formatPrice } from '@/lib/utils';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import * as Haptics from 'expo-haptics';

const triggerHaptic = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
};

export default function SelectedFilterChips() {
  const {
    type,
    bedrooms,
    minPrice,
    maxPrice,
    setType,
    setBedrooms,
    setMinPrice,
    setMaxPrice,
  } = useFilterStore();

  const chips: { id: string; label: string; onClear: () => void }[] = [];

  if (type !== null) {
    chips.push({
      id: 'type',
      label: `Type: ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      onClear: () => setType(null),
    });
  }

  if (bedrooms !== null) {
    chips.push({
      id: 'bedrooms',
      label: `${bedrooms === 4 ? '4+ Beds' : `${bedrooms} ${bedrooms === 1 ? 'Bed' : 'Beds'}`}`,
      onClear: () => setBedrooms(null),
    });
  }

  if (minPrice !== null || maxPrice !== null) {
    let label = '';
    if (minPrice !== null && maxPrice !== null) {
      label = `${formatPrice(minPrice)} – ${formatPrice(maxPrice)}`;
    } else if (minPrice !== null) {
      label = `Above ${formatPrice(minPrice)}`;
    } else if (maxPrice !== null) {
      label = `Under ${formatPrice(maxPrice)}`;
    }
    chips.push({
      id: 'price',
      label,
      onClear: () => {
        setMinPrice(null);
        setMaxPrice(null);
      },
    });
  }

  if (chips.length === 0) {
    return null;
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8, paddingVertical: 2 }}
      className="mt-2.5"
    >
      {chips.map((chip) => (
        <View
          key={chip.id}
          className="flex-row items-center bg-[#76593b]/10 border border-[#76593b]/20 px-3.5 py-1.5 rounded-full"
        >
          <Text className="text-[#76593b] text-[13px] font-bold mr-1.5">
            {chip.label}
          </Text>
          <TouchableOpacity
            onPress={() => {
              triggerHaptic();
              chip.onClear();
            }}
            activeOpacity={0.7}
            className="w-4 h-4 rounded-full bg-[#76593b]/20 items-center justify-center"
          >
            <MaterialCommunityIcons name="close" size={10} color="#76593b" />
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}
