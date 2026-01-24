// components/ProductDetailModal.tsx

import Ionicons from '@expo/vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ImageBackground,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
// 1. IMPORTAR useSafeAreaInsets
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '../constants/colors';
import Sizes from '../constants/Sizes';
import { useCart } from '../context/CartContext';
import { Product } from '../models/commons.model';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  deliveryCost: number;
  establishmentId: string;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ 
    product, 
    onClose, 
    deliveryCost,
    establishmentId
}) => {
  const { cart, addItemToCart, incrementQuantity, decrementQuantity } = useCart();
  const [selectedOptions, setSelectedOptions] = useState<{[key: string]: string}>({});
  
  // 2. OBTENER INSETS PARA EVITAR QUE EL BOTÓN QUEDE TAPADO
  const insets = useSafeAreaInsets();

  // Inicializar opciones
  useEffect(() => {
        const initialSelections: {[key: string]: string} = {}; 
        if (product.options) {
            Object.keys(product.options).forEach(key => {
                const optionsList = product.options![key];
                if (
                    key.includes('Complemento') && 
                    Array.isArray(optionsList) && 
                    optionsList.length > 0 &&
                    typeof optionsList[0] === 'string'
                ) {
                    initialSelections[key] = optionsList[0] as string; 
                }
            });
            setSelectedOptions(initialSelections);
        }
    }, [product.options]);

  const cartItem = useMemo(() => {
    return cart.find(item => item.productId === product.productId);
  }, [cart, product.productId]);
  
  const quantity = cartItem?.quantity || 0;

  const handleOptionChange = (group: string, value: string) => {
        setSelectedOptions(prev => ({
            ...prev,
            [group]: value,
        }));
    };

  const handleAddToCart = () => {
    // Protección: Si hay opciones obligatorias vacías, podrías validar aquí.
    console.log("INTENTANDO AGREGAR:", {
        productId: product.productId,
        establishmentId: establishmentId, // <--- ¿ESTO IMPRIME UNDEFINED?
        price: product.price
    });

    if (!establishmentId) {
        alert("Error: No se ha identificado el establecimiento.");
        return;
    }
    addItemToCart({ 
        ...product, 
        productId: product.productId, 
        establishmentId: establishmentId,
        establishmentDeliveryCost: deliveryCost,
        optionsSelected: selectedOptions,
    } as any); 
  };

  // 3. NUEVA LÓGICA PARA EL BOTÓN +
  // Si el item no está en el carrito, el botón '+' debe AÑADIRLO, no incrementarlo.
  const handleIncrement = () => {
      if (quantity === 0) {
          handleAddToCart();
      } else {
          incrementQuantity(product.productId);
      }
  };

  return (
        // Quitamos SafeAreaView de aquí y usamos View normal con padding manual en el footer
        <View style={styles.container}> 
            
            <View style={[styles.header, { top: insets.top + 10 }]}>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <Ionicons name="close-circle" size={36} color={Colors.lightText} />
                </TouchableOpacity>
            </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ImageBackground 
                source={{ uri: product.imageUri }} 
                style={styles.imagePlaceholder}
                imageStyle={styles.imageStyle}
              />

        <View style={styles.detailsContainer}>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.price}>${product.price.toFixed(2)}</Text>
          <Text style={styles.description}>
            {product.description || "Descripción detallada del producto."}
          </Text>
          
          {/* SECCIÓN DE OPCIONES */}
          <Text style={styles.optionsTitle}>Opciones Adicionales</Text>
          <View style={styles.optionsContainer}> 
            {Object.keys(product.options || {}).filter(key => key.includes('Complemento')).map(group => (
                <View key={group} style={styles.optionGroup}>
                    <Text style={styles.pickerLabel}>{group}:</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={selectedOptions[group]}
                            onValueChange={(itemValue: string) => handleOptionChange(group, itemValue)}
                            style={styles.picker}
                            itemStyle={Platform.OS === 'ios' ? styles.pickerItem : undefined}
                        >
                            {(product.options![group] as string[]).map((option: string) => (
                                <Picker.Item key={option} label={option} value={option} />
                            ))}
                        </Picker>
                    </View>
                </View>
            ))}
          </View>

        </View>
      </ScrollView>
      
      {/* 4. FOOTER CORREGIDO: Padding bottom dinámico */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        
        {/* Solo mostramos controles +/- si ya hay al menos 1 elemento, o permitimos que el usuario empiece a sumar desde 0 visualmente */}
        <View style={styles.priceAndQuantityContainer}>
          <View style={styles.quantityControl}>
            <TouchableOpacity 
                onPress={() => decrementQuantity(product.productId)}
                style={styles.quantityButton}
                // Deshabilitar el menos si es 0
                disabled={quantity === 0}
            >
              <Ionicons 
                name="remove" 
                size={Sizes.font} 
                color={quantity === 0 ? Colors.lightText : Colors.text} 
              />
            </TouchableOpacity>
            
            <Text style={styles.quantityText}>{quantity}</Text>
            
            <TouchableOpacity 
                onPress={handleIncrement} // Usamos la nueva función inteligente
                style={styles.quantityButton}
            >
              <Ionicons name="add" size={Sizes.font} color={Colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity 
          style={[
              styles.addButton, 
              // Deshabilitar visualmente si es necesario, pero mejor dejarlo activo para "Actualizar"
              { opacity: 1 } 
          ]} 
          onPress={handleAddToCart}
        >
          <Text style={styles.addButtonText}>
            {quantity > 0 ? `Actualizar / Añadir más` : `Añadir al Carrito`} (${product.price.toFixed(2)})
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
      position: 'absolute',
      right: Sizes.smallPadding,
      zIndex: 100, // Asegura que esté por encima de la imagen
      backgroundColor: 'transparent'
  },
  closeButton: {
    // Estilos extra si se requieren
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  scrollContent: {
    paddingBottom: 140, // Un poco más de espacio para el footer
  },
  imagePlaceholder: {
    width: '100%',
    height: 250, // Un poco más alto se ve mejor
    backgroundColor: '#f0f0f0',
    marginBottom: Sizes.padding,
  },
  imageStyle: {
      borderBottomLeftRadius: Sizes.radius,
      borderBottomRightRadius: Sizes.radius,
      resizeMode: 'cover',
  },
  detailsContainer: {
    paddingHorizontal: Sizes.padding,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.text,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary, // Cambiado a Primary para resaltar
    marginVertical: 4,
  },
  description: {
    fontSize: 14,
    color: Colors.lightText,
    marginBottom: Sizes.padding,
    lineHeight: 20,
  },
  optionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 10,
    marginBottom: 8,
  },
  optionsContainer: {
      marginBottom: Sizes.padding,
  },
  optionGroup: {
      marginBottom: 12,
  },
  pickerLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: Colors.text,
      marginBottom: 4,
  },
  pickerContainer: {
      borderWidth: 1,
      borderColor: '#DDD',
      borderRadius: 8,
      backgroundColor: '#FAFAFA',
      overflow: 'hidden',
      height: Platform.OS === 'android' ? 50 : undefined, // Altura fija en Android ayuda
      justifyContent: 'center',
  },
  picker: {
      width: '100%',
      // En Android el color por defecto a veces es blanco sobre blanco, forzamos negro
      color: Colors.text, 
  },
  pickerItem: {
      fontSize: 16,
      color: Colors.text,
      height: 120, // Altura para iOS
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.background,
    padding: Sizes.padding,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // Sombras para que destaque sobre el contenido scrolleable
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 10,
  },
  priceAndQuantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0', // Fondo gris suave para los controles
    borderRadius: 8,
    padding: 4,
  },
  quantityButton: {
    padding: 8,
  },
  quantityText: {
    fontSize: 16,
    paddingHorizontal: 8,
    fontWeight: 'bold',
    color: Colors.text,
    minWidth: 24,
    textAlign: 'center',
  },
  addButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginLeft: 10,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProductDetailModal;