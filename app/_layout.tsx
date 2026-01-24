import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from '../context/authContext';

// 1. BLOQUEO TOTAL: Fuera del componente
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  return (
    <AuthProvider>
      <MainNavigation />
    </AuthProvider>
  );
}

function MainNavigation() {
  const { userToken, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  
  // Estado para controlar los 2 segundos mínimos
  const [timePassed, setTimePassed] = useState(false);

  // 2. Temporizador de 2 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      setTimePassed(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // 3. Lógica de ocultar Splash y Redirección
  useEffect(() => {
    // Solo actuamos cuando:
    // - El AuthContext terminó de leer el token (isLoading es false)
    // - YA pasaron los 2 segundos (timePassed es true)
    if (!isLoading && timePassed) {
      
      SplashScreen.hideAsync(); // Ocultamos el Splash nativo

      const inAuthGroup = segments[0] === '(auth)';

      if (!userToken && !inAuthGroup) {
        router.replace('/(auth)');
      } else if (userToken && inAuthGroup) {
        router.replace('/(drawer)');
      }
    }
  }, [isLoading, timePassed, userToken, segments]);

  // 4. EL ESCUDO: Si no estamos listos, devolvemos NULL.
  // Esto evita que se renderice el Stack de abajo y se vea el login.
  if (isLoading || !timePassed) {
    return null; 
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(drawer)" />
      <Stack.Screen name="index" /> 
      <Stack.Screen 
    name="establishment/[id]" 
    options={{ 
      headerShown: true, 
      title: 'Detalle del Local' 
    }} 
  />
    </Stack>
  );
}