// navigation/CustomDrawerContent.tsx

import { useAuth } from '@/context/authContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList
} from '@react-navigation/drawer';
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import Colors from '../../constants/colors';
import Sizes from '../../constants/Sizes';

// Tipo de Propiedades para asegurar el tipado
type CustomDrawerProps = DrawerContentComponentProps;

const CustomDrawerContent: React.FC<CustomDrawerProps> = (props) => {
 const { logout } = useAuth();
  const handleLogout = () => {
   
    
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que quieres cerrar la sesión?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        { 
          text: "Sí, Cerrar", 
          onPress: () => {
            // Lógica de navegación a Login/Splash
            logout();
            console.log("Sesión cerrada");
            // Nota: Aquí usaríamos navigation.replace('Login')
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* 1. Área Desplazable (Links y elementos por defecto) */}
      <DrawerContentScrollView {...props} contentContainerStyle={styles.scrollContainer}>
        
        {/* Encabezado del Drawer (Personalizado) */}
        <View style={styles.header}>
          <Ionicons name="person-circle-outline" size={70} color={Colors.primary} />
          <Text style={styles.userName}>Hola, { 'Usuario' }</Text>
          <Text style={styles.userEmail}>usuario@example.com</Text>
        </View>

        {/* Links de navegación estándar (Home, Profile, etc.) */}
        <DrawerItemList {...props} />

        {/* Componentes sin Redirección (Ejemplo) */}
        <View style={styles.staticSection}>
          <Text style={styles.staticText}>Versión de la App: 1.0.0</Text>
          <Text style={styles.staticText}>Idioma: Español</Text>
        </View>
        
      </DrawerContentScrollView>

      {/* 2. Área Fija (Botón de Cerrar Sesión) */}
      <View style={styles.bottomSection}>
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={Sizes.icon} color={Colors.error} />
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingTop: 0, // Elimina el padding superior por defecto
  },
  header: {
    padding: Sizes.largePadding,
    alignItems: 'center',
    marginBottom: Sizes.padding,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#F7F7F7', // Un fondo diferente para el header
  },
  userName: {
    fontSize: Sizes.title,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: Sizes.smallPadding / 2,
  },
  userEmail: {
    fontSize: Sizes.subtitle,
    color: Colors.lightText,
  },
  staticSection: {
    padding: Sizes.padding,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginTop: Sizes.padding,
  },
  staticText: {
    fontSize: Sizes.subtitle,
    color: Colors.lightText,
    marginBottom: 5,
  },
  // Estilos del Botón de Cerrar Sesión
  bottomSection: {
    padding: Sizes.padding,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Sizes.smallPadding,
  },
  logoutText: {
    marginLeft: Sizes.smallPadding,
    fontSize: Sizes.font,
    color: Colors.error,
    fontWeight: '600',
  }
});

export default CustomDrawerContent;