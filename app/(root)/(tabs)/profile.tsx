import { useAuth } from '@clerk/expo';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

export default function Profile() {
  const {signOut} = useAuth();
  const router = useRouter();

  const handleSignOut = async () =>{
    try {
      await signOut();
      router.replace("/sign-in");
    } catch (error) {
      console.error("Error singing out:", error);
    }
  }
  return (
    <View className='flex-1 items-center justify-center bg-white'>
      <Text>profile</Text>
      <Pressable onPress={handleSignOut}>
        <Text className='justify-center'>SignOut</Text>
      </Pressable>
    </View>
  )
};