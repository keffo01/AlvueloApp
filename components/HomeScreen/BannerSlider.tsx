// components/HomeScreen/BannerSlider.tsx

import React, { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Colors from '../../constants/colors';
import Sizes from '../../constants/Sizes';

// Obtenemos el ancho de la pantalla para calcular las dimensiones del banner
const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Proporciones "cinematográficas": El ancho menos el padding doble, y la altura es la mitad de eso.
const BANNER_WIDTH = SCREEN_WIDTH - (Sizes.padding * 2);
const BANNER_HEIGHT = BANNER_WIDTH * (9 / 18); // Relación de aspecto 2:1 aproximadamente para look moderno

// Interface para los datos de los mocks
interface Banner {
  id: string;
  imageUri: string; // URL o require local de la imagen
  title?: string;
  description?: string;
  onPress?: () => void; // Acción al tocar el banner
}

interface BannerSliderProps {
  banners: Banner[];
}

const BannerSlider: React.FC<BannerSliderProps> = ({ banners }) => {
  // Estado para rastrear en qué índice del slider estamos para los puntitos
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Referencia al FlatList (opcional por si quisieras auto-scroll)
  const flatListRef = useRef<FlatList>(null);

  // Manejador del scroll para actualizar el índice actual
  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50, // Considera visible cuando el 50% de la card está en pantalla
  }).current;

  // Renderizador de cada ítem (banner)
  const renderItem = ({ item }: { item: Banner }) => {
    return (
      <TouchableOpacity 
        style={styles.cardContainer} 
        onPress={item.onPress} 
        activeOpacity={0.9}
      >
        <Image 
          source={typeof item.imageUri === 'string' ? { uri: item.imageUri } : item.imageUri} 
          style={styles.image} 
          resizeMode="cover" // Importante: Corta y llena sin deformar
        />
        {/* Superposición sutil de texto (Opcional, si tus banners traen texto) */}
        {(item.title || item.description) && (
          <View style={styles.textOverlay}>
            {item.title && <Text style={styles.bannerTitle}>{item.title}</Text>}
            {item.description && <Text style={styles.bannerDesc}>{item.description}</Text>}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <FlatList
        ref={flatListRef}
        data={banners}
        renderItem={renderItem}
        horizontal
        pagingEnabled // Fundamental para que se deslice de uno en uno
        showsHorizontalScrollIndicator={false}
        snapToInterval={SCREEN_WIDTH} // Alinea cada ítem al centro de la pantalla
        decelerationRate="fast"
        contentContainerStyle={styles.flatListContent}
        keyExtractor={(item) => item.id}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />
      
      {/* PAGINACIÓN (Puntitos sutiles) */}
      <View style={styles.paginationContainer}>
        {banners.map((_, index) => (
          <View 
            key={index} 
            style={[
              styles.paginationDot, 
              // El puntito actual es más ancho y de color primario
              currentIndex === index && styles.paginationDotActive
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    // Espacio vertical para que las sombras y puntitos no se corten
    paddingVertical: 5, 
  },
  flatListContent: {
    // Centra el primer banner ya que usamos pagingEnabled
    alignItems: 'center', 
  },
  cardContainer: {
    width: BANNER_WIDTH,
    height: BANNER_HEIGHT,
    borderRadius: 20, // Bordes muy redondeados para look moderno
    backgroundColor: '#eee', // Color de fondo temporal mientras carga imagen
    overflow: 'hidden', // Importante para que la imagen respete el radio
    // Sombra sutil para efecto de "tarjeta"
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    // Alineación central dentro del espacio de la pantalla
    marginHorizontal: Sizes.padding, 
  },
  image: {
    width: '100%',
    height: '100%',
  },
  // Superposición opcional
  textOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.3)', // Sombra sutil detrás del texto para legibilidad
    padding: 15,
  },
  bannerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  bannerDesc: {
    color: '#eee',
    fontSize: 12,
  },
  // Paginación
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15, // Espacio entre el banner y los puntitos
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e0e0e0', // Color gris para inactivos
    marginHorizontal: 4,
    // Pequeña animación de transición suave si cambias el índice
  },
  paginationDotActive: {
    width: 20, // Se expande horizontalmente
    backgroundColor: Colors.primary, // Color de tu app
  },
});

export default BannerSlider;