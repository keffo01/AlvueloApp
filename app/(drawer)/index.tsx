// screens/HomeScreen.tsx

import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Colors from '../../constants/colors';
import Sizes from '../../constants/Sizes';

// Importar mock data
import { MOCK_BANNERS, MOCK_ESTABLISHMENTS, MOCK_OPTIONS, MOCK_PRODUCTS } from '../../constants/mockData';

// Importar los componentes de sección
import ProductCarousel from '@/compoents/ProductCarousel';
import BannerSlider from '../../compoents/HomeScreen/BannerSlider';
import EstablishmentCard from '../../compoents/HomeScreen/EstablishmentCard';
import QuickOptions from '../../compoents/HomeScreen/QuickOption';

// Componente para títulos de sección (reusable)
const SectionTitle: React.FC<{ title: string }> = ({ title }) => (
  <Text style={styles.sectionTitle}>{title}</Text>
);

const HomeScreen = () => {
  return (
    // ScrollView es esencial para que todo quepa en la pantalla y se pueda desplazar
    <ScrollView style={styles.container}>
      {/* SECCIÓN 1: Banner Slider */}
      <BannerSlider banners={MOCK_BANNERS} />

      {/* SECCIÓN 2: Opciones Rápidas */}
      <SectionTitle title="Explora Categorías" />
      <QuickOptions options={MOCK_OPTIONS} />

           {/* SECCIÓN 3: Carrusel de Productos (¡NUEVO COMPONENTE!) */}
      <SectionTitle title="Productos Destacados" />
      <ProductCarousel 
        products={MOCK_PRODUCTS} 
        interval={4500} // Ejemplo: Cada 4.5 segundos
      />

      {/* SECCIÓN 4: Restaurantes de Prestigio */}
      <SectionTitle title="Establecimientos de Prestigio (Top Likes)" />
      <View style={styles.establishmentList}>
        {MOCK_ESTABLISHMENTS.map((est) => (
          <EstablishmentCard key={est.id} establishment={est} />
        ))}
      </View>
      
      {/* Espacio extra al final para scroll */}
      <View style={{ height: 50 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  sectionTitle: {
    fontSize: Sizes.title,
    fontWeight: 'bold',
    color: Colors.text,
    paddingHorizontal: Sizes.padding,
    marginBottom: Sizes.smallPadding,
    marginTop: Sizes.smallPadding,
  },
  sectionMargin: {
    marginBottom: Sizes.padding,
  },
  horizontalListPadding: {
    paddingHorizontal: Sizes.padding,
  },
  establishmentList: {
    paddingHorizontal: Sizes.padding,
    marginBottom: Sizes.padding * 2,
  }
});

export default HomeScreen;