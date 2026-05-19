import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import CreateScreen from './create';
import HomeScreen from './index';
import ProfileScreen from './profile';
import SavedScreen from './saved';
import SearchScreen from './search';

import { useUserStore } from '@/store/userStore';
import { Platform } from 'react-native';

const Tab = createBottomTabNavigator();

function AndroidTabs() {
  const isAdmin = useUserStore(state => state.isAdmin);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'index') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'search') {
            iconName = focused ? 'magnify' : 'magnify';
          } else if (route.name === 'saved') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'profile') {
            iconName = focused ? 'account' : 'account-outline';
          } else if (route.name === 'create') {
            iconName = focused ? 'plus-circle' : 'plus-circle-outline';
          }

          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#0066CC',
        tabBarInactiveTintColor: '#999',
      })}
    >
      <Tab.Screen name="index" component={HomeScreen} options={{ title: 'Home' }} />
      <Tab.Screen name="search" component={SearchScreen} options={{ title: 'Search' }} />
      {isAdmin && (
        <Tab.Screen name="create" component={CreateScreen} options={{ title: 'Add Property' }} />
      )}
      <Tab.Screen name="saved" component={SavedScreen} options={{ title: 'Saved' }} />
      <Tab.Screen name="profile" component={ProfileScreen} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
};

function IosTabs() {
  const isAdmin = useUserStore(state => state.isAdmin);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'index') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'search') {
            iconName = focused ? 'magnify' : 'magnify';
          } else if (route.name === 'saved') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'profile') {
            iconName = focused ? 'account' : 'account-outline';
          } else if (route.name === 'create') {
            iconName = focused ? 'plus-circle' : 'plus-circle-outline';
          }

          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#0066CC',
        tabBarInactiveTintColor: '#999',
      })}
    >
      <Tab.Screen name="index" component={HomeScreen} options={{ title: 'Home' }} />
      <Tab.Screen name="search" component={SearchScreen} options={{ title: 'Search' }} />
      {isAdmin && (
        <Tab.Screen name="create" component={CreateScreen} options={{ title: 'Add Property' }} />
      )}
      <Tab.Screen name="saved" component={SavedScreen} options={{ title: 'Saved' }} />
      <Tab.Screen name="profile" component={ProfileScreen} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
};

export default function TabsLayout() {
  return Platform.OS === 'ios' ? <IosTabs /> : <AndroidTabs />;
};


