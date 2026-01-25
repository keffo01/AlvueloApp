import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack 
      screenOptions={{ 
        headerShown: false,
        contentStyle: { backgroundColor: 'white' } // Si quieres un fondo común, ponlo aquí
      }}
    >
      {/* Solo componentes Screen aquí adentro */}
      <Stack.Screen name="index" />       {/* Esto corresponde a login */}
      <Stack.Screen name="register" />    {/* Esto corresponde a registerScreen.tsx (si ya lo renombraste) */}
      
    </Stack>
  );
}