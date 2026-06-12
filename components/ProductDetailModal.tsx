// components/ProductDetailModal.tsx

import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ImageBackground,
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
        establishmentId: establishmentId,
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

  // 3. LÓGICA PARA EL BOTÓN +
  const handleIncrement = () => {
      if (quantity === 0) {
          handleAddToCart();
      } else {
          incrementQuantity(product.productId);
      }
  };

  return (
        <View style={styles.container}> 
            
            <View style={[styles.header, { top: insets.top + 10 }]}>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <Ionicons name="close-circle" size={36} color={Colors.lightText} />
                </TouchableOpacity>
            </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
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
          
          {/* SECCIÓN DE OPCIONES: Ahora con Radio Buttons */}
          <Text style={styles.optionsTitle}>Opciones Adicionales</Text>
          <View style={styles.optionsContainer}> 
            {Object.keys(product.options || {}).filter(key => key.includes('Complemento')).map(group => (
                <View key={group} style={styles.optionGroup}>
                    <Text style={styles.radioGroupLabel}>{group}:</Text>
                    <View style={styles.radioGroupContainer}>
                        {(product.options![group] as string[]).map((option: string) => {
                            const isSelected = selectedOptions[group] === option;
                            return (
                                <TouchableOpacity 
                                    key={option} 
                                    style={styles.radioOption}
                                    onPress={() => handleOptionChange(group, option)}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons 
                                        name={isSelected ? "radio-button-on" : "radio-button-off"} 
                                        size={22} 
                                        color={isSelected ? Colors.primary : Colors.lightText} 
                                    />
                                    <Text style={[styles.radioText, isSelected && styles.radioTextSelected]}>
                                        {option}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>
            ))}
          </View>

        </View>
      </ScrollView>
      
      {/* 4. FOOTER CORREGIDO: Padding bottom dinámico */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        
        <View style={styles.priceAndQuantityContainer}>
          <View style={styles.quantityControl}>
            <TouchableOpacity 
                onPress={() => decrementQuantity(product.productId)}
                style={styles.quantityButton}
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
                onPress={handleIncrement} 
                style={styles.quantityButton}
            >
              <Ionicons name="add" size={Sizes.font} color={Colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.addButton} 
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
      zIndex: 100, 
      backgroundColor: 'transparent'
  },
  closeButton: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  scrollContent: {
    paddingBottom: 140, 
  },
  imagePlaceholder: {
    width: '100%',
    height: 250, 
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
    color: Colors.primary, 
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
    marginBottom: 12,
  },
  optionsContainer: {
      marginBottom: Sizes.padding,
  },
  optionGroup: {
      marginBottom: 16,
  },
  /* NUEVOS ESTILOS PARA RADIO BUTTONS */
  radioGroupLabel: {
      fontSize: 15,
      fontWeight: '600',
      color: Colors.text,
      marginBottom: 10,
  },
  radioGroupContainer: {
      backgroundColor: '#F9FAFB',
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderWidth: 1,
      borderColor: '#EFEFEF',
  },
  radioOption: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
  },
  radioText: {
      fontSize: 15,
      color: Colors.text,
      marginLeft: 12,
  },
  radioTextSelected: {
      fontWeight: '600',
      color: Colors.text,
  },
  /* ESTILOS DEL FOOTER */
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
    backgroundColor: '#F0F0F0',
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