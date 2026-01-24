// components/ProductCard.tsx

import colors from '@/constants/colors';
import Sizes from '@/constants/Sizes';
import { Product } from '@/models/commons.model';
import React, { useState } from 'react';
import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ProductDetailModal from '../ProductDetailModal';
 // 💡 Usar el Contexto

interface ProductCardProps {
  product: Product;
  // 💡 Necesitamos estos datos para pasarlos al carrito desde el modal
  establishmentId: string; 
  deliveryCost: number; 
}

const ProductCard: React.FC<ProductCardProps> = ({ product, establishmentId, deliveryCost }) => {
   const [isModalVisible, setIsModalVisible] = useState(false);
  console.log("RENDERIZANDO PRODUCT CARD CON ESTABLISHMENT ID:", establishmentId);

 const handleOpenModal = () => {
    setIsModalVisible(true);
  };
  
  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  return (
    <>
    <TouchableOpacity 
          style={styles.card} 
          onPress={handleOpenModal}
          activeOpacity={0.8}
        >
      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={1}>{product.name}</Text>
        <Text style={styles.description} numberOfLines={2}>{product.description}</Text>
        <Text style={styles.price}>${product.price.toFixed(2)}</Text>
      </View>

      <View style={styles.imageButtonContainer}>
        {/* Imagen del Producto */}
        <Image 
          source={{ uri: product.imageUri }} 
          style={styles.image} 
          resizeMode="cover"
        />
       
      </View>
   </TouchableOpacity>
       {/* 💡 Modal de Detalle */}
      <Modal
        visible={isModalVisible}
        onRequestClose={handleCloseModal}
        animationType="slide"
        presentationStyle="pageSheet" // Estilo iOS de modal (opcional)
      >
        <ProductDetailModal 
          product={product} 
          onClose={handleCloseModal} 
          deliveryCost={deliveryCost}
          establishmentId={establishmentId}
        />
      </Modal>
   </>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: Sizes.radius,
    marginBottom: Sizes.smallPadding,
    padding: Sizes.smallPadding,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  infoContainer: {
    flex: 1,
    paddingRight: Sizes.smallPadding,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: Sizes.font,
    fontWeight: 'bold',
    color: colors.text,
  },
  description: {
    fontSize: Sizes.smallPadding,
    color: colors.lightText,
    marginVertical: 4,
  },
  price: {
    fontSize: Sizes.font,
    fontWeight: '700',
    color: colors.primary,
  },
  imageButtonContainer: {
    width: 90, 
    height: 90,
    borderRadius: Sizes.radius,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute', // Para que el botón se superponga
  },
  addButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16, // Lo hacemos circular
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    // Leve sombra en el botón para que se destaque
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  }
});

export default ProductCard;