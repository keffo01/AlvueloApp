// components/BannerSlider.tsx (Versión Modificada)

import React, { useEffect, useRef, useState } from 'react';
import {
  Button,
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
import { Banner } from '../../models/commons.model';

// Props del componente
interface BannerSliderProps {
  banners: Banner[];
  // Opcional: Propiedad para configurar el intervalo de desplazamiento (en milisegundos)
  interval?: number; 
}
// aqui se controla el tiempo de duracion de cada carta del banner
const BannerSlider: React.FC<BannerSliderProps> = ({ banners, interval = 10000 }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  
  // 💡 NUEVO: Estado para rastrear el índice del banner visible
  const [currentIndex, setCurrentIndex] = useState(0); 
  // 💡 NUEVO: Referencia a la FlatList para poder desplazarla
  const flatListRef = useRef<FlatList<Banner>>(null); 

  // --- LÓGICA DE DESPLAZAMIENTO AUTOMÁTICO ---
  useEffect(() => {
    if (banners.length === 0) return;

    // 1. Configurar el temporizador
    const timer = setInterval(() => {
      // Calcular el próximo índice
      const nextIndex = (currentIndex + 1) % banners.length;
      
      // 2. Actualizar el estado y desplazar la lista
      setCurrentIndex(nextIndex);
      
      // La función `scrollToIndex` mueve la lista. Usamos 'current' de la ref.
      flatListRef.current?.scrollToIndex({ 
        index: nextIndex, 
        animated: true, 
        // offset: 0, // Puedes añadir un offset si es necesario
        // viewPosition: 0.5 // Centra el elemento
      });
      
    }, interval); // Usamos la propiedad 'interval' (por defecto 3000ms = 3 segundos)

    // 3. Limpiar el temporizador al desmontar el componente (CRUCIAL para evitar fugas de memoria)
    return () => clearInterval(timer);
    
  }, [currentIndex, banners.length, interval]); // Dependencias: se ejecuta cada vez que cambia el índice

  // --- LÓGICA DE MANEJO DE BANNER ---
  const handleBannerPress = (banner: Banner) => {
    setSelectedBanner(banner);
    setModalVisible(true);
  };

  const renderBannerItem = ({ item }: { item: Banner }) => (
    <TouchableOpacity 
      style={styles.bannerContainer}
      onPress={() => handleBannerPress(item)}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.imageUri }} style={styles.image} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef} // 💡 Asignamos la referencia
        data={banners}
        renderItem={renderBannerItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        // Desactivamos snapToInterval para evitar conflictos con el scroll automático.
        // snapToInterval={300 + Sizes.smallPadding} 
        // decelerationRate="fast"
      />
      {/* ... Código del Modal (sin cambios) ... */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedBanner?.title}</Text>
            <Text style={styles.modalDescription}>{selectedBanner?.description}</Text>
            <Button title="Cerrar" onPress={() => setModalVisible(false)} color={Colors.primary} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 180, // Altura fija para el slider
    marginBottom: Sizes.padding,
  },
  bannerContainer: {
    width: 360, 
    height: 160,
    marginRight: Sizes.smallPadding,
    borderRadius: Sizes.radius,
    overflow: 'hidden',
    backgroundColor: Colors.lightText,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  // Estilos del Modal
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semitransparente
  },
  modalContent: {
    width: '80%',
    backgroundColor: Colors.background,
    borderRadius: Sizes.radius * 2,
    padding: Sizes.largePadding,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: Sizes.title,
    fontWeight: 'bold',
    marginBottom: Sizes.smallPadding,
    color: Colors.text,
  },
  modalDescription: {
    fontSize: Sizes.font,
    textAlign: 'center',
    marginBottom: Sizes.padding,
    color: Colors.lightText,
  },
});

export default BannerSlider;