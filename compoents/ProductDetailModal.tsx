// components/ProductDetailModal.tsx

import Ionicons from '@expo/vector-icons/Ionicons';
// 💡 NUEVOS IMPORTS
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useMemo, useState } from 'react'; // Importar useState y useEffect
import { ImageBackground, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'; // Importar Platform
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../constants/colors';
import Sizes from '../constants/Sizes';
import { useCart } from '../context/CartContext';
import { Product } from '../models/commons.model';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  // Propiedad para el costo de envío (necesario para addItemToCart)
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
// 💡 ESTADO PARA OPCIONES SELECCIONADAS: { Complemento1: 'Arroz', Complemento2: 'Ensalada Fresca' }
    const [selectedOptions, setSelectedOptions] = useState<{[key: string]: string}>({});
  // 💡 INICIALIZAR OPCIONES AL MONTAR
  useEffect(() => {
        const initialSelections: {[key: string]: string} = {}; 
        
        // Usamos encadenamiento opcional (?) para protección y una condición de existencia
        if (product.options) {
            Object.keys(product.options).forEach(key => {
                // Obtenemos el array de opciones
                const optionsList = product.options![key]; // Usamos '!' aquí si TypeScript lo requiere, pero debería ser manejado por la interfaz
                
                // 💡 CHEQUEOS DE ROBUSTEZ:
                if (
                    key.includes('Complemento') && 
                    Array.isArray(optionsList) && 
                    optionsList.length > 0 &&
                    typeof optionsList[0] === 'string' // Aseguramos que es la lista de strings, no 'extras'
                ) {
                    // Ahora TypeScript sabe que optionsList es un array de strings aquí.
                    initialSelections[key] = optionsList[0] as string; 
                }
            });
            setSelectedOptions(initialSelections);
        }
    }, [product.options]);
    // Buscar si el producto ya está en el carrito para mostrar la cantidad
  const cartItem = useMemo(() => {
    return cart.find(item => item.productId === product.productId);
  }, [cart, product.productId]);
  
  const quantity = cartItem?.quantity || 0;
// 💡 FUNCIÓN PARA MANEJAR EL CAMBIO DEL PICKER
    const handleOptionChange = (group: string, value: string) => {
        setSelectedOptions(prev => ({
            ...prev,
            [group]: value, // Actualiza solo el grupo de complemento modificado
        }));
    };
  const handleAddToCart = () => {
    // ⚠️ Pasamos el producto enriquecido con los datos necesarios del establecimiento
    addItemToCart({ 
        ...product, 
        productId: product.productId, 
        establishmentId: establishmentId,
        establishmentDeliveryCost: deliveryCost,
        
        // 💡 NUEVO CAMPO: Opciones seleccionadas
        optionsSelected: selectedOptions,
    } as any); // Usamos 'as any' temporalmente si la interfaz de Product no está extendida
  };

  return (
    // 💡 1. Usar SafeAreaView como contenedor principal
        <SafeAreaView style={styles.container}> 
            
            {/* 💡 2. CABECERA: Contenedor para el botón de cerrar y la información clave */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <Ionicons name="close-circle" size={Sizes.header} color={Colors.lightText} />
                </TouchableOpacity>
            </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Imagen o Placeholder */}
        <ImageBackground 
                source={{ uri: product.imageUri }} 
                style={styles.imagePlaceholder}
                imageStyle={styles.imageStyle}
              >

        
        </ImageBackground>
        {/* Detalles del Producto */}
        <View style={styles.detailsContainer}>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.price}>${product.price.toFixed(2)}</Text>
          <Text style={styles.description}>
            {product.description || "Descripción detallada del producto. Aquí se explicarían los ingredientes y cualquier opción de personalización. Por ahora, solo es texto de relleno."}
          </Text>
          {/* 💡 CONTENEDOR DE OPCIONES (PICKERS) */}
<Text style={styles.optionsTitle}>Opciones Adicionales</Text>
<View style={styles.optionsContainer}> 
    
    {/* 💡 MAPEAR COMPLEMENTO1 y COMPLEMENTO2 */}
    {Object.keys(product.options || {}).filter(key => key.includes('Complemento')).map(group => (
        <View key={group} style={styles.optionGroup}>
            <Text style={styles.pickerLabel}>{group}:</Text>
            
            <View style={styles.pickerContainer}>
                <Picker
                    // 1. Valor actual para este grupo
                    selectedValue={selectedOptions[group]}
                    
                    // 2. Función de cambio
                    onValueChange={(itemValue: string) => handleOptionChange(group, itemValue)}
                    
                    style={styles.picker}
                    itemStyle={Platform.OS === 'ios' ? styles.pickerItem : undefined}
                >
                    {/* 3. Mapear las opciones DENTRO DE ESE GRUPO */}
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
      
      {/* Footer con Botones de Carrito */}
      <View style={styles.footer}>
        <View style={styles.priceAndQuantityContainer}>
          
          {/* Botones de Incrementar/Decrementar */}
          <View style={styles.quantityControl}>
            <TouchableOpacity 
                onPress={() => decrementQuantity(product.productId)}
                style={styles.quantityButton}
            >
              <Ionicons name="remove" size={Sizes.font} color={Colors.text} />
            </TouchableOpacity>
            
            <Text style={styles.quantityText}>{quantity}</Text>
            
            <TouchableOpacity 
                onPress={() => incrementQuantity(product.productId)}
                style={styles.quantityButton}
            >
              <Ionicons name="add" size={Sizes.font} color={Colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Botón Principal de Añadir al Carrito */}
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={handleAddToCart}
          disabled={quantity === 0 && cartItem} // Deshabilitar si ya está en 0
        >
          <Text style={styles.addButtonText}>
            {quantity > 0 ? `Añadir más` : `Añadir al Carrito`} (${product.price.toFixed(2)})
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// ... (Estilos) ...
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  closeButton: {
    position: 'absolute',
    top: Sizes.smallPadding + 10,
    right: Sizes.smallPadding,
    zIndex: 10,
  },
  scrollContent: {
    paddingBottom: 120, // Espacio para el footer
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: Colors.background,
    marginBottom: Sizes.padding,
  },
  detailsContainer: {
    paddingHorizontal: Sizes.padding,
  },
  name: {
    fontSize: Sizes.largePadding,
    fontWeight: 'bold',
    color: Colors.text,
  },
  price: {
    fontSize: Sizes.title,
    fontWeight: 'bold',
    color: Colors.secondary,
    marginVertical: Sizes.smallPadding / 2,
  },
  description: {
    fontSize: Sizes.font,
    color: Colors.lightText,
    marginBottom: Sizes.padding,
    lineHeight: 22,
  },
  optionsTitle: {
    fontSize: Sizes.subtitle,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: Sizes.padding,
    marginBottom: Sizes.smallPadding,
  },
  optionsPlaceholder: {
    height: 100,
    backgroundColor: Colors.background,
    borderRadius: Sizes.radius,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.background,
    padding: Sizes.padding,
    borderTopWidth: 1,
    borderTopColor: Colors.rating,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceAndQuantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Sizes.smallPadding,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: Sizes.radius,
    padding: Sizes.smallPadding / 4,
  },
  quantityButton: {
    padding: Sizes.smallPadding / 2,
    paddingHorizontal: Sizes.smallPadding,
  },
  quantityText: {
    fontSize: Sizes.font,
    paddingHorizontal: Sizes.smallPadding / 2,
    fontWeight: 'bold',
    color: Colors.text,
  },
  addButton: {
    flex: 1, // Ocupa el resto del espacio
    backgroundColor: Colors.primary,
    borderRadius: Sizes.radius,
    padding: Sizes.padding,
    alignItems: 'center',
    marginLeft: Sizes.smallPadding,
  },
  addButtonText: {
    color: Colors.background,
    fontSize: Sizes.font,
    fontWeight: 'bold',
  },
   imageStyle: {
      borderRadius: Sizes.radius, // Asegura que la imagen tenga los bordes redondeados
      resizeMode: 'cover', // Cubre todo el área
    },
    optionsContainer: {
        marginBottom: Sizes.padding,
        padding: Sizes.smallPadding,
        backgroundColor: Colors.background,
        borderRadius: Sizes.radius,
    },
    optionGroup: {
        marginBottom: Sizes.smallPadding,
    },
    pickerLabel: {
        fontSize: Sizes.font,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: Sizes.smallPadding,
    },
    pickerContainer: {
        // Contenedor para el borde del Picker
        borderWidth: 1,
        borderColor: Colors.lightText,
        borderRadius: Sizes.radius,
        backgroundColor: Colors.background,
        overflow: 'hidden', // Necesario para que el borde se vea bien en algunas plataformas
    },
    picker: {
        height: Platform.select({ ios: 100, android: 50 }), // iOS necesita más altura
        width: '100%',
        color: Colors.text,
    },
    pickerItem: {
        fontSize: Sizes.font,
        color: Colors.text,
    },
    
});

export default ProductDetailModal;