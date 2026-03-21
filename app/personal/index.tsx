import Colors from '@/constants/colors'; // Ajusta según tu ruta
import React, { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../context/authContext';
import { UserService } from '../../services/user.service';

export default function UpdatePersonalData() {
  const { userData, updateUserData } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // Estados del formulario
  const [phone, setPhone] = useState(userData?.phoneNumber || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleUpdate = async () => {
    // 1. Validaciones básicas
    if (!phone) return Alert.alert("Error", "El teléfono es obligatorio.");
    
    // Si intenta cambiar pass, validar campos
    if (currentPassword || newPassword) {
      if (!currentPassword || !newPassword || !confirmPassword) {
        return Alert.alert("Error", "Completa todos los campos de contraseña.");
      }
      if (newPassword !== confirmPassword) {
        return Alert.alert("Error", "Las nuevas contraseñas no coinciden.");
      }
      if (newPassword.length < 6) {
        return Alert.alert("Error", "La nueva contraseña debe tener al menos 6 caracteres.");
      }
    }

    try {
      setLoading(true);
      const response = await UserService.updatePersonalData({
        email: userData?.email || '', // Asegúrate de que el email esté disponible
        phoneNumber: phone,
        currentPassword: currentPassword || null,
        newPassword: newPassword || null,
      });

      // 2. Actualizar contexto global
      updateUserData({ ...userData, phoneNumber: phone } 
      );

      Alert.alert("¡Éxito!", "Datos actualizados correctamente.");
      // Limpiar campos de pass
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

    } catch (error: any) {
      Alert.alert("Error", error.message || "No se pudo actualizar la información.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.label}>Número de Teléfono</Text>
        <TextInput 
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          placeholder="Ej: 77778888"
        />
      </View>

      <View style={[styles.section, { marginTop: 20 }]}>
        <Text style={styles.titleSection}>Cambiar Contraseña</Text>
        <Text style={styles.subtitle}>Deja en blanco si no deseas cambiarla</Text>

        <Text style={styles.label}>Contraseña Actual</Text>
        <TextInput 
          style={styles.input}
          value={currentPassword}
          onChangeText={setCurrentPassword}
          secureTextEntry
          placeholder="********"
        />

        <Text style={styles.label}>Nueva Contraseña</Text>
        <TextInput 
          style={styles.input}
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
          placeholder="Mínimo 6 caracteres"
        />

        <Text style={styles.label}>Confirmar Nueva Contraseña</Text>
        <TextInput 
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          placeholder="********"
        />
      </View>

      <TouchableOpacity 
        style={[styles.btnUpdate, loading && { backgroundColor: '#ccc' }]} 
        onPress={handleUpdate}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Guardar Cambios</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  section: { marginBottom: 15 },
  titleSection: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  subtitle: { fontSize: 12, color: '#666', marginBottom: 15 },
  label: { fontSize: 14, color: '#333', marginBottom: 5, fontWeight: '600' },
  input: { 
    borderWidth: 1, 
    borderColor: '#ddd', 
    borderRadius: 8, 
    padding: 12, 
    fontSize: 16,
    backgroundColor: '#f9f9f9'
  },
  btnUpdate: { 
    backgroundColor: Colors.primary, 
    padding: 16, 
    borderRadius: 10, 
    alignItems: 'center', 
    marginTop: 20,
    marginBottom: 40
  },
  btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});