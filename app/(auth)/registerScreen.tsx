import colors from '@/constants/colors';
import Sizes from '@/constants/Sizes';
import { useAuth } from '@/context/authContext';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleRegister = async () => {
    try {
          const payload = { email: email.trim(), password: password };

      const response = await fetch('https://jfzj8yx48i.execute-api.us-east-2.amazonaws.com/Dev/register', {
        method: 'POST',
        headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json', }, // 👈 ESTO ES VITAL
        body: JSON.stringify(payload), // 👈 VITAL: Convertir el objeto a texto
      });

      const data = await response.json();

    if(data.statusCode == 400){return Alert.alert("Error", "por favor vuelve a intentarlo");}

    if(data.statusCode == 409){return Alert.alert("Warning", "email registrado");}
    if(data.statusCode == 500){return Alert.alert("Network", "Error del servidor");}

    if(data.statusCode == 201){
        // Al registrarse, el backend debe devolver isNewUser: true
        await login(data.token, true);
        
        // CHALLENGE 1: Redirigir al mapa inmediatamente
        Alert.alert("¡Bienvenido!", "Por favor, registra tu dirección inicial.");
        router.replace('/adresses/map'); 
      } else {
        Alert.alert("Error", data.message);
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo conectar con el servidor.");
      console.error(error);
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
        style={styles.registerButton} 
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Registrarse</Text>}
      </TouchableOpacity>

      {/* 💡 ESTA ES LA PARTE QUE SOLICITASTE */}
      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>¿Ya tienes una cuenta? </Text>
        <TouchableOpacity onPress={() => router.push('/')}>
          <Text style={styles.signupLink}>Iniciar Sesión</Text>
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
  registerButton: {
    backgroundColor: colors.secondary,
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