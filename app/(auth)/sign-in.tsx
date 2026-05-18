import { useSignIn } from '@clerk/expo';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import { Link, router } from 'expo-router';
import React, { useRef, useState } from 'react';
import { ActivityIndicator, Image, ImageBackground, Pressable, ScrollView, Text, TextInput, View } from 'react-native';

export default function SignIn() {
  const { signIn,errors, fetchStatus } = useSignIn();
  const [form, setForm] = useState({
    email: '',
    password: '',
    code: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const isLoading = fetchStatus === "fetching";

  const backgroundImage = require('../../stitch_minimalist_branded_auth_portal/sign_up/stitch_minimalist_branded_auth_portal/high_end_modern_architectural_sanctuary._a_minimalist_luxury_home_interior_with/screen.png');

  const onSignInPress = async () => {
    try {
      await signIn.create({
        identifier: form.email,
        password: form.password,
      });

      if(signIn.status === "complete"){
        await signIn.finalize({
          navigate: ({session , decorateUrl}) =>{
            if(session?.currentTask){
              console.log(session?.currentTask);
              return;
            }
            const url = decorateUrl("/");
            router.replace(url as any);
          },
        })
      }else if(signIn.status === "needs_second_factor" ){
        await signIn.mfa.sendPhoneCode;
      }else if(signIn.status === "needs_client_trust"){
        const emailCodeFactor = signIn.supportedSecondFactors.find(factor=>factor.strategy === 'email_code');

        if(emailCodeFactor){
          await signIn.mfa.sendEmailCode();
        };
      }else{
        console.error("Sign-in attenpt not complete:",signIn);
      }

    } catch (err: any) {
      alert(err.errors?.[0]?.message || 'Sign in failed');
    }
  };

  // 2fa verification 

  const otpInputs = useRef<TextInput[]>([]);

  // handle otp change 

  const handleOtpChange = (index: number, value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    if (numericValue.length > 1) return;

    const codes = form.code.split('');
    codes[index] = numericValue;
    const newCode = codes.join('');

    setForm((current) => ({ ...current, code: newCode }));

    if (numericValue && index < 5) {
      otpInputs.current[index + 1]?.focus();
    }
  };

  // on verify press 

  const onVerifyPress = async () => {
    const { error } = await signIn.mfa.verifyEmailCode({
      code: form.code,
    });

    if(signIn.status === "complete"){
      await signIn.finalize({
        navigate: ({session , decorateUrl}) =>{
            if(session?.currentTask){
              console.log(session?.currentTask);
              return;
            }
            const url = decorateUrl("/");
            router.replace(url as any);
          },
      });
    };

    if (error) {
      alert(error.message);
      return;
    }
  };

  const handleOtpKeyPress = (index: number, key: string) => {
    if (key === 'Backspace' && !form.code[index] && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
  };

  if (signIn.status === "needs_client_trust") {
      return (
      <>
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
              <View className="flex-1 items-center justify-center px-6 py-12" style={{ maxWidth: 430, width: '100%', alignSelf: 'center' }}>
                <View className="w-full" style={{ maxWidth: 320 }}>
                  <Text className="text-center text-[12px] font-semibold uppercase tracking-[3px] text-[#5f666d]">
                    Verification Code
                  </Text>
                  <View className="mt-6 flex-row justify-center gap-3">
                    {[0, 1, 2, 3, 4, 5].map((index) => (
                      <TextInput
                        key={index}
                        ref={(el) => {
                          if (el) otpInputs.current[index] = el;
                        }}
                        keyboardType="numeric"
                        maxLength={1}
                        value={form.code[index] || ''}
                        onChangeText={(value) => handleOtpChange(index, value)}
                        onKeyPress={({ nativeEvent }) => handleOtpKeyPress(index, nativeEvent.key)}
                        className="h-[56px] w-[48px] border-b-2 border-[#697486] bg-[#fbfbfb] text-center text-[20px] font-semibold text-[#2a3138]"
                      />
                    ))}
  
                    {errors.fields.code && (
                        <Text className="mt-2 text-[12px] text-[#ba1a1a]">
                          {errors.fields.code.message}
                        </Text>
                      )}
  
                      
                  </View>
                  <Pressable
                    className="mt-8 h-[56px] items-center justify-center rounded-[8px] bg-[#07121c]"
                    disabled={isLoading || form.code.length !== 6}
                    onPress={onVerifyPress}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="white" />
                    ) :
                      <Text className="text-[14px] font-semibold uppercase tracking-[4px] text-[#f8fafc]">
                      verify
                    </Text>}
                  </Pressable>
                    <Pressable
                    className='py-2'
                    onPress={()=> signIn.mfa.sendEmailCode()}
                  >  
                      <Text className="text-[14px] font-semibold uppercase tracking-[4px] text-[#f8fafc]">
                      I need a new code
                    </Text>
                  </Pressable>
  
  
                </View>
              </View>
            </ScrollView>
            </ImageBackground>
          </>
          );
    }

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
            {/* Header with Logo */}
            <View className="items-center">
              <View className="h-[126px] w-[126px] items-center justify-center bg-[#f8f7f4]">
                <Image
                  source={require('../../assets/images/HAVNicon.png')}
                  className="h-[72px] w-[72px]"
                  resizeMode="contain"
                />
              </View>
            </View>

            {/* Welcome Section */}
            <View className="mt-9 items-center">
              <Text
                className="text-center text-[28px] text-[#0f1721]"
                style={{ fontFamily: 'serif', lineHeight: 38 }}
              >
                Welcome Back
              </Text>
              <Text className="mt-2 text-center text-[14px] text-[#677079]">
                Sign in to your sanctuary
              </Text>
            </View>

            {/* Form */}
            <View className="mt-8 gap-5">
              {/* Email Field */}
              <View>
                <Text className="text-[12px] font-semibold uppercase tracking-[3px] text-[#5f666d]">
                  Email
                </Text>
                <TextInput
                  placeholder="your@email.com"
                  placeholderTextColor="#b7bcc4"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={form.email}
                  onChangeText={(email) => setForm((current) => ({ ...current, email }))}
                  className="mt-2 h-[56px] border-b border-[#697486] bg-[#fbfbfb] px-4 text-[16px] text-[#2a3138]"
                />
                {errors.fields.identifier && (
                  <Text className="mt-2 text-[12px] text-[#ba1a1a]">
                    {errors.fields.identifier.message}
                  </Text>
                )}
              </View>

              {/* Password Field */}
              <View>
                <View className="flex-row items-center justify-between px-0 mb-2">
                  <Text className="text-[12px] font-semibold uppercase tracking-[3px] text-[#5f666d]">
                    Password
                  </Text>
                  {/* <Link href="/forgot-password">
                    <Text className="text-[12px] text-[#6a5c47] font-medium">
                      Forgot Password?
                    </Text>
                  </Link> */}
                </View>
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
                {errors.fields.password && (
                  <Text className="mt-2 text-[12px] text-[#ba1a1a]">
                    {errors.fields.password.message}
                  </Text>
                )}
              </View>
            </View>

            {/* Sign In Button */}
            <Pressable
              className="mt-10 h-[62px] items-center justify-center rounded-[8px] bg-[#1b2b3a]"
              style={{
                shadowColor: '#1b2b3a',
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.22,
                shadowRadius: 18,
                elevation: 4,
              }}
              disabled={isLoading}
              onPress={onSignInPress}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-[14px] font-semibold uppercase tracking-[4px] text-[#f8fafc]">
                  Sign In
                </Text>
              )}
            </Pressable>

            {/* Divider */}
            <View className="mb-8 mt-9 flex-row items-center gap-4">
              <View className="h-[1px] flex-1 bg-[#c9c9c6]" />
              <Text className="text-[13px] uppercase tracking-[2px] text-[#7b8085]">OR</Text>
              <View className="h-[1px] flex-1 bg-[#c9c9c6]" />
            </View>

            {/* Google Sign In */}
            <Pressable className="h-[62px] flex-row items-center justify-center rounded-[8px] border border-[#2c2922] bg-[#faf9f7]">
              <AntDesign name="google" size={20} color="#4285F4" style={{ marginRight: 14 }} />
              <Text className="text-[15px] font-medium uppercase tracking-[1.4px] text-[#111620]">
                Continue with Google
              </Text>
            </Pressable>

            {/* Sign Up Link */}
            <View className="mt-8 items-center">
              <Text className="text-[16px] text-[#3f454c]">
                Don&apos;t have an account?
                <Link href="/sign-up">
                  <Text className="font-semibold text-[#0f1721]" style={{ textDecorationLine: 'underline' }}>
                    {' '}
                    Sign Up
                  </Text>
                </Link>
              </Text>
            </View>

            <View nativeID="clerk-captcha" />
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View className="border-t border-[#e3e2e0] bg-[#faf9f7] px-6 py-4">
        <View className="items-center gap-2">
          <Text className="text-[12px] text-[#677079]">
            © 2024 HAVN. All rights reserved.
          </Text>
          <View className="flex-row gap-4">
            {/* <Link href="/privacy"> */}
              <Text className="text-[12px] text-[#677079]">Privacy</Text>
            {/* </Link> */}
            {/* <Link href="/terms"> */}
              <Text className="text-[12px] text-[#677079]">Terms</Text>
            {/* </Link> */}
            {/* <Link href="/help"> */}
              <Text className="text-[12px] text-[#677079]">Help</Text>
            {/* </Link> */}
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}