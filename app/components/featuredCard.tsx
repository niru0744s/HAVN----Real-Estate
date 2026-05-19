import { formatPrice } from '@/lib/utils';
import { Property } from '@/types';
import React, { useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

interface FeaturedCardProps {
  property: Property;
}

export default function FeaturedCard({ property }: FeaturedCardProps) {
  const [isSaved, setIsSaved] = useState(false);

  return (
    <TouchableOpacity activeOpacity={0.9} className="snap-center shrink-0 w-[85vw] relative aspect-[4/5] rounded-xl overflow-hidden shadow-2xl mr-4">
      <Image
        source={{ uri: property.images?.[0] }}
        className="w-full h-full absolute"
        resizeMode="cover"
      />
      {/* <TouchableOpacity 
        className="absolute top-4 right-4 bg-white/70 p-2 rounded-full z-10"
        onPress={() => setIsSaved(!isSaved)}
      >
        <MaterialCommunityIcons 
          name={isSaved ? "bookmark" : "bookmark-outline"} 
          size={24} 
          color={isSaved ? "#76593b" : "#00030c"} 
        />
      </TouchableOpacity> */}
      {/* Fallback to semi-transparent black for gradient effect */}
      <View className="absolute inset-0 flex-col justify-end p-6 bg-black/40 pointer-events-none">
        <Text className="font-semibold text-[10px] text-white/70 uppercase tracking-widest mb-1">
          {property.city}
        </Text>
        <Text className="font-bold text-[24px] text-white mb-4">
          {property.title}
        </Text>
        <View className="flex-row justify-between items-center">
          <Text className="text-[18px] text-white/90 font-medium">
            {formatPrice(property.price)}
          </Text>
          <View className="bg-white px-6 py-2.5 rounded-full">
            <Text className="text-black font-semibold text-[10px] uppercase tracking-widest">
              Explore
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
