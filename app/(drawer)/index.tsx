// screens/HomeScreen.tsx

import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import Colors from '../../constants/colors';
import Sizes from '../../constants/Sizes';

// Importar mock data
import { MOCK_BANNERS, MOCK_ESTABLISHMENTS, MOCK_PRODUCTS } from '../../constants/mockData';

// Importar los componentes de sección
import ProductCarousel from '@/components/ProductCarousel';
import HomeSearchInput from '@/components/search/HomeSearchInput';
import BannerSlider from '../../components/HomeScreen/BannerSlider';
import EstablishmentCard from '../../components/HomeScreen/EstablishmentCard';
import QuickOptions from '../../components/HomeScreen/QuickOption';
import { useAuth } from '../../context/authContext'; // Para obtener el nombre del usuario

// Título de sección modernizado
const SectionTitle: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {subtitle && <Text style={styles.sectionSubtitle}>{subtitle}</Text>}
  </View>
);

const HomeScreen = () => {
  const { userData } = useAuth();
  const userName = userData?.name.split(' ')[0] || 'Invitado';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false} // Ocultar la barra para un look más limpio
      >
        {/* ENCABEZADO MODERNO */}
        <View style={styles.topHeader}>
          <Text style={styles.greeting}>Hola, {userName} 👋</Text>
          <Text style={styles.askText}>¿Qué te llevamos hoy?</Text>
        </View>

        {/* SECCIÓN 1: Barra de Búsqueda (Subida por jerarquía) */}
        <View style={styles.searchContainer}>
          <HomeSearchInput />
        </View>

        {/* SECCIÓN 2: Banner Slider */}
        <View style={styles.bannerContainer}>
          <BannerSlider banners={MOCK_BANNERS} />
        </View>

        {/* SECCIÓN 3: Opciones Rápidas */}
        <View style={styles.sectionMargin}>
          <SectionTitle title="Explora Categorías" />
          <QuickOptions  />
        </View>

        {/* SECCIÓN 4: Carrusel de Productos */}
        <View style={styles.sectionMargin}>
          <SectionTitle 
            title="Destacados de hoy" 
            subtitle="Las mejores opciones elegidas para ti" 
          />
          <ProductCarousel 
            products={MOCK_PRODUCTS} 
            interval={4500} 
          />
        </View>

        {/* SECCIÓN 5: Restaurantes */}
        <View style={styles.sectionMargin}>
          <SectionTitle title="Favoritos de la zona" />
          <View style={styles.establishmentList}>
            {MOCK_ESTABLISHMENTS.map((est) => (
              <EstablishmentCard key={est.id} establishment={est} />
            ))}
          </View>
        </View>
        
        <View style={{ height: 80 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff', // Fondo blanco puro para más limpieza
  },
  container: {
    flex: 1,
  },
  topHeader: {
    paddingHorizontal: Sizes.padding,
    paddingTop: 20,
    paddingBottom: 15,
  },
  greeting: {
    fontSize: 16,
    color: Colors.lightText,
    marginBottom: 4,
  },
  askText: {
    fontSize: 24,
    fontWeight: '800', // Fuente más gruesa para impacto
    color: Colors.text,
  },
  searchContainer: {
    paddingHorizontal: Sizes.padding,
    marginBottom: 20,
    zIndex: 1, // Para que las sombras no se corten
  },
  bannerContainer: {
    marginBottom: 25,
  },
  sectionHeader: {
    paddingHorizontal: Sizes.padding,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    letterSpacing: -0.5, // Le da un toque más moderno a la fuente
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.lightText,
    marginTop: 2,
  },
  sectionMargin: {
    marginBottom: 30, // Más espacio entre secciones
  },
  establishmentList: {
    paddingHorizontal: Sizes.padding,
  }
});

export default HomeScreen;