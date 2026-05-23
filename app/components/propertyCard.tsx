import { useSavedProperty } from '@/hooks/useSavedProperty';
import { formatPrice } from '@/lib/utils';
import { Property } from '@/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

interface PropertyCardProps {
    property: Property;
    onUnsave?: () => void;
    showSave?: boolean;
}

export default function PropertyCard({ property, onUnsave, showSave }: PropertyCardProps) {
    const { isSaved, saveLoading, toggleSave } = useSavedProperty(property.id, onUnsave);

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            className="bg-[#fdf9f3] rounded-xl overflow-hidden border border-[#00030c]/10 shadow-sm"
            onPress={() => router.push({
                pathname: "/(root)/property/[id]",
                params: { id: property.id }
            })}
        >
            <View className="h-64 w-full relative">
                <Image
                    source={
                        property.images.length>0
                        ?{ uri: property.images?.[0] }
                        : require("@/assets/images/HAVNlogo.png")
                    }
                    className="w-full h-full absolute"
                    resizeMode="cover"
                />
                <TouchableOpacity 
                    className="absolute top-4 right-4 bg-white/70 p-2 rounded-full active:scale-95 duration-200"
                    onPress={async () => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                        await toggleSave();
                    }}
                    disabled={saveLoading}
                >
                    <MaterialCommunityIcons 
                        name={isSaved ? "bookmark" : "bookmark-outline"} 
                        size={24} 
                        color={isSaved ? "#76593b" : "#00030c"} 
                    />
                </TouchableOpacity>
            </View>
            <View className="p-6">
                <Text className="text-[20px] text-[#00030c] font-semibold mb-1">
                    {property.title}
                </Text>
                <Text className="text-[14px] text-[#45474d] mb-4">
                    {property.city}
                </Text>
                <View className="flex-row justify-between items-center border-t border-[#00030c]/5 pt-4">
                    <Text className="text-[14px] text-[#00030c] font-medium tracking-wide">
                        {formatPrice(property.price)}
                    </Text>
                    <View className="flex-row items-center">
                        <View className="flex-row items-center mr-4">
                            <MaterialCommunityIcons name="bed-outline" size={16} color="#45474d" />
                            <Text className="text-[14px] text-[#45474d] ml-1 font-medium">{property.bedrooms}</Text>
                        </View>
                        <View className="flex-row items-center">
                            <MaterialCommunityIcons name="shower" size={16} color="#45474d" />
                            <Text className="text-[14px] text-[#45474d] ml-1 font-medium">{property.bathrooms}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}