import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Colors from '../../constants/colors';

const ShippingScreen = () => {
  const [orderDetail, setOrderDetail] = useState({
    description: '',
    from: '',
    to: '',
  });

  const addToCart = () => {
    // 💡 Lógica para transformar el formulario en un item de carrito
    const customProduct = {
      id: 'shipping_service',
      name: 'Servicio de Mandadito',
      price: 3.50, // Precio base o calculado
      customData: orderDetail, 
      quantity: 1
    };
    console.log("Agregado al carrito:", customProduct);
    // Aquí llamas a tu dispatch de Redux/Zustand o Context
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>¿Qué necesitas que traigamos?</Text>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Descripción del favor</Text>
        <TextInput 
          style={styles.textArea}
          placeholder="Ej: Comprar medicina en la farmacia y traerla..."
          multiline
          numberOfLines={4}
          value={orderDetail.description}
          onChangeText={(t) => setOrderDetail({...orderDetail, description: t})}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>¿Dónde lo recogemos?</Text>
        <TextInput 
          style={styles.input}
          placeholder="Punto de origen"
          value={orderDetail.from}
          onChangeText={(t) => setOrderDetail({...orderDetail, from: t})}
        />
      </View>

      <TouchableOpacity style={styles.btn} onPress={addToCart}>
        <Text style={styles.btnText}>Agregar al pedido ($3.50)</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  title: { fontSize: 22, fontWeight: '800', marginBottom: 20 },
  formGroup: { marginBottom: 15 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  input: { backgroundColor: '#F3F4F6', padding: 12, borderRadius: 10 },
  textArea: { backgroundColor: '#F3F4F6', padding: 12, borderRadius: 10, height: 100, textAlignVertical: 'top' },
  btn: { backgroundColor: Colors.primary, padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 20 },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});

export default ShippingScreen;