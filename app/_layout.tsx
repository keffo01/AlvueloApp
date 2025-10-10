// app/_layout.tsx

import { CartProvider } from '@/context/CartContext';
import { SplashScreen, Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import SplashScreenAlvuelo from './screens/SplashScreen';


// Expo Router ya maneja la Splash Screen por defecto, pero si quieres hacer 
// una carga de recursos como la que hicimos, puedes usar useState
SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [appIsReady, setAppIsReady] = useState(false);
  
  useEffect(() => {
    async function prepare() {
      try {
        // 💡 Simula la carga de recursos de 2 segundos (como en el SplashScreen anterior)
        await new Promise(resolve => setTimeout(resolve, 4000));
        
        // Aquí iría tu lógica real de autenticación (ej: checkear token de usuario)
        // const isAuthenticated = checkIfUserLoggedIn(); 
        
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
        SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);
  
  if (!appIsReady) {
    // Mientras appIsReady es false, se muestra la Splash Screen de Expo
    return <SplashScreenAlvuelo />; 
  }

  return (
    <CartProvider> 
    <Stack>
      {/* Oculta el header para todas las pantallas por defecto, 
        el Drawer layout ya pondrá su propio header.
      */}
      <Stack.Screen name="(drawer)" options={{ headerShown: false }} /> 

      {/* Si tuvieras una pantalla de Login/Autenticación, iría aquí 
        <Stack.Screen name="auth" options={{ headerShown: false }} /> 
      */}
      
      {/* Ocultar cualquier otra ruta que no quieres mostrar */}      
    </Stack>
    </CartProvider> 
  );
}

export default RootLayout;