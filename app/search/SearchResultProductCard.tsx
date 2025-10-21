// components/SearchResultProductCard.tsx

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../../constants/colors';
import Sizes from '../../constants/Sizes';

interface SearchResultProductCardProps {
    product: {
        id: string;
        name: string;
        price: number;
        establishmentName: string; // Nombre del local
    };
}

const SearchResultProductCard: React.FC<SearchResultProductCardProps> = ({ product }) => {
    // 💡 NOTA: Al tocar un producto, podrías abrir el modal de detalle del producto (ProductDetailModal)
    const handlePress = () => {
        alert(`Abrir modal de detalle para: ${product.name}`);
    };

    return (
        <TouchableOpacity style={styles.card} onPress={handlePress}>
            <View style={styles.infoContainer}>
                <Text style={styles.name}>{product.name}</Text>
                <Text style={styles.establishmentName}>de {product.establishmentName}</Text>
            </View>
            <Text style={styles.price}>${product.price.toFixed(2)}</Text>
        </TouchableOpacity>
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