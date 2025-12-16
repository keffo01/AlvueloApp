// app/(auth)/_layout.tsx
import { Stack } from 'expo-router';
export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" /> {/* Esto apunta a app/(auth)/index.tsx (tu AuthScreen) */}
      {/* Aquí irían otras pantallas de autenticación: registro, olvidé contraseña, etc. */}
    </Stack>
  );
}