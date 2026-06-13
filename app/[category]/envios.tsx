// screens/ShippingScreen.tsx
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
  Alert,
  Image, KeyboardAvoidingView, Platform,
  ScrollView,
  StyleSheet,
  Text, TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Colors from '../../constants/colors';
import { useCart } from '../../context/CartContext';

const ShippingScreen = () => {

  const { addItemToCart } = useCart();

  const [orderDetail, setOrderDetail] = useState({
    description: '',
    pickupLocation: '',
    mapsUrl: '',
    referencePrice: '',
    imageUri: null as string | null,
  });

  // Función para seleccionar una imagen de la galería
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permiso denegado", "Necesitamos acceso a tu galería para subir la foto de referencia.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setOrderDetail({ ...orderDetail, imageUri: result.assets[0].uri });
    }
  };

  const addToCart = () => {
    // Validaciones básicas
    if (!orderDetail.description || !orderDetail.pickupLocation) {
      Alert.alert("Campos incompletos", "Por favor, indícanos qué necesitas y de dónde lo recogemos.");
      return;
    }

    const uniqueId = `custom_favor_${Date.now()}`;

    // 💡 Transformamos el formulario en un item de carrito simulando un "Restaurante"
   const customProductToAdd = {
      id: uniqueId,
      productId: `custom_favor_${Date.now()}`,
      name: `Favor: ${orderDetail.description.substring(0, 20)}...`,
      price: 3.50, // Precio del servicio del mandado
      basePrice: 3.50, // Precio base para cálculos futuros
      // El carrito agrupará esto bajo el "restaurante" de Mandados
      establishment: {
        id: "servicio_personalizado",
        name: "Mandados Al Vuelo",
        deliveryCost: 0 // Lo dejamos en 0 porque el costo ya está en 'price'
      },
      
      // 💡 ¡EL TRUCO! Usamos optionsSelected para guardar toda la data del favor.
      // Al hacer esto, tu CartContext generará un ID único correctamente.
      optionsSelected: {
        isCustomFavor: true, // Bandera para identificarlo luego en el UI
        fullDescription: orderDetail.description,
        pickupLocation: orderDetail.pickupLocation,
        mapsUrl: orderDetail.mapsUrl,
        referencePrice: parseFloat(orderDetail.referencePrice) || 0,
        imageUri: orderDetail.imageUri,
      } as any // Hacemos un cast a 'any' para evitar problemas de tipo, ya que nuestro modelo de Product no tiene estas propiedades. En un proyecto real, podrías extender tu modelo para incluir esto de forma más elegante.
    };

    // 💡 4. Despachamos al contexto global
    addItemToCart(customProductToAdd);
    
    Alert.alert("¡Agregado!", "Tu mandadito se ha agregado al carrito de compras.");
    
    // Limpiamos el formulario 
    setOrderDetail({ description: '', pickupLocation: '', mapsUrl: '', referencePrice: '', imageUri: null });
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: '#FAFAFA' }} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
          <Text style={styles.title}>¿Qué necesitas hoy?</Text>
          <Text style={styles.subtitle}>Nosotros lo compramos, recogemos y te lo llevamos a donde estés.</Text>
        </View>

        {/* FOTO DE REFERENCIA */}
        <TouchableOpacity style={styles.imageUploadBtn} onPress={pickImage} activeOpacity={0.8}>
          {orderDetail.imageUri ? (
            <Image source={{ uri: orderDetail.imageUri }} style={styles.uploadedImage} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="camera-outline" size={32} color={Colors.primary} />
              <Text style={styles.imageUploadText}>Añadir foto de referencia (Opcional)</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* DESCRIPCIÓN */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Descripción del mandado *</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="document-text-outline" size={20} color={Colors.lightText} style={styles.icon} />
            <TextInput 
              style={styles.textArea}
              placeholder="Ej: Comprar 2 cajas de paracetamol en Farmacia San José..."
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={4}
              value={orderDetail.description}
              onChangeText={(t) => setOrderDetail({...orderDetail, description: t})}
            />
          </View>
        </View>

        {/* LUGAR DE RECOGIDA */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>¿Dónde lo buscamos? *</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="location-outline" size={20} color={Colors.lightText} style={styles.icon} />
            <TextInput 
              style={styles.input}
              placeholder="Nombre del local o dirección"
              placeholderTextColor="#9ca3af"
              value={orderDetail.pickupLocation}
              onChangeText={(t) => setOrderDetail({...orderDetail, pickupLocation: t})}
            />
          </View>
        </View>

        {/* ENLACE DE MAPS */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>URL de Google Maps (Opcional)</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="map-outline" size={20} color={Colors.lightText} style={styles.icon} />
            <TextInput 
              style={styles.input}
              placeholder="Pega el enlace aquí"
              placeholderTextColor="#9ca3af"
              value={orderDetail.mapsUrl}
              onChangeText={(t) => setOrderDetail({...orderDetail, mapsUrl: t})}
              keyboardType="url"
            />
          </View>
        </View>

        {/* PRECIO ESTIMADO */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Precio estimado del producto (Opcional)</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="cash-outline" size={20} color={Colors.lightText} style={styles.icon} />
            <TextInput 
              style={styles.input}
              placeholder="$ 0.00"
              placeholderTextColor="#9ca3af"
              value={orderDetail.referencePrice}
              onChangeText={(t) => setOrderDetail({...orderDetail, referencePrice: t})}
              keyboardType="numeric"
            />
          </View>
        </View>

      </ScrollView>

      {/* BOTÓN FLOTANTE ESTILO PREMIUM */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.btn} onPress={addToCart} activeOpacity={0.9}>
          <Text style={styles.btnText}>Agregar al pedido</Text>
          <Text style={styles.btnPrice}>$3.50</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 100 },
  header: { marginBottom: 25 },
  title: { fontSize: 26, fontWeight: '800', color: Colors.text, marginBottom: 5 },
  subtitle: { fontSize: 14, color: Colors.lightText, lineHeight: 20 },
  
  imageUploadBtn: { 
    height: 140, backgroundColor: '#F9FAFB', borderRadius: 16, 
    borderWidth: 2, borderColor: '#E5E7EB', borderStyle: 'dashed',
    justifyContent: 'center', alignItems: 'center', marginBottom: 20,
    overflow: 'hidden'
  },
  imagePlaceholder: { alignItems: 'center' },
  imageUploadText: { marginTop: 8, fontSize: 14, color: Colors.lightText, fontWeight: '500' },
  uploadedImage: { width: '100%', height: '100%', resizeMode: 'cover' },

  inputContainer: { marginBottom: 18 },
  label: { fontSize: 14, fontWeight: '600', color: Colors.text, marginBottom: 8 },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'flex-start',
    backgroundColor: '#fff', borderRadius: 12,
    borderWidth: 1, borderColor: '#E5E7EB',
    paddingHorizontal: 12, paddingVertical: Platform.OS === 'ios' ? 14 : 4,
    // Sombra sutil
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03, shadowRadius: 5, elevation: 2,
  },
  icon: { marginRight: 10, marginTop: Platform.OS === 'ios' ? 0 : 10 },
  input: { flex: 1, fontSize: 15, color: Colors.text },
  textArea: { flex: 1, fontSize: 15, color: Colors.text, height: 80, textAlignVertical: 'top', marginTop: Platform.OS === 'ios' ? 0 : 10 },
  
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#fff', padding: 20,
    borderTopWidth: 1, borderTopColor: '#f3f4f6',
  },
  btn: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: Colors.primary, padding: 18, borderRadius: 14,
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 5,
  },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  btnPrice: { color: '#fff', fontWeight: '800', fontSize: 16, backgroundColor: 'rgba(0,0,0,0.15)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 }
});

export default ShippingScreen;