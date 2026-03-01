import colors from '@/constants/colors';
import Sizes from '@/constants/Sizes';
import { useAuth } from '@/context/authContext';
import { AuthService } from '@/services/auth.service';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [nickName, setNickName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleRegister = async () => {
     setLoading(true);
    try {
          const payload = { 
            email: email.trim(), 
            nickName: nickName.trim(),
            phoneNumber: phoneNumber.trim(),
            password: password };

      const response = await AuthService.register(payload);

      
      console.log("Respuesta del registro:", JSON.stringify(response));
    if(response.statusCode == 400){return Alert.alert("Error", "por favor vuelve a intentarlo");}

    if(response.statusCode == 409){
      setLoading(false);
      return Alert.alert("Warning", "email registrado"); 
}
    if(response.statusCode == 500){
      setLoading(false);
      return Alert.alert("Network", "Error del servidor");
}
     if (response.statusCode === 201) {
    // 💡 IMPORTANTE: Usa login en lugar de setToken
    // Esto marcará isNewUser como true en el estado global
    await login(response.token, true); 
    
    // El useEffect de MainNavigation detectará el cambio y 
    // te moverá automáticamente al mapa.
    Alert.alert("¡Bienvenido!", "Por favor, registra tu dirección inicial.");
} else {
            Alert.alert("Error", response.message || "No se pudo crear la cuenta");
        }
    } catch (error) {
      Alert.alert("Error", "No se pudo conectar con el servidor.");
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
            <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
      
      <Text style={styles.title}>¡Bienvenido!</Text>
      
      <TextInput
        placeholder="Nombre de usuario"
        style={styles.input}
        value={nickName}
        onChangeText={setNickName}
        autoCapitalize= "words"
        
      />
      <TextInput
        placeholder="Número de teléfono"
        style={styles.input}
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        autoCapitalize="none"
        keyboardType="phone-pad"
      />
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
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 30,
  },
});