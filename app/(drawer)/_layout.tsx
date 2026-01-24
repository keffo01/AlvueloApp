// app/(drawer)/_layout.tsx

import CartIcon from '@/components/CartIcon';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Drawer } from 'expo-router/drawer';
import React from 'react';
import CustomDrawerContent from '../../components/navigation/CustomDrawerContent'; // 💡 Asegúrate que la ruta sea correcta
import Colors from '../../constants/colors'; // 💡 Importamos las constantes

// NOTA: Para que el botón de cerrar sesión funcione, 
// todas las rutas que se usen en el drawer (index, profile, etc.) deben tener un archivo .tsx en esta carpeta.

export default function DrawerLayout() {
  return (
    <Drawer
      // 💡 Integra tu componente de contenido personalizado
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerActiveTintColor: Colors.primary,
        drawerLabelStyle: { marginLeft: 5 }, // Ajuste visual
        headerShown: true, // Mostrar el header con el botón de menú
      }}
    >
      <Drawer.Screen
        name="index" // Corresponde a app/(drawer)/index.tsx (Tu HomeScreen)
        options={{
          title: 'Inicio', // Título que se muestra en el header y en el Drawer
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
          headerRight: () => <CartIcon />, 
        }}
      />
      
      <Drawer.Screen
        name="Profile" // Corresponde a app/(drawer)/profile.tsx
        options={{
          title: 'Mi Perfil',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person-outline" color={color} size={size} />
          ),
           headerRight: () => <CartIcon />, 
        }}
      />
    </Drawer>
  );
}