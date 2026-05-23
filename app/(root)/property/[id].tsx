import { useSavedProperty } from '@/hooks/useSavedProperty';
import { useSupabase } from '@/hooks/useSupabase';
import { supabase } from '@/lib/supabase';
import { formatPrice } from '@/lib/utils';
import { useUserStore } from '@/store/userStore';
import { Property } from '@/types';
import { useAuth } from '@clerk/expo';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    FlatList,
    Image,
    Linking,
    Modal,
    SafeAreaView,
    ScrollView,
    Share,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { WebView } from 'react-native-webview';

const ADMIN_PHONE = "919999999999";
const { width, height } = Dimensions.get('window');

const triggerHaptic = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
};

export default function PropertyDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { userId } = useAuth();
  const router = useRouter();
  const isAdmin = useUserStore((state) => state.isAdmin);

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [viewerVisible, setViewerVisible] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const viewerRef = useRef<FlatList>(null);
  const authSupabase = useSupabase();

  const { isSaved, toggleSave, saveLoading } = useSavedProperty(id ?? "");

  const fetchProperty = async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from("properties")
        .select("*")
        .eq("id", id)
        .single();

      setProperty(data);
    } catch (err) {
      console.error("Error fetching property:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const handleShare = async () => {
    if (!property) return;
    triggerHaptic();
    try {
      await Share.share({
        message: `Explore this sanctuary on HAVN: ${property.title} in ${property.city}. Listing Price: ${formatPrice(property.price)}.`,
      });
    } catch (error) {
      console.error("Share error:", error);
    }
  };

   const handleDelete = () => {
    Alert.alert("Delete Property", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await authSupabase.from("properties").delete().eq("id", id);
          router.replace("/(root)/(tabs)");
        },
      },
    ]);
  };

  const handleMarkSold = () => {
    Alert.alert("Mark as Sold", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Mark Sold",
        onPress: async () => {
          await authSupabase
            .from("properties")
            .update({ is_sold: true })
            .eq("id", id);
          setProperty((prev) => (prev ? { ...prev, is_sold: true } : prev));
        },
      },
    ]);
  };

  const handleContact = () => {
    if (!property) return;
    triggerHaptic();
    const message = `Hi! I'm interested in the property: ${property.title} (${property.city})`;
    const url = `https://wa.me/${ADMIN_PHONE}?text=${encodeURIComponent(message)}`;
    Linking.openURL(url).catch((err) => console.error("Error opening WhatsApp:", err));
  };

  if (loading) {
    return (
      <View className="flex-1 bg-[#fdf9f3] justify-center items-center">
        <ActivityIndicator size="large" color="#00030c" />
      </View>
    );
  }

  if (!property) {
    return (
      <View className="flex-1 bg-[#fdf9f3] justify-center items-center px-6">
        <MaterialCommunityIcons name="home-alert-outline" size={64} color="#75777e" />
        <Text className="text-[20px] font-bold text-[#00030c] mt-4 mb-2">Sanctuary Not Found</Text>
        <Text className="text-[14px] text-[#45474d] text-center mb-6">
          The property details could not be loaded or the sanctuary may have been unlisted.
        </Text>
        <TouchableOpacity
          onPress={() => {
            triggerHaptic();
            router.back();
          }}
          className="bg-[#00030c] px-6 py-3 rounded-full"
        >
          <Text className="text-white font-bold text-[14px]">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isLongDesc = (property.description?.length ?? 0) > 150;
  const displayDesc = expanded || !isLongDesc
    ? property.description
    : property.description?.slice(0, 150) + "...";

  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${
    property.longitude - 0.003
  }%2C${property.latitude - 0.003}%2C${property.longitude + 0.003}%2C${
    property.latitude + 0.003
  }&layer=mapnik&marker=${property.latitude}%2C${property.longitude}`;

  const handleScroll = (event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = Math.round(event.nativeEvent.contentOffset.x / slideSize);
    setActiveIndex(index);
  };

  return (
    <View className="flex-1 bg-[#fdf9f3]">
      {/* Absolute Pinned Header Bar */}
      <View className="absolute top-0 left-0 right-0 z-50 flex-row justify-between items-center px-6 mt-14">
        <TouchableOpacity
          onPress={() => {
            triggerHaptic();
            router.back();
          }}
          activeOpacity={0.8}
          className="w-12 h-12 rounded-full bg-[#fdf9f3]/85 border border-[#00030c]/10 items-center justify-center shadow-md"
        >
          <MaterialCommunityIcons name="arrow-left" size={22} color="#00030c" />
        </TouchableOpacity>
        
        <View className="flex-row gap-3">
          <TouchableOpacity
            onPress={handleShare}
            activeOpacity={0.8}
            className="w-12 h-12 rounded-full bg-[#fdf9f3]/85 border border-[#00030c]/10 items-center justify-center shadow-md"
          >
            <MaterialCommunityIcons name="share-variant-outline" size={20} color="#00030c" />
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => {
              triggerHaptic();
              toggleSave();
            }}
            disabled={saveLoading}
            activeOpacity={0.8}
            className="w-12 h-12 rounded-full bg-[#fdf9f3]/85 border border-[#00030c]/10 items-center justify-center shadow-md"
          >
            {saveLoading ? (
              <ActivityIndicator size="small" color="#76593b" />
            ) : (
              <MaterialCommunityIcons
                name={isSaved ? "bookmark" : "bookmark-outline"}
                size={20}
                color={isSaved ? "#76593b" : "#00030c"}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 130 }}
      >
        {/* Hero Gallery Section */}
        <View className="relative w-full h-[400px]">
          <FlatList
            data={property.images && property.images.length > 0 ? property.images : [null]}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            renderItem={({ item }) => (
              <View style={{ width, height: 400 }}>
                {item ? (
                  <TouchableOpacity
                    activeOpacity={0.95}
                    onPress={() => {
                      triggerHaptic();
                      setViewerIndex(activeIndex);
                      setViewerVisible(true);
                    }}
                    className="w-full h-full"
                  >
                    <Image
                      source={{ uri: item }}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                ) : (
                  <View className="w-full h-full bg-[#f1ede8] items-center justify-center">
                    <Image
                      source={require("@/assets/images/HAVNlogo.png")}
                      className="w-40 h-40 object-contain"
                      resizeMode="contain"
                    />
                  </View>
                )}
                <View className="absolute inset-0 bg-[#00030c]/15" />
              </View>
            )}
          />

          {/* Slide Counter Overlay */}
          <View className="absolute bottom-18 right-6 bg-[#fdf9f3]/85 border border-[#00030c]/10 px-4 mt-3 py-2 rounded-full shadow-sm">
            <Text className="text-[11px] font-bold text-[#00030c] tracking-widest uppercase">
              {String(activeIndex + 1).padStart(2, '0')} / {String(Math.max(1, property.images?.length || 1)).padStart(2, '0')}
            </Text>
          </View>
        </View>

        {/* Content Section overlapping slightly */}
        <View className="px-6 -mt-12 relative z-10">
          
          {/* Main Info Card (Glassmorphic Pane) */}
          <View className="bg-[#fdf9f3]/95 border border-[#00030c]/10 p-6 md:p-8 rounded-3xl shadow-xl mb-6">
            <View className="border-b border-[#00030c]/5 pb-6 mb-6">
              <Text className="text-[26px] font-bold text-[#00030c] leading-9 mb-2">
                {property.title}
              </Text>
              
              <View className="flex-row items-center gap-1">
                <MaterialCommunityIcons name="map-marker-outline" size={16} color="#76593b" />
                <Text className="text-[14px] text-[#45474d] font-medium">
                  {property.address}, {property.city}
                </Text>
              </View>

              <View className="mt-5 flex-row justify-between items-end">
                <View>
                  <Text className="text-[9px] font-bold text-[#76593b] tracking-widest uppercase mb-0.5">
                    LISTING PRICE
                  </Text>
                  <Text className="text-[24px] font-bold text-[#00030c]">
                    {formatPrice(property.price)}
                  </Text>
                </View>
                {property.is_sold && (
                  <View className="bg-[#ba1a1a]/10 border border-[#ba1a1a]/20 px-3 py-1 rounded-full">
                    <Text className="text-[#ba1a1a] text-[11px] font-bold tracking-widest uppercase">
                      SOLD
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* Bento Grid Specs */}
            <View className="flex-row flex-wrap gap-3">
              <View className="flex-1 min-w-[45%] bg-[#f1ede8]/50 border border-[#00030c]/5 p-4 rounded-2xl items-center">
                <MaterialCommunityIcons name="bed-outline" size={20} color="#76593b" className="mb-1" />
                <Text className="text-[16px] font-bold text-[#00030c]">{property.bedrooms}</Text>
                <Text className="text-[10px] font-semibold text-[#45474d] uppercase tracking-widest">Bedrooms</Text>
              </View>
              
              <View className="flex-1 min-w-[45%] bg-[#f1ede8]/50 border border-[#00030c]/5 p-4 rounded-2xl items-center">
                <MaterialCommunityIcons name="shower" size={20} color="#76593b" className="mb-1" />
                <Text className="text-[16px] font-bold text-[#00030c]">{property.bathrooms}</Text>
                <Text className="text-[10px] font-semibold text-[#45474d] uppercase tracking-widest">Bathrooms</Text>
              </View>
              
              <View className="flex-1 min-w-[45%] bg-[#f1ede8]/50 border border-[#00030c]/5 p-4 rounded-2xl items-center">
                <MaterialCommunityIcons name="ruler-square" size={20} color="#76593b" className="mb-1" />
                <Text className="text-[16px] font-bold text-[#00030c]">{property.area_sqft.toLocaleString()}</Text>
                <Text className="text-[10px] font-semibold text-[#45474d] uppercase tracking-widest">Sq Ft</Text>
              </View>
              
              <View className="flex-1 min-w-[45%] bg-[#f1ede8]/50 border border-[#00030c]/5 p-4 rounded-2xl items-center">
                <MaterialCommunityIcons name="home-outline" size={20} color="#76593b" className="mb-1" />
                <Text className="text-[16px] font-bold text-[#00030c] capitalize">{property.type}</Text>
                <Text className="text-[10px] font-semibold text-[#45474d] uppercase tracking-widest">Sanctuary Type</Text>
              </View>
            </View>
          </View>

          {/* About this residence (Description) */}
          <View className="mb-8 px-2">
            <Text className="text-[12px] font-bold text-[#76593b] tracking-[0.08em] uppercase mb-3">
              About this residence
            </Text>
            <Text className="text-[15px] text-[#45474d] leading-6 font-medium mb-3">
              {displayDesc}
            </Text>
            {isLongDesc && (
              <TouchableOpacity 
                onPress={() => {
                  triggerHaptic();
                  setExpanded(!expanded);
                }}
                activeOpacity={0.7}
              >
                <Text className="text-[13px] font-bold text-[#76593b] uppercase tracking-wider">
                  {expanded ? "Read Less" : "Read More"}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Premium Features List */}
          <View className="mb-8 px-2">
            <Text className="text-[12px] font-bold text-[#76593b] tracking-[0.08em] uppercase mb-4">
              Premium Amenities
            </Text>
            
            <View className="flex-row flex-wrap gap-y-3">
              {[
                "Chef's Kitchen with Premium Appliances",
                "Home Cinema & High-Fidelity Audio System",
                "Advanced Integrated Smart-Home Automation",
                "Rooftop Zen Garden & Sun Deck",
                "24/7 Gated Security & Personal Concierge Service",
                "Eco-Friendly Solar Integration & Thermal Insulated Glazing"
              ].map((feature, i) => (
                <View key={i} className="flex-row items-center gap-3 w-full">
                  <MaterialCommunityIcons name="check-decagram" size={16} color="#76593b" />
                  <Text className="text-[14px] text-[#45474d] font-medium flex-1">
                    {feature}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* OpenStreetMap WebView Map Section */}
          <View className="mb-8 px-2">
            <Text className="text-[12px] font-bold text-[#76593b] tracking-[0.08em] uppercase mb-3">
              Location Map
            </Text>
            <TouchableOpacity 
              onPress={() => {
                triggerHaptic();
                router.push({
                  pathname: "/(root)/property/map",
                  params: {
                    latitude: property.latitude.toString(),
                    longitude: property.longitude.toString(),
                    title: property.title,
                    address: `${property.address}, ${property.city}`,
                  },
                });
              }}
              activeOpacity={0.9}
              className="rounded-3xl overflow-hidden border border-[#00030c]/10 h-[240px] shadow-sm bg-[#f1ede8] relative"
            >
              <View className="flex-1 pointer-events-none">
                <WebView
                  source={{ uri: mapUrl }}
                  style={{ flex: 1 }}
                  scrollEnabled={false}
                  domStorageEnabled={true}
                  javaScriptEnabled={true}
                />
              </View>
              <View className="absolute bottom-3 left-3 bg-[#fdf9f3]/90 border border-[#00030c]/10 px-3.5 py-1.5 rounded-full shadow-sm">
                <Text className="text-[10px] font-bold text-[#00030c] uppercase tracking-widest">
                  {property.city}
                </Text>
              </View>
              <View className="absolute top-3 right-3 bg-[#00030c]/85 px-3.5 py-1.5 rounded-full shadow-sm flex-row items-center gap-1.5">
                <MaterialCommunityIcons name="fullscreen" size={13} color="#ffffff" />
                <Text className="text-white text-[9px] font-bold uppercase tracking-widest">
                  Maximize
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Listing Agent Box */}
          <View className="bg-[#f1ede8]/50 border border-[#00030c]/5 p-6 rounded-3xl mb-4">
            <Text className="text-[12px] font-bold text-[#76593b] tracking-[0.08em] uppercase mb-4">
              Listing Agent
            </Text>
            <View className="flex-row items-center gap-4 mb-5">
              <View className="w-14 h-14 rounded-full overflow-hidden bg-[#e6e2dd] border border-[#00030c]/5">
                <Image
                  source={{ uri: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400" }}
                  className="w-full h-full object-cover"
                />
              </View>
              <View>
                <Text className="text-[17px] font-bold text-[#00030c]">Vikram Singhania</Text>
                <Text className="text-[11px] font-bold text-[#76593b] uppercase tracking-widest">Senior Partner</Text>
              </View>
            </View>
            
            <TouchableOpacity
              onPress={handleContact}
              activeOpacity={0.8}
              className="w-full py-4 border border-[#00030c] rounded-full items-center justify-center"
            >
              <Text className="text-[#00030c] text-[11px] font-bold tracking-widest uppercase">
                CONTACT AGENT
              </Text>
            </TouchableOpacity>
          </View>

          {/* Administrative Control Panel */}
          {isAdmin && (
            <View className="bg-[#ba1a1a]/5 border border-[#ba1a1a]/15 p-6 rounded-3xl mb-4">
              <Text className="text-[12px] font-bold text-[#ba1a1a] tracking-[0.08em] uppercase mb-4">
                Administrative Control Panel
              </Text>
              
              <View className="flex-row gap-3">
                <TouchableOpacity
                  onPress={() => {
                    triggerHaptic();
                    handleMarkSold();
                  }}
                  disabled={property.is_sold}
                  activeOpacity={0.8}
                  className={`flex-1 py-4 rounded-full items-center justify-center flex-row gap-2 border transition-all ${
                    property.is_sold
                      ? 'bg-transparent border-[#00030c]/10 opacity-50'
                      : 'bg-[#00030c] border-[#00030c] active:scale-95'
                  }`}
                >
                  <MaterialCommunityIcons 
                    name="checkbox-marked-circle-outline" 
                    size={16} 
                    color={property.is_sold ? "#00030c" : "#ffffff"} 
                  />
                  <Text className={`text-[11px] font-bold tracking-widest uppercase ${
                    property.is_sold ? 'text-[#00030c]' : 'text-white'
                  }`}>
                    {property.is_sold ? "Sold" : "Mark Sold"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    triggerHaptic();
                    handleDelete();
                  }}
                  activeOpacity={0.8}
                  className="flex-1 py-4 bg-transparent border border-[#ba1a1a] rounded-full items-center justify-center flex-row gap-2 active:scale-95"
                >
                  <MaterialCommunityIcons name="trash-can-outline" size={16} color="#ba1a1a" />
                  <Text className="text-[#ba1a1a] text-[11px] font-bold tracking-widest uppercase">
                    Delete
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

        </View>
      </ScrollView>

      {/* Floating Action Consultation Footer */}
      <View className="absolute bottom-8 left-6 right-6 bg-[#fdf9f3]/95 border border-[#00030c]/10 p-3 rounded-full flex-row items-center justify-between shadow-2xl z-50">
        <View className="pl-5">
          <Text className="text-[9px] font-bold text-[#76593b] tracking-widest uppercase mb-0.5">
            EST. MORTGAGE
          </Text>
          <Text className="text-[17px] font-bold text-[#00030c]">
            {formatPrice(Math.round(property.price / 240))}/mo
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleContact}
          activeOpacity={0.95}
          className="bg-[#00030c] h-14 px-8 rounded-full items-center justify-center shadow-lg"
        >
          <Text className="text-white text-[11px] font-bold tracking-widest uppercase">
            BOOK CONSULTATION
          </Text>
        </TouchableOpacity>
      </View>

      {/* Fullscreen Image Viewer Modal */}
      <Modal
        visible={viewerVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setViewerVisible(false)}
        onShow={() => {
          if (property?.images && property.images.length > viewerIndex) {
            setTimeout(() => {
              try {
                viewerRef.current?.scrollToIndex({ index: viewerIndex, animated: false });
              } catch (err) {
                console.warn("FlatList scrollToIndex failed:", err);
              }
            }, 100);
          }
        }}
      >
        <SafeAreaView className="flex-1 bg-black/95 justify-between">
          {/* Header */}
          <View className="flex-row justify-between items-center px-6 py-4">
            <TouchableOpacity
              onPress={() => {
                triggerHaptic();
                setViewerVisible(false);
              }}
              activeOpacity={0.8}
              className="w-10 h-10 rounded-full bg-white/10 items-center justify-center"
            >
              <MaterialCommunityIcons name="close" size={24} color="#ffffff" />
            </TouchableOpacity>

            <Text className="text-white font-bold text-[14px] tracking-widest uppercase">
              {String(viewerIndex + 1).padStart(2, '0')} / {String(Math.max(1, property.images?.length || 1)).padStart(2, '0')}
            </Text>

            <TouchableOpacity
              onPress={handleShare}
              activeOpacity={0.8}
              className="w-10 h-10 rounded-full bg-white/10 items-center justify-center"
            >
              <MaterialCommunityIcons name="share-variant" size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>

          {/* Main Fullscreen Swipeable Gallery */}
          <View className="flex-1 justify-center items-center">
            <FlatList
              ref={viewerRef}
              data={property.images && property.images.length > 0 ? property.images : []}
              keyExtractor={(item, index) => index.toString()}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              getItemLayout={(data, index) => ({
                length: width,
                offset: width * index,
                index,
              })}
              onMomentumScrollEnd={(event) => {
                const index = Math.round(event.nativeEvent.contentOffset.x / width);
                setViewerIndex(index);
              }}
              renderItem={({ item }) => (
                <View style={{ width, height: height * 0.7, justifyContent: 'center', alignItems: 'center' }}>
                  <ScrollView
                    maximumZoomScale={4}
                    minimumZoomScale={1}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ width, height: height * 0.7, justifyContent: 'center', alignItems: 'center' }}
                  >
                    {item ? (
                      <Image
                        source={{ uri: item }}
                        style={{ width: width, height: height * 0.65 }}
                        resizeMode="contain"
                      />
                    ) : null}
                  </ScrollView>
                </View>
              )}
            />
          </View>

          {/* Bottom Thumbnail Strip */}
          {property.images && property.images.length > 1 && (
            <View className="py-6 bg-black/40 border-t border-white/5">
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 24, gap: 10 }}
              >
                {property.images.map((img, idx) => (
                  <TouchableOpacity
                    key={idx}
                    activeOpacity={0.8}
                    onPress={() => {
                      triggerHaptic();
                      setViewerIndex(idx);
                      try {
                        viewerRef.current?.scrollToIndex({ index: idx, animated: true });
                      } catch (err) {
                        console.warn("Thumbnail scrollToIndex failed:", err);
                      }
                    }}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 ${
                      viewerIndex === idx ? 'border-[#76593b]' : 'border-transparent opacity-50'
                    }`}
                  >
                    <Image
                      source={{ uri: img }}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </SafeAreaView>
      </Modal>
    </View>
  );
}