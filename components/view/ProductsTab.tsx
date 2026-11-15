// views/ProductsTab.tsx
// ✍️ Actualizado por @keffoAlvuelo - FlatList con scroll nativo habilitado exclusivamente para el menú de platillos

import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import Colors from '../../constants/colors';
import Sizes from '../../constants/Sizes';
import { Product } from '../../models/commons.model';
import CardProduct from '../stablishment/CardProduct';

interface ProductsTabProps {
  products: Product[];
  deliveryCost: number;
}

const ProductsTab: React.FC<ProductsTabProps> = ({ products, deliveryCost }) => {
  //console.log('ProductsTab rendered with products:', products);
  const renderProduct = ({ item }: { item: Product }) => (
    <CardProduct 
      product={item} 
      establishmentId={item.establishment?.id || item.establishment.id} 
      deliveryCost={deliveryCost} 
    />
  );

  return (
    <View style={styles.container}> 
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.productId || Math.random().toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        scrollEnabled={true} // 💡 Scroll activo y fluido exclusivamente en esta pestaña de productos
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay productos disponibles en este horario.</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    paddingHorizontal: Sizes.padding, 
    paddingTop: Sizes.smallPadding,
    paddingBottom: 60, // Espacio amplio al final para evitar que el botón flotante cubra el último plato
    width: '100%', 
  },
  emptyContainer: {
    padding: Sizes.padding * 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  emptyText: {
    fontSize: Sizes.font,
    color: Colors.lightText,
    textAlign: 'center',
  },
});

export default ProductsTab;