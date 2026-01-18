import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import 'react-native-reanimated';

import { AppProvider } from '@/contexts/AppContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  return (
    <AppProvider>
      <ThemeProvider value={DefaultTheme}>
        <SafeAreaView style={{ flex: 1 }}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="signup" options={{ presentation: 'modal', title: 'Sign Up' }} />
          <Stack.Screen name="login" options={{ presentation: 'modal', title: 'Login' }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        </SafeAreaView>
        <StatusBar style="auto" />
      </ThemeProvider>
    </AppProvider>
  );
}
