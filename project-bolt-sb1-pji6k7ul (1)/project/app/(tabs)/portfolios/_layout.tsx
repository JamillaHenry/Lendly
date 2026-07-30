import { Stack } from 'expo-router';
import { PortfolioNav } from '@/components/PortfolioNav';

export default function PortfoliosLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="divine" />
      <Stack.Screen name="michael" />
      <Stack.Screen name="jamila" />
    </Stack>
  );
}
