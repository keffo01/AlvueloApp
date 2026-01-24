// views/ProductsTab.tsx

import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import Sizes from '../../constants/Sizes';
import Colors from '../../constants/colors';
import { Product } from '../../models/commons.model';
import CardProduct from '../stablishment/CardProduct';

interface ProductsTabProps {
  products: Product[];
}

const ProductsTab: React.FC<ProductsTabProps> = ({ products }) => {
  const renderProduct = ({ item }: { item: Product }) => (
    <CardProduct product={item} establishmentId={item.establishment.id} deliveryCost={item.establishment.deliveryCost} />
  );

  return (
    <View style={styles.container}> 
        <FlatList
            data={products}
            renderItem={renderProduct}
            keyExtractor={(item) => item.productId}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false} // 💡 IMPEDIR SCROLL INTERNO // IMPORTANTE: Desactivar el scroll si el padre es ScrollView
      
        />
    </View>
  );
};

const styles = StyleSheet.create({
  
   container: {
    flex: 1, // El contenedor debe llenar el espacio del TabView
  },
   listContent: {
    // 💡 Ajuste aquí: Usamos el padding base para que los productos no se peguen a los bordes
    paddingHorizontal: Sizes.padding, 
    paddingTop: Sizes.smallPadding,
    // Aseguramos que el contenido ocupe el ancho disponible
    width: '100%', 
  },
  emptyContainer: {
    padding: Sizes.padding * 2,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: Sizes.font,
    color: Colors.lightText,
  }
  
});

export default ProductsTab;