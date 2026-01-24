// components/AddressForm.tsx

import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Colors from '../../constants/colors';
import Sizes from '../../constants/Sizes';

// Propiedades que recibirá del componente del mapa
interface AddressFormProps {
  initialAddress: {
    latitude: number;
    longitude: number;
    fullAddressLine: string;
    city: string;
  };
  onCancel: () => void;
  onSave: (finalAddress: any) => void;
}

const AddressForm: React.FC<AddressFormProps> = ({ initialAddress, onCancel, onSave }) => {
  const router = useRouter();
  const [addressName, setAddressName] = useState(''); // Ej: "Casa", "Oficina"
  const [reference, setReference] = useState(''); // Ej: "Apartamento 3B", "Al lado del parque"

  const handleSave = () => {
    if (!addressName.trim()) {
      Alert.alert('Error', 'Por favor, dale un nombre a tu dirección (Ej: Casa).');
      return;
    }

    // 1. Crear el objeto final de la dirección
    const finalAddress = {
      name: addressName.trim(),
      latitude: initialAddress.latitude,
      longitude: initialAddress.longitude,
      street_address: initialAddress.fullAddressLine,
      city: initialAddress.city,
      reference: reference.trim(),
      // Aquí se podría agregar el 'user_id' o 'is_default'
    };

    // 2. Invocar la función de guardado
    onSave(finalAddress);

    // TODO: Aquí iría la lógica real para persistir la dirección 
    // (Ej: llamar a una API o guardar en AsyncStorage/Redux)
    //Alert.alert('¡Guardado!', `La dirección "${addressName}" ha sido guardada.`);
  
  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.title}>Guardar Dirección</Text>
      
      {/* Muestra la dirección geocodificada al usuario */}
      <Text style={styles.prefilledLabel}>Ubicación:</Text>
      <Text style={styles.prefilledText}>{initialAddress.fullAddressLine}, {initialAddress.city}</Text>

      <Text style={styles.inputLabel}>Nombre de la Dirección (Ej: Casa): *</Text>
      <TextInput
        style={styles.input}
        value={addressName}
        onChangeText={setAddressName}
        placeholder="Ej: Casa principal, Oficina"
        maxLength={30}
      />
      
      <Text style={styles.inputLabel}>Referencia o Detalles Adicionales (Opcional):</Text>
      <TextInput
        style={styles.input}
        value={reference}
        onChangeText={setReference}
        placeholder="Ej: Apto 3B, Dejar en recepción"
        maxLength={100}
      />

      <View style={styles.buttonGroup}>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.buttonText}>Guardar Dirección</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    padding: Sizes.largePadding,
    backgroundColor: Colors.white,
    borderTopLeftRadius: Sizes.radius * 2,
    borderTopRightRadius: Sizes.radius * 2,
    marginTop: 'auto', // Para que el formulario aparezca en la parte inferior
    width: '100%',
  },
  title: {
    fontSize: Sizes.title,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Sizes.padding * 2,
    textAlign: 'center',
  },
  prefilledLabel: {
    fontSize: Sizes.font,
    color: Colors.secondary,
    marginBottom: Sizes.smallPadding / 2,
  },
  prefilledText: {
    fontSize: Sizes.subtitle,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Sizes.padding * 2,
  },
  inputLabel: {
    fontSize: Sizes.font,
    color: Colors.text,
    marginBottom: Sizes.smallPadding / 2,
    fontWeight: '600',
  },
  input: {
    height: 50,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: Sizes.radius,
    paddingHorizontal: Sizes.padding,
    marginBottom: Sizes.padding * 2,
    fontSize: Sizes.font,
    color: Colors.text,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Sizes.padding,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Sizes.padding,
    borderRadius: Sizes.radius,
    flex: 1,
    marginLeft: Sizes.padding,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: Colors.lightGrey,
    paddingVertical: Sizes.padding,
    borderRadius: Sizes.radius,
    flex: 1,
    marginRight: Sizes.padding,
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.white,
    fontSize: Sizes.subtitle,
    fontWeight: 'bold',
  },
});

export default AddressForm;