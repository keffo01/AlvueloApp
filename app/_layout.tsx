import { CartProvider } from '@/context/CartContext';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from '../context/authContext';

// 1. BLOQUEO TOTAL: Fuera del componente
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  return (
    <AuthProvider>
      <CartProvider>
      <MainNavigation />
      </CartProvider>
    </AuthProvider>
  );
}

function MainNavigation() {
  // 💡 Agregamos isNewUser aquí
  const { userToken, isNewUser, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  
  const [timePassed, setTimePassed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimePassed(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoading && timePassed) {
      SplashScreen.hideAsync();

      const inAuthGroup = segments[0] === '(auth)';

      if (!userToken && !inAuthGroup) {
        router.replace('/(auth)');
      } else if (userToken && inAuthGroup) {
        // 💡 Lógica condicionada:
        if (isNewUser) {
          console.log("Detectado usuario nuevo, enviando a Mapa");
          router.replace('/addresses/map');
        } else {
          console.log("Usuario existente, enviando a Home");
          router.replace('/(drawer)');
        }
      }
    }
  }, [isLoading, timePassed, userToken, isNewUser, segments]); // 💡 Añadimos isNewUser a las dependencias

  if (isLoading || !timePassed) {
    return null; 
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(drawer)" />
      <Stack.Screen name="index" /> 
      {/* ... resto de pantallas */}
    </Stack>
  );
}