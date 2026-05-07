// components/ProductCarousel.tsx

import React, { useEffect, useRef, useState } from 'react';
import { FlatList, NativeScrollEvent, NativeSyntheticEvent, StyleSheet, View } from 'react-native';
import ProductCard from '../components/HomeScreen/ProductCard';
import Colors from '../constants/colors';
import Sizes from '../constants/Sizes';
import { Product } from '../models/commons.model';

interface ProductCarouselProps {
  products: Product[];
  interval?: number;
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({ products, interval = 5000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<Product>>(null); 
  
  // 💡 Ajuste de dimensiones: Un poco más estrecho para dejar ver la siguiente tarjeta
  // Esto invita al usuario a hacer scroll manualmente.
  const CARD_WIDTH = 260; 
  const SPACING = 12;
  const ITEM_SIZE = CARD_WIDTH + SPACING;

  useEffect(() => {
    if (products.length <= 1) return;

    const timer = setInterval(() => {
      const nextIndex = (currentIndex + 1) % products.length;
      
      // Solo hacemos scroll automático si el usuario no está interactuando
      flatListRef.current?.scrollToOffset({
        offset: nextIndex * ITEM_SIZE,
        animated: true,
      });
      
      setCurrentIndex(nextIndex);
    }, interval); 

    return () => clearInterval(timer);
  }, [currentIndex, products.length, interval]);

  // Manejador para actualizar el índice cuando el usuario hace scroll manual
  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollOffset / ITEM_SIZE);
    if (index !== currentIndex) {
      setCurrentIndex(index);
    }
  };

  const renderProductItem = ({ item }: { item: Product }) => (
    <View style={styles.cardWrapper}>
      {/* Pasamos props mockeados para evitar errores si el modelo lo requiere */}
      <ProductCard 
        product={item} 
        establishmentId={item.establishment.id || '0'} 
        deliveryCost={item.establishment.deliveryCost || 0} 
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={products}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.productId}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_SIZE} // Detenerse exactamente en la tarjeta
        decelerationRate="fast"
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.listContent}
        // Esto permite que la primera tarjeta se alinee con el título, 
        // pero que al final haya espacio para que la última no pegue al borde.
      />
      
      {/* Indicador de progreso minimalista (Línea delgada) */}
      <View style={styles.indicatorContainer}>
        {products.map((_, i) => (
          <View 
            key={i} 
            style={[
              styles.dot, 
              currentIndex === i ? styles.activeDot : null
            ]} 
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  listContent: {
    paddingHorizontal: Sizes.padding,
    paddingBottom: 15, // Espacio para que la sombra de ProductCard no se corte
  },
  cardWrapper: {
    width: 260, // Mismo ancho que CARD_WIDTH
    marginRight: 12, // Mismo que SPACING
    // Aquí podrías añadir una transformación de escala si quisieras que
    // la tarjeta central se vea más grande
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 2,
  },
  activeDot: {
    width: 12, // Se estira un poco
    backgroundColor: Colors.primary,
  }
});

export default ProductCarousel;