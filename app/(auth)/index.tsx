import colors from '@/constants/colors';
import Sizes from '@/constants/Sizes';
import { useAuth } from '@/context/authContext';
import { AuthService } from '@/services/auth.service';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert, Image, StyleSheet,
  Text, TextInput, TouchableOpacity, View
} from 'react-native';

export default function index() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { setToken } = useAuth();
  const router = useRouter();

 const handleLogin = async () => {
  const payload = { email: email.trim(), password: password };
  
  if (!email || !password) {
    Alert.alert("Error", "Por favor llena todos los campos");
    return;
  }

  setLoading(true);
  try {
    const response = await AuthService.login(payload);
    
    if (response.statusCode === 200) {
      // 1. Siempre guarda el token primero
      await setToken(response.token);
      
      // 2. Decide la ruta basándote en isNewUser
      if (response.isNewUser) {
        console.log("Redirigiendo a onboarding...");
        router.replace('/addresses/map');
      } else {
        console.log("Redirigiendo al Home...");
        router.replace('/(drawer)');
      }
      
      // Nota: Usamos return aquí para asegurar que no se ejecute nada más
      return;
    } 
    
    // Si llegamos aquí y no es 200, manejar errores de credenciales
    Alert.alert("Error", response.message || "Credenciales incorrectas");

  } catch (error) {
    Alert.alert("Error", "No se pudo conectar al servidor");
    console.error(error);
  } finally {
    setLoading(false);
  }
};

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
      <Text style={styles.title}>¡Bienvenido!</Text>
      
      <TextInput
        placeholder="Correo electrónico"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        placeholder="Contraseña"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity 
        style={styles.loginButton} 
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Ingresar</Text>}
      </TouchableOpacity>

      {/* 💡 ESTA ES LA PARTE QUE SOLICITASTE */}
      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>¿No tienes una cuenta? </Text>
        <TouchableOpacity onPress={() => router.push('/register')}>
          <Text style={styles.signupLink}>Regístrate</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Recuperar contraseña </Text>
        <TouchableOpacity onPress={() => router.push('/forgot-password')}>
          <Text style={styles.signupLink}>aquí</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: Sizes.padding * 1.5,
    backgroundColor: colors.background,
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: colors.text,
  },
  input: {
    backgroundColor: colors.white,
    padding: Sizes.padding,
    borderRadius: Sizes.radius,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: colors.border,
  },
  loginButton: {
    backgroundColor: colors.primary,
    padding: Sizes.padding,
    borderRadius: Sizes.radius,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: Sizes.font,
  },
  // Estilos para el enlace de registro
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
  },
  signupText: {
    color: colors.lightText,
    fontSize: Sizes.font,
  },
  signupLink: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: Sizes.font,
  },
});