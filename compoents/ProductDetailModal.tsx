// components/ProductDetailModal.tsx

import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useMemo } from 'react';
import { ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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

  // Buscar si el producto ya está en el carrito para mostrar la cantidad
  const cartItem = useMemo(() => {
    return cart.find(item => item.productId === product.productId);
  }, [cart, product.productId]);
  
  const quantity = cartItem?.quantity || 0;

  const handleAddToCart = () => {
    // ⚠️ Pasamos el producto enriquecido con los datos necesarios del establecimiento
    addItemToCart({ 
        ...product, 
        productId: product.productId, // Asegurarse de usar productId
        establishmentId: establishmentId,
        establishmentDeliveryCost: deliveryCost
    } as any); // Usamos 'as any' temporalmente si la interfaz de Product no está extendida
  };

  return (
    <View style={styles.container}>
      {/* Botón de Cerrar */}
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <Ionicons name="close-circle" size={Sizes.header} color={Colors.lightText} />
      </TouchableOpacity>

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
          
          {/* Aquí iría la lógica de opciones y modificadores (futuro) */}
          <Text style={styles.optionsTitle}>Opciones Adicionales (Futuro)</Text>
          <View style={styles.optionsPlaceholder} />

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
    </View>
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
});

export default ProductDetailModal;