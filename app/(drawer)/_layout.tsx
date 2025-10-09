// app/(drawer)/_layout.tsx

import CartIcon from '@/compoents/CartIcon';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Drawer } from 'expo-router/drawer';
import React from 'react';
import CustomDrawerContent from '../../compoents/navigation/CustomDrawerContent'; // 💡 Asegúrate que la ruta sea correcta
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
      {/* AQUÍ DEFINES CADA RUTA. EL NOMBRE DEL ARCHIVO ES EL NOMBRE DE LA RUTA.
      */}
      
      {/* El archivo index.tsx en esta carpeta es la ruta por defecto (la Home)
      */}
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
      
      {/* Ejemplo de otra pantalla (app/(drawer)/profile.tsx)
      */}
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
      
      {/* Puedes usar `<Drawer.Screen name="..." options={{ drawerItemStyle: { height: 0 } }} />`
          para ocultar rutas del drawer si son solo un Stack dentro del Drawer.
      */}
    </Drawer>
  );
}