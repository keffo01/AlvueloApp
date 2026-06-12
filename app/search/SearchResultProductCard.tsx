// components/SearchResultProductCard.tsx

import ProductDetailModal from '@/components/ProductDetailModal';
import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../../constants/colors';
import Sizes from '../../constants/Sizes';

interface SearchResultProductCardProps {
    product: {
       category: string;
       description: string;
       establishment : {
      id: string;
        name: string;
        deliveryCost: number;
       };
       establishmentName: string;
       id: string;
       imageUri: string;
       name: string;
       price: number;
    };
}

const SearchResultProductCard: React.FC<SearchResultProductCardProps> = ({ product }) => {
    // 💡 NOTA: Al tocar un producto, podrías abrir el modal de detalle del producto (ProductDetailModal)
   console.log('Producto seleccionado:', product); // Para verificar que el producto se recibe correctamente
    const [isModalVisible, setIsModalVisible] = useState(false);
    
      const handleOpenModal = () => {
        setIsModalVisible(true);
      };
      
      const handleCloseModal = () => {
        setIsModalVisible(false);
      };
    

    return (
        <><TouchableOpacity style={styles.card} onPress={handleOpenModal}>
            <View style={styles.infoContainer}>
                <Text style={styles.name}>{product.name}</Text>
                <Text style={styles.establishmentName}>de {product.establishmentName}</Text>
            </View>
            <Text style={styles.price}>${product.price.toFixed(2)}</Text>
        </TouchableOpacity>
        
        <Modal
            visible={isModalVisible}
            onRequestClose={handleCloseModal}
            animationType="slide"
            presentationStyle="pageSheet" // Estilo iOS de modal (opcional)
        >
                        {/* Map the lightweight search product to the full Product shape expected by ProductDetailModal */}
                        <ProductDetailModal
                    product={product as any} // Usamos 'as any' para evitar conflictos de tipos estrictos, pero idealmente deberías adaptar tu modelo de producto para que sea compatible
                    onClose={handleCloseModal} 
                    deliveryCost={product.establishment.deliveryCost} 
                    establishmentId={product.establishment.id}                        />
            </Modal>
            </>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: Sizes.radius,
        marginBottom: Sizes.smallPadding,
        padding: Sizes.smallPadding,
        borderLeftWidth: 4,
        borderLeftColor: Colors.secondary, // Destacar que es un producto
    },
    infoContainer: {
        flex: 1,
        marginRight: Sizes.smallPadding,
    },
    name: {
        fontSize: Sizes.font,
        fontWeight: 'bold',
        color: Colors.text,
    },
    establishmentName: {
        fontSize: Sizes.smallPadding,
        color: Colors.lightText,
        marginTop: 2,
    },
    price: {
        fontSize: Sizes.font,
        fontWeight: 'bold',
        color: Colors.text,
    }
});

export default SearchResultProductCard;