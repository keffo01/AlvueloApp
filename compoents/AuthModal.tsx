// components/AuthModal.tsx

import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../constants/colors';
import Sizes from '../constants/Sizes';

interface AuthModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isVisible, onClose }) => {
  const handleLogin = (method: string) => {
    // 💡 Aquí iría la lógica real de inicio de sesión/registro
    alert(`Iniciando sesión con ${method}... (Lógica pendiente)`);
    onClose(); 
  };

  return (
    <Modal
      visible={isVisible}
      onRequestClose={onClose}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close-circle-outline" size={Sizes.header} color={Colors.lightText} />
          </TouchableOpacity>

          <Text style={styles.title}>¡Únete a la conversación!</Text>
          <Text style={styles.subtitle}>Necesitas iniciar sesión para dejar una opinión.</Text>

          {/* Botón de Google */}
          <TouchableOpacity 
            style={[styles.authButton, styles.googleButton]} 
            onPress={() => handleLogin('Google')}
          >
            <Ionicons name="logo-google" size={Sizes.font} color={'#fff'} />
            <Text style={styles.authButtonText}>Continuar con Google</Text>
          </TouchableOpacity>

          {/* Botón de Facebook */}
          <TouchableOpacity 
            style={[styles.authButton, styles.facebookButton]} 
            onPress={() => handleLogin('Facebook')}
          >
            <Ionicons name="logo-facebook" size={Sizes.font} color={'#fff'} />
            <Text style={styles.authButtonText}>Continuar con Facebook</Text>
          </TouchableOpacity>
          
          {/* Botón de Correo Electrónico (Placeholder) */}
          <TouchableOpacity 
            style={[styles.authButton, styles.emailButton]} 
            onPress={() => handleLogin('Correo Electrónico')}
          >
            <Ionicons name="mail-outline" size={Sizes.font} color={Colors.text} />
            <Text style={[styles.authButtonText, { color: Colors.text }]}>Iniciar Sesión / Registrarse</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
};

// ... (Estilos) ...
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semitransparente
  },
  modalView: {
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: Sizes.radius * 2,
    padding: Sizes.padding * 2,
    alignItems: 'center',
    elevation: 5,
    width: '90%',
  },
  closeButton: {
    position: 'absolute',
    top: Sizes.smallPadding,
    right: Sizes.smallPadding,
  },
  title: {
    fontSize: Sizes.title,
    fontWeight: 'bold',
    marginBottom: Sizes.smallPadding / 2,
    color: Colors.text,
  },
  subtitle: {
    fontSize: Sizes.font,
    color: Colors.lightText,
    textAlign: 'center',
    marginBottom: Sizes.padding * 2,
  },
  authButton: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    padding: Sizes.smallPadding,
    borderRadius: Sizes.radius,
    marginBottom: Sizes.smallPadding,
    justifyContent: 'center',
    height: 50,
  },
  authButtonText: {
    marginLeft: Sizes.smallPadding,
    fontSize: Sizes.font,
    fontWeight: 'bold',
    color: '#fff',
  },
  googleButton: {
    backgroundColor: Colors.error, // Rojo de Google
  },
  facebookButton: {
    backgroundColor: Colors.primary, // Azul de Facebook/Primary
  },
  emailButton: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.lightText,
  }
});

export default AuthModal;