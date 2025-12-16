// app/_layout.tsx

import { Stack } from 'expo-router';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import Colors from '../constants/colors';
import { AuthProvider, useAuth } from '../context/authContext';

// Componente que maneja la navegación condicional
function RootLayoutNav() {
  const { isAuthenticated, isLoading } = useAuth(); // Asume que 'isLoading' existe si verificas AsyncStorage
  
  // 1. Mostrar pantalla de carga
  if (isLoading) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      );
  }

  // 2. Estructura de Rutas y Redirección
  return (
    <Stack screenOptions={{ headerShown: false }}>
      
      {/* 2a. Grupo de Autenticación (Ruta: app/(auth)) */}
      <Stack.Screen 
        name="(auth)"
        // Si el usuario está autenticado, ¡redirige a la app!
        options={{ 
          redirect: isAuthenticated ? '/(drawer)' : undefined 
        }}
      />
      
      {/* 2b. Grupo de la Aplicación (Ruta: app/(drawer)) */}
      <Stack.Screen 
        name="(drawer)"
        // Si el usuario NO está autenticado, ¡redirige al login!
        options={{ 
          redirect: isAuthenticated ? undefined : '/(auth)' 
        }}
      />
      
      {/* 3. Redirección por defecto
        Si alguien intenta ir a la ruta raíz '/', lo enviamos al grupo protegido.
      */}
      <Stack.Screen name="index" options={{ redirect: true }} />

    </Stack>
  );
}

// El proveedor de autenticación envuelve toda la aplicación
export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}