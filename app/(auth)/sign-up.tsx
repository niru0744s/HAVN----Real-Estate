import { useAuth, useSignUp } from '@clerk/expo';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Image, ImageBackground, Pressable, ScrollView, Text, TextInput, View } from 'react-native';

export default function SignUp() {

  const {signUp , errors , fetchStatus} = useSignUp();
  const {isSignedIn} = useAuth();

  const router = useRouter();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    code: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const isLoading = fetchStatus === "fetching";
  const backgroundImage = require('../../stitch_minimalist_branded_auth_portal/sign_up/stitch_minimalist_branded_auth_portal/high_end_modern_architectural_sanctuary._a_minimalist_luxury_home_interior_with/screen.png');

  return (
    <ImageBackground source={backgroundImage} resizeMode="cover" className="flex-1">
      <View
        pointerEvents="none"
        className="absolute inset-0"
        style={{ backgroundColor: 'rgba(21, 17, 12, 0.18)' }}
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, paddingVertical: 18 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="px-5" style={{ maxWidth: 430, width: '100%', alignSelf: 'center' }}>
          <View
            className="rounded-[10px] border border-[#ffffff66] px-6 pb-8 pt-9"
            style={{
              backgroundColor: 'rgba(242, 239, 232, 0.92)',
              shadowColor: '#111827',
              shadowOffset: { width: 0, height: 20 },
              shadowOpacity: 0.12,
              shadowRadius: 30,
              elevation: 6,
            }}
          >
            <View className="items-center">
              <View className="h-[126px] w-[126px] items-center justify-center bg-[#f8f7f4]">
                <Image
                  source={require('../../assets/images/HAVNicon.png')}
                  className="h-[72px] w-[72px]"
                  resizeMode="contain"
                />
              </View>
            </View>

            <View className="mt-9 items-center">
              <Text
                className="text-center text-[28px] text-[#0f1721]"
                style={{ fontFamily: 'serif', lineHeight: 38 }}
              >
                Create your sanctuary
              </Text>
              <Text className="mt-2 text-center text-[14px] uppercase tracking-[3px] text-[#677079]">
                Digital Architectural Entry
              </Text>
            </View>

            <View className="mt-8 gap-5">
              <View className="flex-row gap-4">
                <View className="flex-1">
                  <Text className="text-[12px] font-semibold uppercase tracking-[3px] text-[#5f666d]">
                    First Name
                  </Text>
                  <TextInput
                    placeholder="Julian"
                    placeholderTextColor="#b7bcc4"
                    value={form.firstName}
                    onChangeText={(firstName) => setForm((current) => ({ ...current, firstName }))}
                    className="mt-2 h-[56px] border-b border-[#697486] bg-[#fbfbfb] px-4 text-[16px] text-[#2a3138]"
                  />
                </View>

                <View className="flex-1">
                  <Text className="text-[12px] font-semibold uppercase tracking-[3px] text-[#5f666d]">
                    Last Name
                  </Text>
                  <TextInput
                    placeholder="Kemp"
                    placeholderTextColor="#b7bcc4"
                    value={form.lastName}
                    onChangeText={(lastName) => setForm((current) => ({ ...current, lastName }))}
                    className="mt-2 h-[56px] border-b border-[#697486] bg-[#fbfbfb] px-4 text-[16px] text-[#2a3138]"
                  />
                </View>
              </View>

              <View>
                <Text className="text-[12px] font-semibold uppercase tracking-[3px] text-[#5f666d]">
                  Email Address
                </Text>
                <TextInput
                  placeholder="julian.k@haven.com"
                  placeholderTextColor="#b7bcc4"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={form.email}
                  onChangeText={(email) => setForm((current) => ({ ...current, email }))}
                  className="mt-2 h-[56px] border-b border-[#697486] bg-[#fbfbfb] px-4 text-[16px] text-[#2a3138]"
                />
                {errors.fields.emailAddress && (
                  <Text className="mt-2 text-[12px] text-[#ba1a1a]">
                    {errors.fields.emailAddress.message}
                  </Text>
                )}
              </View>

              <View>
                <Text className="text-[12px] font-semibold uppercase tracking-[3px] text-[#5f666d]">
                  Password
                </Text>
                <View className="mt-2 h-[56px] flex-row items-center border-b border-[#697486] bg-[#fbfbfb] pr-3">
                  <TextInput
                    placeholder="••••••••"
                    placeholderTextColor="#b7bcc4"
                    secureTextEntry={!showPassword}
                    value={form.password}
                    onChangeText={(password) => setForm((current) => ({ ...current, password }))}
                    className="h-full flex-1 px-4 text-[16px] text-[#2a3138]"
                  />
                  <Pressable
                    onPress={() => setShowPassword((current) => !current)}
                    className="h-9 w-9 items-center justify-center"
                    hitSlop={8}
                  >
                    <Feather name={showPassword ? 'eye-off' : 'eye'} size={18} color="#5f666d" />
                  </Pressable>
                </View>
              </View>

              <View>
                <Text className="text-[12px] font-semibold uppercase tracking-[3px] text-[#5f666d]">
                  Verification Code
                </Text>
                <TextInput
                  placeholder="6-digit code"
                  placeholderTextColor="#b7bcc4"
                  value={form.code}
                  onChangeText={(code) => setForm((current) => ({ ...current, code }))}
                  className="mt-2 h-[56px] border-b border-[#697486] bg-[#fbfbfb] px-4 text-[16px] text-[#2a3138]"
                  style={{ letterSpacing: 2.4 }}
                />
              </View>
            </View>

            <Pressable
              className="mt-10 h-[62px] items-center justify-center rounded-[8px] bg-[#07121c]"
              style={{
                shadowColor: '#07121c',
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.22,
                shadowRadius: 18,
                elevation: 4,
              }}
              disabled = {isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white"/>
              ):
              <Text className="text-[14px] font-semibold uppercase tracking-[4px] text-[#f8fafc]">
                Join the Haven
              </Text>}
            </Pressable>

            <View className="mb-8 mt-9 flex-row items-center gap-4">
              <View className="h-[1px] flex-1 bg-[#c9c9c6]" />
              <Text className="text-[13px] uppercase tracking-[2px] text-[#7b8085]">OR</Text>
              <View className="h-[1px] flex-1 bg-[#c9c9c6]" />
            </View>

            <Pressable className="h-[62px] flex-row items-center justify-center rounded-[8px] border border-[#c5c8cc] bg-[#f8f8f7]">
              <AntDesign name="google" size={20} color="#4285F4" style={{ marginRight: 14 }} />
              <Text className="text-[15px] font-medium uppercase tracking-[1.4px] text-[#111620]">
                Continue with Google
              </Text>
            </Pressable>

            <View className="mt-8 items-center">
              <Text className="text-[16px] text-[#3f454c]">
                Already have an account?
                <Link href="/sign-in">
                <Text className="font-semibold text-[#0f1721]" style={{ textDecorationLine: 'underline' }}>
                  {' '}
                  Sign In
                </Text>
                </Link>
              </Text>
            </View>
            <View nativeID='clerk-captcha'/>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}
