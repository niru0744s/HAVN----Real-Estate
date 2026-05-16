import React from 'react'
import { Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function HomeScreen() {
  return (
    <SafeAreaView className='flex-1 bg-gray-50'>
      <View className='items-center justify-center flex-1'>
        <Text>HomeScreen</Text>
      </View>
    </SafeAreaView>
  )
}