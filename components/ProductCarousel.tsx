// components/ProductCarousel.tsx

import React, { useEffect, useRef, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import ProductCard from '../components/HomeScreen/ProductCard'; // Importa la tarjeta individual
import Sizes from '../constants/Sizes';
import { Product } from '../models/commons.model';

interface ProductCarouselProps {
  products: Product[];
  interval?: number;
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({ products, interval = 4000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<Product>>(null); 
  
  // 💡 CAMBIO CLAVE: Nuevo ancho del item para el cálculo del scroll
  // Ancho de la tarjeta (280) + marginRight (8) = 288
  const ITEM_WIDTH = 280 + Sizes.smallPadding; 

  useEffect(() => {
    if (products.length === 0) return;

    const timer = setInterval(() => {
      // Calcula el siguiente índice
      const nextIndex = (currentIndex + 1) % products.length;
      setCurrentIndex(nextIndex);
      
      // Desplaza la FlatList
      flatListRef.current?.scrollToIndex({ 
        index: nextIndex, 
        animated: true, 
      });
      
    }, interval); 

    // Limpia el temporizador
    return () => clearInterval(timer);
    
  }, [currentIndex, products.length, interval]); 

  // Función para renderizar un producto
  const renderProductItem = ({ item }: { item: Product }) => (
    <ProductCard product={item} establishmentId={''} deliveryCost={0} />
  );

  return (
    <View style={styles.container}>
      <FlatList
        //ref={flatListRef} // 💡 para darle scroll horizontal a productCard
        data={products}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.productId}
        horizontal
        showsHorizontalScrollIndicator={false}
        // Configuración para que el scroll se detenga exactamente en cada item
        snapToInterval={ITEM_WIDTH}
        decelerationRate="fast"
        contentContainerStyle={styles.horizontalListPadding}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Sizes.padding,
  },
  horizontalListPadding: {
    paddingHorizontal: Sizes.padding,
  },
});

export default ProductCarousel;