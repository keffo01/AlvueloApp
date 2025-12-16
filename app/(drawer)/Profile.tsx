// app/(drawer)/profile/index.tsx

import { Stack, useRouter } from 'expo-router'; // 💡 Añadir useRouter para la navegación
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'; // 💡 Añadir View y Text
import ProfileOption from '../../compoents/profile/options'; // 💡 Importar el nuevo componente
import ProfileHeader from '../../compoents/profile/profileHeader'; // 💡 Importar el componente del encabezado
import Colors from '../../constants/colors';
import Sizes from '../../constants/Sizes';

const ProfileScreen: React.FC = () => {
  const router = useRouter(); // Inicializar router

  // Simulación de navegación
  const handleNavigation = (path: any) => {
    // Por ahora solo mostrará una alerta, luego lo reemplazas con router.push(path)
    alert(`Navegando a: ${path}`); 
     router.replace(path); // Descomentar cuando tengas las rutas
  };
  
  // Lista de opciones para el menú
  const ACCOUNT_OPTIONS = [
    { iconName: 'location-outline', title: 'Mis Direcciones', onPress: () => handleNavigation('/adresses') },
    { iconName: 'notifications-outline', title: 'Notificaciones', onPress: () => handleNavigation('notifications') },
  ];

  const GENERAL_OPTIONS = [
    { iconName: 'help-circle-outline', title: 'Ayuda y Soporte', onPress: () => handleNavigation('help') },
    { iconName: 'document-text-outline', title: 'Términos y Condiciones', onPress: () => handleNavigation('terms') },
  ];

  const handleLogout = () => {
    // 💡 Lógica real: Limpiar el contexto de autenticación, etc.
    alert('Cerrando Sesión...');
    // router.replace('/'); // Redirigir a la pantalla de inicio de sesión o bienvenida
  };

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Mi Perfil',
          headerStyle: { backgroundColor: '#fff' },
          headerShadowVisible: false,
        }}
      />

      <ProfileHeader />

      {/* --- SECCIÓN DE LA CUENTA --- */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mi Cuenta</Text>
        {ACCOUNT_OPTIONS.map((option, index) => (
          <ProfileOption
            key={option.title}
            iconName={option.iconName as any} // Se usa 'as any' porque el tipo es complejo
            title={option.title}
            onPress={option.onPress}
            isLast={index === ACCOUNT_OPTIONS.length - 1}
          />
        ))}
      </View>

      {/* --- SECCIÓN GENERAL --- */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>General</Text>
        {GENERAL_OPTIONS.map((option, index) => (
          <ProfileOption
            key={option.title}
            iconName={option.iconName as any}
            title={option.title}
            onPress={option.onPress}
            isLast={index === GENERAL_OPTIONS.length - 1}
          />
        ))}
      </View>

      {/* --- BOTÓN DE CERRAR SESIÓN --- */}
      <TouchableOpacity 
        style={styles.logoutButton} 
        onPress={handleLogout}
        activeOpacity={0.8}
      >
        <Text style={styles.logoutText}>Cerrar Sesión</Text>
      </TouchableOpacity>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  // Estilos de las secciones (para crear espacios)
  section: {
    marginTop: Sizes.padding,
    marginBottom: Sizes.smallPadding,
  },
  sectionTitle: {
    fontSize: Sizes.subtitle,
    fontWeight: 'bold',
    color: Colors.lightText,
    paddingHorizontal: Sizes.padding,
    paddingVertical: Sizes.smallPadding / 2,
  },
  // Estilos del botón de Cerrar Sesión
  logoutButton: {
    backgroundColor: '#fff',
    paddingVertical: Sizes.padding,
    alignItems: 'center',
    marginTop: Sizes.padding,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.background,
  },
  logoutText: {
    fontSize: Sizes.font,
    color: Colors.error, // Color rojo para destacar
    fontWeight: 'bold',
  },
});

export default ProfileScreen;