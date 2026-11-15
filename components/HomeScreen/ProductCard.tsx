// components/HomeScreen/ProductCard.tsx
// ✍️ Actualizado por @keffoAlvuelo - Uso de <Image> absoluto para garantizar la visualización de la carta

import Sizes from '@/constants/Sizes';
import colors from '@/constants/colors';
import { Product } from '@/models/commons.model';
import React, { useState } from 'react';
import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ProductDetailModal from '../ProductDetailModal';

interface ProductCardProps {
  product: Product;
  establishmentId: string; 
  deliveryCost: number; 
}

const ProductCard: React.FC<ProductCardProps> = ({ product, establishmentId, deliveryCost }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleOpenModal = () => setIsModalVisible(true);
  const handleCloseModal = () => setIsModalVisible(false);

  // Validación segura de la URI de la imagen
  const imageUri = product?.imageUri || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c';

  return (
    <>
      <TouchableOpacity style={styles.cardContainer} activeOpacity={0.9} onPress={handleOpenModal}>
        {/* 💡 Imagen de fondo absoluta para evitar los fallos de renderizado de ImageBackground */}
        <Image 
          source={{ uri: imageUri }} 
          style={styles.backgroundImage} 
        />
        
        {/* Capa semitransparente para asegurar que los textos resalten perfectamente sobre cualquier foto */}
        <View style={styles.infoOverlay}>
          <View style={styles.topContent}>
            <Text style={styles.name} numberOfLines={1}>{product.name}</Text>
          </View>
          
          <View style={styles.bottomRow}>
            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>Desde:</Text>
              <Text style={styles.price}>${Number(product.price || 0).toFixed(2)}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      {/* Modal de Detalle */}
      <Modal
        visible={isModalVisible}
        onRequestClose={handleCloseModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <ProductDetailModal 
          product={product} 
          onClose={handleCloseModal} 
          deliveryCost={deliveryCost}
          establishmentId={establishmentId || product?.establishment?.id}
        />
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: 280, // Ancho fijo del carrusel
    height: 120, // Altura fija de la tarjeta
    marginRight: Sizes.smallPadding,
    borderRadius: Sizes.radius,
    overflow: 'hidden',
    backgroundColor: '#1F2937', // Color de respaldo mientras carga la imagen
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    position: 'relative', // Requerido para absolute positioning de la imagen y el overlay
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  infoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Contraste oscuro equilibrado
    padding: Sizes.smallPadding,
    justifyContent: 'space-between',
  },
  topContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: Sizes.font,
    fontWeight: 'bold',
    color: colors.background,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 4,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Estilo pastilla sutil para el precio
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  priceLabel: {
    fontSize: Sizes.subtitle,
    color: colors.background,
    marginRight: 4,
    opacity: 0.9,
  },
  price: {
    fontSize: Sizes.title, 
    color: colors.secondary, 
    fontWeight: '700',
  },
});

export default ProductCard;