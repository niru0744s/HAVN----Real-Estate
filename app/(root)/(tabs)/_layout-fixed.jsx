import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Label>Home</Label>
        <Icon name="house.fill"/>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="search">
        <Icon name="magnifyingglass"/>
        <Label>Search</Label>
      </NativeTabs.Trigger>

      {/* ceate property */}

      <NativeTabs.Trigger name='saved'>
        <Icon name="heart.fill"/>
        <Label>Saved</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name='profile'>
        <Icon name="person.fill"/>
        <Label>Profile</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
