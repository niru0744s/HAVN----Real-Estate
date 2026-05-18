import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs';

import { useUserStore } from '@/store/userStore';

export default function TabLayout() {

  const isAdmin = useUserStore(state => state.isAdmin);


  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Label>Home</Label>
        <Icon name="house.fill" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="search">
        <Icon name="magnifyingglass" />
        <Label>Search</Label>
      </NativeTabs.Trigger>

      {/* ceate property */}

      {isAdmin && (
        <NativeTabs.Trigger name='create'>
          <Icon name="plus.circle.fill" />
          <Label>Add Property</Label>
        </NativeTabs.Trigger>
      )}

      <NativeTabs.Trigger name='saved'>
        <Icon name="heart.fill" />
        <Label>Saved</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name='profile'>
        <Icon name="person.fill" />
        <Label>Profile</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
