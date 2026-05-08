import React, { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Colors from '../../constants/colors';
import Sizes from '../../constants/Sizes';
import ProductDetailModal from '../ProductDetailModal';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BANNER_WIDTH = SCREEN_WIDTH - (Sizes.padding * 2);
const BANNER_HEIGHT = BANNER_WIDTH * (9 / 18); 

interface Banner {
  id: string;
  imageUri: string | any; // Ajustado por si usas require() local
  title?: string;
  description?: string;
  productData: any;
  onPress?: () => void; 
}

interface BannerSliderProps {
  banners: Banner[];
}

const BannerSlider: React.FC<BannerSliderProps> = ({ banners }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
 
  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50, 
  }).current;

  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleOpenModal = () => {
    setIsModalVisible(true);
  };
  
  const handleCloseModal = () => {
    setIsModalVisible(false);
  };
 
  const renderItem = ({ item }: { item: Banner }) => {
    return (
      <TouchableOpacity 
        style={styles.cardContainer} 
        onPress={handleOpenModal} 
        activeOpacity={0.9}
      >
        <Image 
          source={typeof item.imageUri === 'string' ? { uri: item.imageUri } : item.imageUri} 
          style={styles.image} 
          resizeMode="cover"
        />
        {/* 💡 SOLUCIÓN 2: Operadores ternarios para evitar renderizar strings vacíos */}
        {(item.title || item.description) ? (
          <View style={styles.textOverlay}>
            {item.title ? <Text style={styles.bannerTitle}>{item.title}</Text> : null}
            {item.description ? <Text style={styles.bannerDesc}>{item.description}</Text> : null}
          </View>
        ) : null}
      </TouchableOpacity>
    );
  };

  return (
    /* 💡 SOLUCIÓN 1: Se eliminó el espacio en blanco maldito después del <> */
    <>
      <View style={styles.mainContainer}>
        <FlatList
          ref={flatListRef}
          data={banners}
          renderItem={renderItem}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          snapToInterval={SCREEN_WIDTH}
          decelerationRate="fast"
          contentContainerStyle={styles.flatListContent}
          keyExtractor={(item) => item.id}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
        />
        
        {/* PAGINACIÓN */}
        <View style={styles.paginationContainer}>
          {banners.map((_, index) => (
            <View 
              key={index} 
              style={[
                styles.paginationDot, 
                currentIndex === index && styles.paginationDotActive
              ]}
            />
          ))}
        </View>
      </View>

      <Modal
        visible={isModalVisible}
        onRequestClose={handleCloseModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <ProductDetailModal 
          product={banners[currentIndex]?.productData} 
          onClose={handleCloseModal} 
          deliveryCost={banners[currentIndex]?.productData?.establishment?.deliveryCost}
          establishmentId={banners[currentIndex]?.productData?.establishment?.id}
        />
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    paddingVertical: 5, 
  },
  flatListContent: {
    alignItems: 'center', 
  },
  cardContainer: {
    width: BANNER_WIDTH,
    height: BANNER_HEIGHT,
    borderRadius: 20, 
    backgroundColor: '#eee', 
    overflow: 'hidden', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginHorizontal: Sizes.padding, 
  },
  image: {
    width: '100%',
    height: '100%',
  },
  textOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
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
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15, 
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e0e0e0', 
    marginHorizontal: 4,
  },
  paginationDotActive: {
    width: 20, 
    backgroundColor: Colors.primary, 
  },
});

export default BannerSlider;