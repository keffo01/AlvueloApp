// screens/ShippingScreen.tsx
// ✍️ Actualizado por @keffoAlvuelo - Selección múltiple de fotos + Insets para Samsung S23 Ultra

import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '../../constants/colors';
import { useCart } from '../../context/CartContext';

interface ImageItem {
  uri: string;
  fileName: string;
  base64?: string;
}

const ShippingScreen = () => {
  const { addItemToCart } = useCart();
  const insets = useSafeAreaInsets(); // 📐 Insets seguros para evitar superposición con la botonera de Android

  const [orderDetail, setOrderDetail] = useState({
    description: '',
    pickupLocation: '',
    mapsUrl: '',
    referencePrice: '',
    images: [] as ImageItem[], // 📸 Ahora manejamos un arreglo de imágenes
  });

  // 📸 Función para seleccionar múltiples imágenes de la galería
  const pickImages = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permiso denegado", "Necesitamos acceso a tu galería para subir fotos de referencia.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true, // 💡 Selección múltiple habilitada
      quality: 0.7,
      base64: true, // Para facilitar la subida a S3 mediante Lambda
    });

    if (!result.canceled && result.assets) {
      const newImages: ImageItem[] = result.assets.map((asset, index) => ({
        uri: asset.uri,
        fileName: asset.fileName || `mandadito_${Date.now()}_${index}.jpg`,
        base64: asset.base64 || undefined,
      }));

      setOrderDetail(prev => ({
        ...prev,
        images: [...prev.images, ...newImages],
      }));
    }
  };

  // 🗑️ Eliminar una foto de la lista seleccionada
  const removeImage = (indexToRemove: number) => {
    setOrderDetail(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove),
    }));
  };

  const addToCart = () => {
    // Validaciones básicas
    if (!orderDetail.description || !orderDetail.pickupLocation) {
      Alert.alert("Campos incompletos", "Por favor, indícanos qué necesitas y de dónde lo recogemos.");
      return;
    }

    const uniqueId = `custom_favor_${Date.now()}`;

    // 💡 Transformamos el formulario en un ítem de carrito
    const customProductToAdd = {
      id: uniqueId,
      productId: uniqueId,
      name: `Favor: ${orderDetail.description.substring(0, 20)}...`,
      price: 3.50, // Precio base del servicio de mandadito
      basePrice: 3.50,
      
      // Agrupación bajo el "comercio" de Mandados
      establishment: {
        id: "servicio_personalizado",
        name: "Mandados Al Vuelo",
        deliveryCost: 0,
      },
      
      // Guardamos la información detallada del envío en optionsSelected
      optionsSelected: {
        isCustomFavor: true,
        fullDescription: orderDetail.description,
        pickupLocation: orderDetail.pickupLocation,
        mapsUrl: orderDetail.mapsUrl,
        referencePrice: parseFloat(orderDetail.referencePrice) || 0,
        images: orderDetail.images, // Arreglo de fotos adjuntas
      } as any
    };

    addItemToCart(customProductToAdd);
    
    Alert.alert("¡Agregado!", "Tu mandadito se ha agregado al carrito de compras.");
    
    // Limpiamos el formulario
    setOrderDetail({
      description: '',
      pickupLocation: '',
      mapsUrl: '',
      referencePrice: '',
      images: [],
    });
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: '#FAFAFA' }} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView 
        contentContainerStyle={[styles.container, { paddingBottom: 140 }]} 
        showsVerticalScrollIndicator={false}
      >
        
        <View style={styles.header}>
          <Text style={styles.title}>¿Qué necesitas hoy?</Text>
          <Text style={styles.subtitle}>Nosotros lo compramos, recogemos y te lo llevamos a donde estés.</Text>
        </View>

        {/* 📸 SECCIÓN DE FOTOS MÚLTIPLES */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Fotos de referencia (Opcional)</Text>
          
          <View style={styles.imagesGrid}>
            {orderDetail.images.map((img, index) => (
              <View key={index} style={styles.imageThumbnailWrapper}>
                <Image source={{ uri: img.uri }} style={styles.thumbnailImage} />
                <TouchableOpacity 
                  style={styles.removeBadge} 
                  onPress={() => removeImage(index)}
                  activeOpacity={0.8}
                >
                  <Ionicons name="close-circle" size={20} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            ))}

            <TouchableOpacity style={styles.addPhotosBtn} onPress={pickImages} activeOpacity={0.8}>
              <Ionicons name="camera-outline" size={28} color={Colors.primary} />
              <Text style={styles.addPhotosText}>Añadir foto</Text>
            </TouchableOpacity>
          </View>
        </View>

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

      {/* 📐 BOTÓN FLOTANTE CON PADDING DINÁMICO PARA PANTALLAS CON BOTONERA */}
      <View style={[
        styles.footer, 
        { paddingBottom: Math.max(insets.bottom, 16) }
      ]}>
        <TouchableOpacity style={styles.btn} onPress={addToCart} activeOpacity={0.9}>
          <Text style={styles.btnText}>Agregar al pedido</Text>
          <Text style={styles.btnPrice}>$3.50</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  header: { marginBottom: 20 },
  title: { fontSize: 26, fontWeight: '800', color: Colors.text, marginBottom: 5 },
  subtitle: { fontSize: 14, color: Colors.lightText, lineHeight: 20 },
  
  inputContainer: { marginBottom: 18 },
  label: { fontSize: 14, fontWeight: '600', color: Colors.text, marginBottom: 8 },

  // Estilos para la galería de fotos en cuadrícula
  imagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  imageThumbnailWrapper: {
    position: 'relative',
    width: 85,
    height: 85,
    borderRadius: 12,
    backgroundColor: '#eee',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    resizeMode: 'cover',
  },
  removeBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#fff',
    borderRadius: 11,
  },
  addPhotosBtn: {
    width: 85,
    height: 85,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
  },
  addPhotosText: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: '600',
    color: Colors.primary,
  },

  inputWrapper: {
    flexDirection: 'row', 
    alignItems: 'flex-start',
    backgroundColor: '#fff', 
    borderRadius: 12,
    borderWidth: 1, 
    borderColor: '#E5E7EB',
    paddingHorizontal: 12, 
    paddingVertical: Platform.OS === 'ios' ? 14 : 4,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03, 
    shadowRadius: 5, 
    elevation: 2,
  },
  icon: { marginRight: 10, marginTop: Platform.OS === 'ios' ? 0 : 10 },
  input: { flex: 1, fontSize: 15, color: Colors.text },
  textArea: { flex: 1, fontSize: 15, color: Colors.text, height: 80, textAlignVertical: 'top', marginTop: Platform.OS === 'ios' ? 0 : 10 },
  
  footer: {
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0,
    backgroundColor: '#fff', 
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1, 
    borderTopColor: '#f3f4f6',
    elevation: 10,
  },
  btn: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    backgroundColor: Colors.primary, 
    padding: 16, 
    borderRadius: 14,
    shadowColor: Colors.primary, 
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, 
    shadowRadius: 8, 
    elevation: 5,
  },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  btnPrice: { color: '#fff', fontWeight: '800', fontSize: 16, backgroundColor: 'rgba(0,0,0,0.15)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 }
});

export default ShippingScreen;