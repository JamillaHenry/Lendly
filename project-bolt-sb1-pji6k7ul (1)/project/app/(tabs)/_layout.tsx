import { Tabs } from 'expo-router';
import {
  Home,
  Search,
  PlusSquare,
  Map,
  Handshake,
  Users,
} from 'lucide-react-native';
import { colors } from '@/lib/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary[600],
        tabBarInactiveTintColor: colors.neutral[400],
        tabBarLabelStyle: {
          fontFamily: 'Inter-Medium',
          fontSize: 12,
        },
        tabBarStyle: {
          backgroundColor: colors.neutral[0],
          borderTopColor: colors.neutral[200],
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Browse',
          tabBarIcon: ({ size, color }) => (
            <Home size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ size, color }) => (
            <Search size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: 'List Item',
          tabBarIcon: ({ size, color }) => (
            <PlusSquare size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Map',
          tabBarIcon: ({ size, color }) => (
            <Map size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="lending"
        options={{
          title: 'My Lending',
          tabBarIcon: ({ size, color }) => (
            <Handshake size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="portfolios"
        options={{
          title: 'Portfolios',
          tabBarIcon: ({ size, color }) => (
            <Users size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
    </Tabs>
  );
}
