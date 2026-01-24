import colors from '@/constants/colors';
import Sizes from '@/constants/Sizes';
import { useAuth } from '@/context/authContext';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function index() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    const payload = { email: email.trim(), password: password };
    if (!email || !password) {
      Alert.alert("Error", "Por favor llena todos los campos");
      return;
    }

    setLoading(true);
    try {

      const response = await fetch('https://jfzj8yx48i.execute-api.us-east-2.amazonaws.com/Dev/login', {
        method: 'POST',
        headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json', }, // 👈 ESTO ES VITAL
        body: JSON.stringify(payload), // 👈 VITAL: Convertir el objeto a texto
  });

      const data = await response.json();

      if(data.statusCode == 400){
        return Alert.alert("Error", "Faltan credenciales");
      }
      if(data.statusCode == 401){
        return Alert.alert("Error", "Credenciales incorrectas");
      }
      if (data.statusCode === 200) {
        // Guardamos el token y el flag isNewUser que viene de la Lambda
        await login(data.token, data.isNewUser);
        
        if (data.hasAddress === false) {
          router.replace('/adresses/map'); // Ruta a tu mapa
        } else {
           router.replace('/(drawer)');
        }
      } else {
        Alert.alert("Error", data.message || "Credenciales incorrectas");
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo conectar al servidor");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
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
        <TouchableOpacity onPress={() => router.push('/registerScreen')}>
          <Text style={styles.signupLink}>Regístrate</Text>
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