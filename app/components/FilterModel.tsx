import { PropertyType, useFilterStore } from '@/store/filterStrore';
import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  PanResponder,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

const TYPES: { label: string; value: PropertyType }[] = [
  { label: "All", value: null },
  { label: "Apartment", value: "apartment" },
  { label: "House", value: "house" },
  { label: "Villa", value: "villa" },
  { label: "Studio", value: "studio" },
];

const BEDS = [
  { label: "Any", value: null },
  { label: "1", value: 1 },
  { label: "2", value: 2 },
  { label: "3", value: 3 },
  { label: "4+", value: 4 },
];

const PRICE_PRESETS = [
  { label: "Under ₹50L", min: null, max: 5000000 },
  { label: "₹50L – ₹1Cr", min: 5000000, max: 10000000 },
  { label: "₹1Cr – ₹2Cr", min: 10000000, max: 20000000 },
  { label: "Above ₹2Cr", min: 20000000, max: null },
];

const triggerHaptic = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
};

export default function FilterModel({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const {
    type,
    bedrooms,
    minPrice,
    maxPrice,
    setType,
    setBedrooms,
    setMinPrice,
    setMaxPrice,
    resetFilters,
  } = useFilterStore();

  const [localMin, setLocalMin] = useState(minPrice ? String(minPrice) : "");
  const [localMax, setLocalMax] = useState(maxPrice ? String(maxPrice) : "");
  const [focusedInput, setFocusedInput] = useState<'min' | 'max' | null>(null);

  // Custom PanResponder to close bottom sheet on downward header swipe
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false, // Maintain taps on inner header buttons
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Intercept downward drag vertically by more than 10 pixels
        return gestureState.dy > 10 && Math.abs(gestureState.dx) < gestureState.dy;
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 50) {
          triggerHaptic();
          onClose();
        }
      },
    })
  ).current;

  // Sync states on visibility changes
  useEffect(() => {
    if (visible) {
      setLocalMin(minPrice ? String(minPrice) : "");
      setLocalMax(maxPrice ? String(maxPrice) : "");
    }
  }, [visible, minPrice, maxPrice]);

  const liveActiveCount = [
    type !== null,
    bedrooms !== null,
    localMin !== "",
    localMax !== "",
  ].filter(Boolean).length;

  const handleApply = () => {
    setMinPrice(localMin ? Number(localMin) : null);
    setMaxPrice(localMax ? Number(localMax) : null);
    onClose();
  };

  const handleReset = () => {
    setLocalMax("");
    setLocalMin("");
    resetFilters();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      {/* Backdrop area - Tapping the 18% upper translucent region closes the sheet */}
      <Pressable
        onPress={() => {
          triggerHaptic();
          onClose();
        }}
        className="flex-1 bg-black/40 justify-end"
      >
        {/* Bottom Sheet Window (occupies 82% of screen height) */}
        <Pressable
          onPress={(e) => e.stopPropagation()} // Stop event bubbling to backdrop
          className="bg-white rounded-t-[32px] overflow-hidden shadow-2xl"
          style={{ height: '82%', width: '100%' }}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 bg-white"
          >
            <SafeAreaView className="flex-1 bg-white" edges={['bottom']}>
              
              {/* Swipe-down drag header wrapper */}
              <View {...panResponder.panHandlers} className="bg-white pb-4 border-b border-[#00030c]/5">
                {/* Drag handle */}
                <View className="items-center py-3.5">
                  <View className="w-12 h-1.5 bg-[#00030c]/15 rounded-full" />
                </View>

                {/* Header title & reset */}
                <View className="flex-row items-center justify-between px-6">
                  <Text className="text-[26px] font-bold text-[#00030c] tracking-tight">
                    Filters
                  </Text>
                  {liveActiveCount > 0 && (
                    <TouchableOpacity
                      onPress={() => {
                        triggerHaptic();
                        handleReset();
                      }}
                      activeOpacity={0.7}
                    >
                      <Text className="text-[14px] font-semibold text-[#76593b] tracking-wider uppercase">
                        Clear All ({liveActiveCount})
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {/* Main Scrollable Content */}
              <ScrollView
                className="flex-1 px-6 bg-white"
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                {/* Section 1: Property Type */}
                <View className="py-6 border-b border-[#00030c]/5">
                  <Text className="text-[15px] font-bold text-[#00030c] uppercase tracking-wider mb-4">
                    Property Type
                  </Text>
                  <View className="flex-row flex-wrap gap-2.5">
                    {TYPES.map((t) => {
                      const active = type === t.value;
                      return (
                        <TouchableOpacity
                          key={t.label}
                          onPress={() => {
                            triggerHaptic();
                            setType(t.value);
                          }}
                          activeOpacity={0.8}
                          className={`px-5 py-3 rounded-2xl border transition-all duration-200 ${
                            active
                              ? 'bg-[#00030c] border-[#00030c]'
                              : 'bg-[#fcfbf9] border-[#00030c]/10'
                          }`}
                        >
                          <Text
                            className={`text-[14px] font-semibold ${
                              active ? 'text-white' : 'text-[#45474d]'
                            }`}
                          >
                            {t.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* Section 2: Bedrooms */}
                <View className="py-6 border-b border-[#00030c]/5">
                  <Text className="text-[15px] font-bold text-[#00030c] uppercase tracking-wider mb-4">
                    Bedrooms
                  </Text>
                  <View className="flex-row gap-2.5">
                    {BEDS.map((b) => {
                      const active = bedrooms === b.value;
                      return (
                        <TouchableOpacity
                          key={b.label}
                          onPress={() => {
                            triggerHaptic();
                            setBedrooms(b.value);
                          }}
                          activeOpacity={0.8}
                          className={`flex-1 items-center justify-center py-3.5 rounded-2xl border transition-all duration-200 ${
                            active
                              ? 'bg-[#76593b] border-[#76593b]'
                              : 'bg-[#fcfbf9] border-[#00030c]/10'
                          }`}
                        >
                          <Text
                            className={`text-[15px] font-bold ${
                              active ? 'text-white' : 'text-[#45474d]'
                            }`}
                          >
                            {b.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* Section 3: Price Range */}
                <View className="py-6 pb-12">
                  <Text className="text-[15px] font-bold text-[#00030c] uppercase tracking-wider mb-4">
                    Price Range (₹)
                  </Text>

                  <View className="flex-row gap-4 mb-6">
                    {/* Min Price Input */}
                    <View className="flex-1">
                      <Text className="text-[11px] font-bold text-[#677079] uppercase tracking-widest mb-2">
                        Min Price
                      </Text>
                      <View
                        className={`flex-row items-center bg-[#fcfbf9] border rounded-2xl px-4 py-3 h-[56px] transition-all duration-200 ${
                          focusedInput === 'min'
                            ? 'border-[#76593b] bg-white'
                            : 'border-[#00030c]/10'
                        }`}
                      >
                        <Text className="text-[#45474d] font-semibold text-[16px] mr-1.5">
                          ₹
                        </Text>
                        <TextInput
                          placeholder="Any"
                          placeholderTextColor="#a0a0a0"
                          value={localMin}
                          onChangeText={(val) => {
                            const cleaned = val.replace(/[^0-9]/g, '');
                            setLocalMin(cleaned);
                          }}
                          keyboardType="numeric"
                          onFocus={() => setFocusedInput('min')}
                          onBlur={() => setFocusedInput(null)}
                          className="flex-1 text-[#00030c] font-bold text-[16px] p-0"
                        />
                      </View>
                    </View>

                    {/* Max Price Input */}
                    <View className="flex-1">
                      <Text className="text-[11px] font-bold text-[#677079] uppercase tracking-widest mb-2">
                        Max Price
                      </Text>
                      <View
                        className={`flex-row items-center bg-[#fcfbf9] border rounded-2xl px-4 py-3 h-[56px] transition-all duration-200 ${
                          focusedInput === 'max'
                            ? 'border-[#76593b] bg-white'
                            : 'border-[#00030c]/10'
                        }`}
                      >
                        <Text className="text-[#45474d] font-semibold text-[16px] mr-1.5">
                          ₹
                        </Text>
                        <TextInput
                          placeholder="Any"
                          placeholderTextColor="#a0a0a0"
                          value={localMax}
                          onChangeText={(val) => {
                            const cleaned = val.replace(/[^0-9]/g, '');
                            setLocalMax(cleaned);
                          }}
                          keyboardType="numeric"
                          onFocus={() => setFocusedInput('max')}
                          onBlur={() => setFocusedInput(null)}
                          className="flex-1 text-[#00030c] font-bold text-[16px] p-0"
                        />
                      </View>
                    </View>
                  </View>

                  {/* Price Presets */}
                  <Text className="text-[11px] font-bold text-[#677079] uppercase tracking-widest mb-3">
                    Popular Presets
                  </Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ gap: 8, paddingBottom: 4 }}
                  >
                    {PRICE_PRESETS.map((preset) => {
                      const isMatch =
                        (preset.min === null
                          ? localMin === ''
                          : String(preset.min) === localMin) &&
                        (preset.max === null
                          ? localMax === ''
                          : String(preset.max) === localMax);

                      return (
                        <TouchableOpacity
                          key={preset.label}
                          onPress={() => {
                            triggerHaptic();
                            setLocalMin(
                              preset.min !== null ? String(preset.min) : ''
                            );
                            setLocalMax(
                              preset.max !== null ? String(preset.max) : ''
                            );
                          }}
                          activeOpacity={0.8}
                          className={`px-4.5 py-3 rounded-2xl border transition-all duration-200 ${
                            isMatch
                              ? 'bg-[#76593b]/10 border-[#76593b]'
                              : 'bg-white border-[#00030c]/10'
                          }`}
                        >
                          <Text
                            className={`text-[13px] font-bold ${
                              isMatch ? 'text-[#76593b]' : 'text-[#45474d]'
                            }`}
                          >
                            {preset.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>
              </ScrollView>

              {/* Sticky Bottom Apply Button */}
              <View className="px-6 py-4 border-t border-[#00030c]/5 bg-white">
                <TouchableOpacity
                  onPress={() => {
                    triggerHaptic();
                    handleApply();
                  }}
                  activeOpacity={0.9}
                  className="bg-[#00030c] h-[58px] rounded-2xl items-center justify-center shadow-lg shadow-black/10 flex-row gap-2"
                >
                  <Text className="text-white text-[16px] font-bold tracking-wider uppercase">
                    Apply Filters
                  </Text>
                  {liveActiveCount > 0 && (
                    <View className="bg-[#76593b] rounded-full px-2 py-0.5 min-w-[20px] items-center justify-center">
                      <Text className="text-white text-[11px] font-bold">
                        {liveActiveCount}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </KeyboardAvoidingView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}