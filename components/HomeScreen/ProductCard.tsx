import Sizes from '@/constants/Sizes';
import colors from '@/constants/colors';
import { Product } from '@/models/commons.model';
import React, { useState } from 'react';
import { ImageBackground, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ProductDetailModal from '../ProductDetailModal';

 // 💡 Importar el hook del carrito

interface ProductCardProps {
  product: Product;
  // 💡 Necesitamos estos datos para pasarlos al carrito desde el modal
  establishmentId: string; 
  deliveryCost: number; 
}
const ProductCard: React.FC<ProductCardProps> = ({ product, establishmentId, deliveryCost }) => {
 const [isModalVisible, setIsModalVisible] = useState(false);

  const handleOpenModal = () => {
    setIsModalVisible(true);
  };
  
  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  return (
    <>
    <TouchableOpacity style={styles.cardContainer} activeOpacity={0.9} onPress={handleOpenModal}>
      <ImageBackground 
        source={{ uri: product.imageUri }} 
        style={styles.imageBackground}
        imageStyle={styles.imageStyle}
      >
        <View style={styles.infoOverlay}>
          
          <View>
            <Text style={styles.name} numberOfLines={1}>{product.name}</Text>
          </View>
          
          <View style={styles.bottomRow}>
            {/* Precio */}
            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>Desde:</Text>
              <Text style={styles.price}>${product.price.toFixed(2)}</Text>
            </View>
          </View>

        </View>
      </ImageBackground>
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
  addButton: {
    backgroundColor: colors.primary,
    borderRadius: Sizes.radius / 2,
    padding: Sizes.smallPadding / 4,
    justifyContent: 'center',
    alignItems: 'center',
    height: 35,
    width: 35,
  },
  cardContainer: {
    // Mantendremos el ancho y alto que definimos para el carrusel
    width: 280, 
    height: 120, 
    marginRight: Sizes.smallPadding,
    borderRadius: Sizes.radius,
    overflow: 'hidden', // Importante para que el borde redondeado de la imagen se vea bien
    
    // Sombra/Elevación
    elevation: 3, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  imageBackground: {
    flex: 1, // Ocupa todo el espacio del cardContainer
    justifyContent: 'flex-end', // Alinea el contenido interno (infoOverlay) al final
  },
  imageStyle: {
    borderRadius: Sizes.radius, // Asegura que la imagen tenga los bordes redondeados
    resizeMode: 'cover', // Cubre todo el área
  },
  infoOverlay: {
    // 💡 Posiciona este View ABSOLUTAMENTE sobre la imagen
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    
    // Añadir un gradiente semitransparente oscuro en la parte inferior para mejorar la legibilidad del texto
    // Esto se logra mejor con una View semi-transparente o un gradiente real si necesitas más control
    backgroundColor: 'rgba(0,0,0,0.3)', // Fondo oscuro semitransparente
    
    padding: Sizes.smallPadding,
    justifyContent: 'space-between', // Para empujar el precio hacia abajo
  },
  name: {
    fontSize: Sizes.font,
    fontWeight: 'bold',
    color: colors.background, // Texto blanco para contraste sobre fondo oscuro
    marginBottom: Sizes.smallPadding / 4,
  },
  // description: { // Si decides mostrar la descripción, también debería ser blanca
  //   fontSize: Sizes.subtitle,
  //   color: Colors.background,
  // },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'flex-end', // Alinea el precio a la derecha
  },
  priceLabel: {
    fontSize: Sizes.subtitle,
    color: colors.background, // Texto blanco
    marginRight: 4,
  },
  price: {
    fontSize: Sizes.title, 
    color: colors.secondary, // Un color de acento para el precio
    fontWeight: '700',
  },
 
  image: {
    // 💡 La imagen ocupa una porción del ancho
    width: 100, 
    height: '100%', 
    borderRadius: Sizes.radius / 2,
    resizeMode: 'cover',
    marginRight: Sizes.smallPadding,
  },
  infoContainer: {
    flex: 1, // Permite que el contenedor de texto ocupe el espacio restante
    justifyContent: 'space-between', // Espacia el nombre/descripción del precio
    paddingVertical: Sizes.smallPadding / 2,
  },

  description: {
    fontSize: Sizes.subtitle,
    color: colors.lightText,
  },
  bottomRow: {
  flexDirection: 'row',
  justifyContent: 'space-between', // Distribuye el precio y el botón
  alignItems: 'flex-end',
}
});

export default ProductCard;