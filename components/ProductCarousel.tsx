// components/ProductCarousel.tsx

import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  View
} from 'react-native';
import ProductCard from '../components/HomeScreen/ProductCard';
import Colors from '../constants/colors';
import Sizes from '../constants/Sizes';
import { Product } from '../models/commons.model';
// 💡 Asegúrate de importar el servicio correctamente
import { fetchCarouselProducts } from '../services/product-carousel.service';

interface ProductCarouselProps {
  interval?: number;
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({ interval = 5000 }) => {
  // Estados para manejar los datos y la carga
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const flatListRef = useRef<FlatList<Product>>(null); 
  
  const CARD_WIDTH = 260; 
  const SPACING = 12;
  const ITEM_SIZE = CARD_WIDTH + SPACING;

  // 1. Efecto para cargar los datos desde la API al iniciar
  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchCarouselProducts();
        setProducts(data);
      } catch (error) {
        console.error("Error al cargar el carrusel", error);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedProducts();
  }, []);

  // 2. Efecto para el auto-scroll
  useEffect(() => {
    // Si no hay datos o hay solo 1, no hace falta el scroll automático
    if (products.length <= 1) return;

    const timer = setInterval(() => {
      const nextIndex = (currentIndex + 1) % products.length;
      
      flatListRef.current?.scrollToOffset({
        offset: nextIndex * ITEM_SIZE,
        animated: true,
      });
      
      setCurrentIndex(nextIndex);
    }, interval); 

    return () => clearInterval(timer);
  }, [currentIndex, products.length, interval]);

  // Manejador para el scroll manual
  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollOffset / ITEM_SIZE);
    if (index !== currentIndex) {
      setCurrentIndex(index);
    }
  };

  const renderProductItem = ({ item }: { item: Product }) => (
    <View style={styles.cardWrapper}>
      <ProductCard 
        product={item} 
        establishmentId={item.establishment?.id || '0'} 
        deliveryCost={item.establishment?.deliveryCost || 0} 
      />
    </View>
  );

  // Pantalla de carga mientras se obtienen los datos de DynamoDB
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  // Si después de cargar no hay productos, no renderizamos nada (oculta el componente)
  if (products.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={products}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.productId}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_SIZE}
        decelerationRate="fast"
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.listContent}
      />
      
      {/* Indicador de progreso minimalista */}
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
  loadingContainer: {
    height: 250, // Aproximadamente el alto de la tarjeta para evitar saltos bruscos de UI
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  listContent: {
    paddingHorizontal: Sizes.padding,
    paddingBottom: 15,
  },
  cardWrapper: {
    width: 260,
    marginRight: 12,
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
    width: 12,
    backgroundColor: Colors.primary,
  }
});

export default ProductCarousel;