import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import Colors from '../../constants/colors';
import Sizes from '../../constants/Sizes';

import ProductCarousel from '@/components/ProductCarousel';
import HomeSearchInput from '@/components/search/HomeSearchInput';
import BannerSlider from '../../components/HomeScreen/BannerSlider';
import EstablishmentCard from '../../components/HomeScreen/EstablishmentCard';
import QuickOptions from '../../components/HomeScreen/QuickOption';
import { MOCK_BANNERS, MOCK_ESTABLISHMENTS, MOCK_PRODUCTS } from '../../constants/mockData';
import { useAuth } from '../../context/authContext';

const AppFooter = () => (
  <View style={styles.footerContainer}>
    <View style={styles.footerLine} />
    <View style={styles.brandBadge}>
      <Text style={styles.brandText}>ALVUELO</Text>
      <View style={styles.dot} />
      <Text style={styles.locationText}>San Salvador Norte</Text>
    </View>
    <Text style={styles.copyrightText}>Hecho con ❤️ para Guazapa, Aguilares y El Paisnal</Text>
    <View style={styles.socialIcons}>
       <Ionicons name="logo-facebook" size={20} color={Colors.lightText} style={{ marginHorizontal: 10 }} />
       <Ionicons name="logo-instagram" size={20} color={Colors.lightText} style={{ marginHorizontal: 10 }} />
       <Ionicons name="logo-whatsapp" size={20} color={Colors.lightText} style={{ marginHorizontal: 10 }} />
    </View>
  </View>
);

const SectionTitle: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {subtitle && <Text style={styles.sectionSubtitle}>{subtitle}</Text>}
  </View>
);

const HomeScreen = () => {
  const { userData } = useAuth();
  const userName = userData?.name?.split(' ')[0] || 'Invitado';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* ... (Secciones 1 a 4 se mantienen igual) */}
        <View style={styles.topHeader}>
          <Text style={styles.greeting}>Hola, {userName} 👋</Text>
          <Text style={styles.askText}>¿Qué te llevamos hoy?</Text>
        </View>

        <View style={styles.searchContainer}>
          <HomeSearchInput />
        </View>

        <View style={styles.bannerContainer}>
          <BannerSlider banners={MOCK_BANNERS} />
        </View>

        <View style={styles.sectionMargin}>
          <SectionTitle title="Explora Categorías" />
          <QuickOptions />
        </View>

        <View style={styles.sectionMargin}>
          <SectionTitle title="Destacados de hoy" subtitle="Las mejores opciones elegidas para ti" />
          <ProductCarousel products={MOCK_PRODUCTS} interval={4500} />
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

        {/* 🚀 NUEVA SECCIÓN: FOOTER DE CIERRE */}
        <AppFooter />
        
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
 
  safeArea: { flex: 1, backgroundColor: '#ffffff' },
  container: { flex: 1 },
  topHeader: { paddingHorizontal: Sizes.padding, paddingTop: 20, paddingBottom: 15 },
  greeting: { fontSize: 16, color: Colors.lightText, marginBottom: 4 },
  askText: { fontSize: 24, fontWeight: '800', color: Colors.text },
  searchContainer: { paddingHorizontal: Sizes.padding, marginBottom: 20, zIndex: 1 },
  bannerContainer: { marginBottom: 25 },
  sectionHeader: { paddingHorizontal: Sizes.padding, marginBottom: 15 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: Colors.text, letterSpacing: -0.5 },
  sectionSubtitle: { fontSize: 14, color: Colors.lightText, marginTop: 2 },
  sectionMargin: { marginBottom: 30 },
  establishmentList: { paddingHorizontal: Sizes.padding },

  
  footerContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    backgroundColor: '#F9FAFB', 
    marginTop: 10,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  footerLine: {
    width: 40,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    marginBottom: 20,
  },
  brandBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  brandText: {
    fontSize: 14,
    fontWeight: '900',
    color: Colors.primary,
    letterSpacing: 2,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.lightText,
    marginHorizontal: 8,
  },
  locationText: {
    fontSize: 14,
    color: Colors.lightText,
    fontWeight: '600',
  },
  copyrightText: {
    fontSize: 11,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 40,
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
    opacity: 0.6,
  }
});

export default HomeScreen;