import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthProvider, useAuth } from '../context/AuthContext';

function RootNav() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    async function checkAndRedirect() {
      if (loading) return;

      const seen = await AsyncStorage.getItem('hasSeenOnboarding');
      const hasSeenOnboarding = seen === 'true';
      const inAuthGroup = segments[0] === '(auth)';
      const onOnboarding = segments[0] === 'onboarding';

      if (!hasSeenOnboarding && !onOnboarding) {
        router.replace('/onboarding');
        return;
      }
      if (hasSeenOnboarding) {
        if (!user && !inAuthGroup) router.replace('/login');
        else if (user && (inAuthGroup || onOnboarding)) router.replace('/');
      }
    }
    checkAndRedirect();
  }, [user, loading, segments]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="provider/[id]" options={{ headerShown: true, headerBackTitle: 'Back' }} />
      <Stack.Screen name="category/[cat]" options={{ headerShown: true, headerBackTitle: 'Back' }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <RootNav />
      </AuthProvider>
    </SafeAreaProvider>
  );
}