// components/ProductDetailModal.tsx
// ✍️ Actualizado por @keffoAlvuelo - Estructura de scroll interna optimizada para evitar cortes en complementos y footer

import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useEffect, useState } from 'react';
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '../constants/colors';
import Sizes from '../constants/Sizes';
import { useCart } from '../context/CartContext';

interface ProductDetailModalProps {
  visible: boolean;
  product: any;
  onClose: () => void;
  deliveryCost?: number;
  establishmentId?: string;
  establishmentName?: string;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ 
    product, 
    onClose, 
    deliveryCost,
    establishmentId,
    establishmentName
}) => {
  const { cart, addItemToCart, incrementQuantity, decrementQuantity } = useCart();
  const [selectedOptions, setSelectedOptions] = useState<{[key: string]: string}>({});
  
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const initialSelections: {[key: string]: string} = {}; 
    if (product.options) {
      Object.keys(product.options).forEach(groupKey => {
        const optionsList = product.options[groupKey];
        if (Array.isArray(optionsList) && optionsList.length > 0) {
          const firstOpt = optionsList[0];
          const optText = typeof firstOpt === 'string' ? firstOpt : (firstOpt?.S || JSON.stringify(firstOpt));
          initialSelections[groupKey] = optText;
        }
      });
      setSelectedOptions(initialSelections);
    }
  }, [product.options]);

  const cartItem = cart.find(item => item.productId === product.productId);
  const quantity = cartItem?.quantity || 0;

  const handleOptionChange = (group: string, value: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [group]: value,
    }));
  };

  const handleAddToCart = () => {
    const finalEstablishmentId = establishmentId || product.establishment?.id || product.establishmentId || 'com_default';
    let finalEstablishmentName = establishmentName || product.establishment?.name || product.establishmentName;

    if (!finalEstablishmentName || finalEstablishmentName === 'Establecimiento') {
      finalEstablishmentName = finalEstablishmentId === 'com_r8f2e9b1' ? 'Comedor Central' : 'Comercio Local';
    }

    const finalDeliveryCost = Number(deliveryCost ?? product.establishment?.deliveryCost ?? 1.50);

    addItemToCart({ 
        ...product, 
        productId: product.productId, 
        establishmentId: finalEstablishmentId,
        totalDeliveryCost: finalDeliveryCost,
        optionsSelected: selectedOptions,
        establishment: {
          id: finalEstablishmentId,
          name: finalEstablishmentName,
          deliveryCost: finalDeliveryCost
        }
    } as any); 
  };

  const handleIncrement = () => {
    if (quantity === 0) {
      handleAddToCart();
    } else {
      incrementQuantity(product.productId);
    }
  };

  return (
    <View style={styles.container}> 
      {/* Botón flotante de cierre */}
      <View style={[styles.header, { top: insets.top + 10 }]}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close-circle" size={36} color={Colors.lightText} />
        </TouchableOpacity>
      </View>

      {/* ScrollView principal que envuelve todo el contenido del plato y opciones */}
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={true}
      >
        <ImageBackground 
          source={{ uri: product.imageUri || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c' }} 
          style={styles.imagePlaceholder}
          imageStyle={styles.imageStyle}
        />

        <View style={styles.detailsContainer}>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.price}>${Number(product.price || 0).toFixed(2)}</Text>
          <Text style={styles.description}>
            {product.description || "Descripción detallada del producto."}
          </Text>
          
          {/* SECCIÓN DE OPCIONES Y COMPLEMENTOS */}
          <Text style={styles.optionsTitle}>Opciones y Complementos</Text>
          <View style={styles.optionsContainer}> 
            {Object.keys(product.options || {}).map(groupKey => {
              const optionsRaw = product.options![groupKey];
              const optionsArray = Array.isArray(optionsRaw) ? optionsRaw : [];

              if (optionsArray.length === 0) return null;

              return (
                <View key={groupKey} style={styles.optionGroup}>
                  <Text style={styles.radioGroupLabel}>{groupKey}:</Text>
                  <View style={styles.radioGroupContainer}>
                    {optionsArray.map((opt: any) => {
                      const optionText = typeof opt === 'string' ? opt : (opt?.S || JSON.stringify(opt));
                      const isSelected = selectedOptions[groupKey] === optionText;
                      
                      return (
                        <TouchableOpacity 
                          key={optionText} 
                          style={styles.radioOption}
                          onPress={() => handleOptionChange(groupKey, optionText)}
                          activeOpacity={0.7}
                        >
                          <Ionicons 
                            name={isSelected ? "radio-button-on" : "radio-button-off"} 
                            size={22} 
                            color={isSelected ? Colors.primary : Colors.lightText} 
                          />
                          <Text style={[styles.radioText, isSelected && styles.radioTextSelected]}>
                            {optionText}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
      
      {/* Footer fijo inferior con control de cantidad y botón de compra */}
      <View style={[
        styles.footer, 
        { paddingBottom: Math.max(insets.bottom, 16) }
      ]}>
        <View style={styles.priceAndQuantityContainer}>
          <View style={styles.quantityControl}>
            <TouchableOpacity 
              onPress={() => decrementQuantity(product.productId)}
              style={styles.quantityButton}
              disabled={quantity === 0}
            >
              <Ionicons name="remove" size={Sizes.font} color={quantity === 0 ? Colors.lightText : Colors.text} />
            </TouchableOpacity>
            
            <Text style={styles.quantityText}>{quantity}</Text>
            
            <TouchableOpacity onPress={handleIncrement} style={styles.quantityButton}>
              <Ionicons name="add" size={Sizes.font} color={Colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
          <Text style={styles.addButtonText}>
            {quantity > 0 ? `Actualizar / Añadir más` : `Añadir al Carrito`} (${Number(product.price || 0).toFixed(2)})
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: Colors.background 
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
    elevation: 5 
  },
  scrollContent: { 
    paddingBottom: 140 // 💡 Margen inferior amplio para que el footer flotante no tape el último complemento al hacer scroll
  },
  imagePlaceholder: { 
    width: '100%', 
    height: 250, 
    backgroundColor: '#f0f0f0', 
    marginBottom: Sizes.padding 
  },
  imageStyle: { 
    borderBottomLeftRadius: Sizes.radius, 
    borderBottomRightRadius: Sizes.radius, 
    resizeMode: 'cover' 
  },
  detailsContainer: { 
    paddingHorizontal: Sizes.padding 
  },
  name: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: Colors.text 
  },
  price: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: Colors.primary, 
    marginVertical: 4 
  },
  description: { 
    fontSize: 14, 
    color: Colors.lightText, 
    marginBottom: Sizes.padding, 
    lineHeight: 20 
  },
  optionsTitle: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: Colors.text, 
    marginTop: 10, 
    marginBottom: 12 
  },
  optionsContainer: { 
    marginBottom: Sizes.padding 
  },
  optionGroup: { 
    marginBottom: 16 
  },
  radioGroupLabel: { 
    fontSize: 15, 
    fontWeight: '600', 
    color: Colors.text, 
    marginBottom: 10 
  },
  radioGroupContainer: { 
    backgroundColor: '#F9FAFB', 
    borderRadius: 12, 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderWidth: 1, 
    borderColor: '#EFEFEF' 
  },
  radioOption: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 10 
  },
  radioText: { 
    fontSize: 15, 
    color: Colors.text, 
    marginLeft: 12 
  },
  radioTextSelected: { 
    fontWeight: '600', 
    color: Colors.text 
  },
  footer: { 
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0, 
    backgroundColor: Colors.background, 
    paddingHorizontal: Sizes.padding, 
    paddingTop: 12, 
    borderTopWidth: 1, 
    borderTopColor: '#EEE', 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    elevation: 10 
  },
  priceAndQuantityContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginRight: 10 
  },
  quantityControl: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#F0F0F0', 
    borderRadius: 8, 
    padding: 4 
  },
  quantityButton: { 
    padding: 8 
  },
  quantityText: { 
    fontSize: 16, 
    paddingHorizontal: 8, 
    fontWeight: 'bold', 
    color: Colors.text, 
    minWidth: 24, 
    textAlign: 'center' 
  },
  addButton: { 
    flex: 1, 
    backgroundColor: Colors.primary, 
    borderRadius: 8, 
    paddingVertical: 14, 
    alignItems: 'center', 
    marginLeft: 10 
  },
  addButtonText: { 
    color: '#FFF', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
});

export default ProductDetailModal;