// navigation/AppNavigator.js

import { createDrawerNavigator } from '@react-navigation/drawer'; // 💡 Nuevo import
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

// Importa tus pantallas
import HomeScreen from '../screens/HomeScreen';
import SplashScreen from '../screens/SplashScreen';
// Importa el contenido personalizado
import colors from '@/constants/colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import CustomDrawerContent from '../../compoents/navigation/CustomDrawerContent';

// Define los Navigators
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator(); // 💡 Inicializamos el Drawer

// Función para el Navegador de la Aplicación Principal (con Drawer)
const MainAppDrawer = () => (
  <Drawer.Navigator 
    initialRouteName="Home"
    // 💡 Aquí integramos nuestro componente de contenido personalizado
    drawerContent={(props) => <CustomDrawerContent {...props} />}
    screenOptions={{
        drawerActiveTintColor: colors.primary, // Color del texto activo
        headerShown: true, // Muestra el header para acceder al drawer
        headerTitle: 'Mi App de Delivery', // Título por defecto
    }}
  >
    {/* Pantalla principal que estará accesible desde el Drawer */}
    <Drawer.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ 
            title: 'Inicio',
            // Icono para el link en el drawer
            drawerIcon: ({ color, size }) => (
                <Ionicons name="home-outline" color={color} size={size} />
            ),
        }} 
    />
    
    {/* Puedes añadir más pantallas aquí, como "Perfil", "Pedidos", etc. */}
    <Drawer.Screen 
        name="Profile" 
        component={HomeScreen} // Usamos HomeScreen como placeholder
        options={{ 
            title: 'Mi Perfil',
            drawerIcon: ({ color, size }) => (
                <Ionicons name="person-outline" color={color} size={size} />
            ),
        }} 
    />

  </Drawer.Navigator>
);


const AppNavigator = () => {
  return (
      <Stack.Navigator initialRouteName="Splash">
        {/* Splash Screen (sin header) */}
        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
        
        {/* Contenedor Principal (El Drawer) */}
        {/* Aquí usamos el Drawer como la siguiente pantalla después del Splash */}
        <Stack.Screen name="AppMain" component={MainAppDrawer} options={{ headerShown: false }} />
      </Stack.Navigator>
  );
};

export default AppNavigator;