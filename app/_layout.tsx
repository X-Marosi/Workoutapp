import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { ThemedView } from '@/components/ThemedView';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const router = useRouter();
  const segments = useSegments();

  const onAuthStateChanged = (user: FirebaseAuthTypes.User | null) => {
    console.log('onAuthStateChanged', user);
    setUser(user);
    if (initializing) setInitializing(false);
  };

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);


  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  
  useEffect(() => {
    if (initializing) {
      return;
    }

    const inAuthGroup = segments[0] === '(tabs)';
    const inRegisterGroup = segments[0] === 'register';

    if (user && !inAuthGroup && !inRegisterGroup) {
      router.replace('/(tabs)/home');
    } else if (!user && inAuthGroup) {
      router.replace('/login');
    } else if (!user && !segments[0]) {
      router.replace('/login');
    }

  }, [user, initializing]); 

  if (initializing) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" color="#0a7ea4" />
      </ThemedView>
    )
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }}/>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }}/>
        <Stack.Screen name="+not-found" options={{ headerShown: false }}/>
        <Stack.Screen name="blankWou" options={{ headerShown: false }}/>
        <Stack.Screen name="exerciseList" options={{ headerShown: false }}/>
        <Stack.Screen name="settings" options={{ headerShown: false }}/>
        <Stack.Screen name="register" options={{ headerShown: false }}/>
        <Stack.Screen name="exerciseDetails" options={{ headerShown: false }}/>
        <Stack.Screen name="login" options={{ headerShown: false }}/>
      </Stack>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
});