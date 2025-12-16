// app/(app)/_layout.tsx

import { Stack } from 'expo-router';
import React from 'react';

// Este layout manejará la navegación protegida (Home, Perfil, etc.)
export default function AppLayout() {
  return (
    <Stack>
      {/* Ajusta aquí las opciones de las pantallas dentro del área protegida. 
        Por ejemplo, si tienes un Drawer Navigator, lo pones aquí.
      */}
      <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
      {/* ... otras rutas protegidas ... */}
    </Stack>
  );
}