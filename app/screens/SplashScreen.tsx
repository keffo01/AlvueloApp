// screens/SplashScreen.js

import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

const SplashScreenAlvuelo = () => {
  const navigation = useRouter(); // Hook para obtener el objeto de navegación


  return (
    <View style={styles.container}>
      <Image 
        source={require('../../assets/images/logo.png')} // Asegúrate de que esta ruta sea correcta
        style={styles.logo} 
      />
      <Text style={styles.appName}>¡Todo lo que necesitas en un solo lugar!</Text>
      <Text style={styles.loadingText}>Cargando...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff', // Un color de fondo distintivo
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain', // Asegura que la imagen se ajuste bien
    marginBottom: 20,
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00BCD4',
    marginBottom: 10,
  },
  loadingText: {
    fontSize: 15,
    color: '#00BCD4',
  },
});

export default SplashScreenAlvuelo;