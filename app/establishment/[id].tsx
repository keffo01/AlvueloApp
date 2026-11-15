// app/establishment/[id].tsx
// ✍️ Actualizado por @keffoAlvuelo - Pantalla estática sin ScrollView global; el scroll recae en las pestañas

import CartIcon from '@/components/CartIcon';
import ReviewsTab from '@/components/stablishment/ReviewTab';
import InfoTab from '@/components/view/InfoTab';
import ProductsTab from '@/components/view/ProductsTab';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';

import colors from '../../constants/colors';
import { MOCK_REVIEWS } from '../../constants/mockData';
import Sizes from '../../constants/Sizes';

const { width, height } = Dimensions.get('window');
const initialLayout = { width };

const API_URL = 'https://8bnz9a5r1j.execute-api.us-east-2.amazonaws.com/dev-establisment/establisment'; 

const useEstablishmentData = (id: string) => {
  const [establishment, setEstablishment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;
    
    setLoading(true);
    fetch(`${API_URL}/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('No encontrado');
        return res.json();
      })
      .then(data => {
        setEstablishment(data);
        setError(false);
      })
      .catch(err => {
        console.error("Error fetching establishment:", err);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, [id]);

  return { establishment, loading, error };
};

const EstablishmentDetailScreen: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  
  const rawId = params.id;
  const id: string = Array.isArray(rawId) ? rawId[0] : rawId?.toString() || ''; 
    
  const { establishment, loading, error } = useEstablishmentData(id);
  const [index, setIndex] = useState(0);

  const timeToMinutes = (timeStr: string) => {
    if (!timeStr) return 0;
    const cleanStr = timeStr.trim().toUpperCase();
    const isPM = cleanStr.includes('PM');
    const isAM = cleanStr.includes('AM');
    
    const timePart = cleanStr.replace(/AM|PM/g, '').trim();
    const parts = timePart.split(':');
    let hours = parseInt(parts[0] || '0', 10);
    const minutes = parseInt(parts[1] || '0', 10);

    if (isPM && hours < 12) hours += 12;
    if (isAM && hours === 12) hours = 0;

    return hours * 60 + minutes;
  };

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const filteredProducts = useMemo(() => {
    if (!establishment?.products) return [];

    return establishment.products
      .map((p: any) => ({
        ...p,
        id: p.productId || p.id || Math.random().toString(), 
        price: Number(p.price || 0), 
        establishment: { id: id } 
      }))
      .filter((p: any) => {
        const availableFrom = p.availableFrom || p.available_from;
        const availableUntil = p.availableUntil || p.unaviableFrom || p.unavailableFrom || p.unaviable_from;

        if (availableFrom || availableUntil) {
          const startMin = availableFrom ? timeToMinutes(availableFrom) : 0;
          const endMin = availableUntil ? timeToMinutes(availableUntil) : 1440;

          if (currentMinutes < startMin || currentMinutes > endMin) {
            return false;
          }
        }
        return true;
      });
  }, [establishment?.products, currentMinutes, id]);

  const reviews = MOCK_REVIEWS.filter(r => r.establishmentId === id);

  const [routes] = useState([
    { key: 'products', title: 'Menú' },
    { key: 'reviews', title: `Opiniones (${reviews.length})` }, 
    { key: 'info', title: 'Información' }, 
  ]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error || !establishment) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Establecimiento no encontrado.</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
           <Text style={{ color: colors.primary, fontSize: Sizes.font }}>Volver atrás</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderScene = SceneMap({
    products: () => <ProductsTab products={filteredProducts} deliveryCost={establishment.deliveryCost} />,
    info: () => <InfoTab establishment={establishment} />,
    reviews: () => <ReviewsTab reviews={reviews} establishmentId={id} />, 
  });

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: colors.primary, height: 3 }}
      style={styles.tabBar}
      labelStyle={styles.tabLabel}
      activeColor={colors.primary}
      inactiveColor={colors.lightText}
    />
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }}/>
      
      {/* HEADER FLOTANTE ABSOLUTO */}
      <View style={[styles.customHeader, { top: insets.top > 0 ? insets.top : 20 }]}>
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={styles.headerButtonCircle}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>

        <View>
          <CartIcon />
        </View>
      </View>
      
      {/* CABECERA FIJA DEL ESTABLECIMIENTO (SIN SCROLL GLOBAL) */}
      <View style={styles.headerContainer}>
        <Image 
          source={{ uri: establishment.imageUri }} 
          style={styles.heroImage}
        />
        
        <View style={styles.content}>
          <Text style={styles.title}>{establishment.name}</Text>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={Sizes.icon} color={colors.rating} />
            <Text style={styles.ratingText}>
                {establishment.rating ? Number(establishment.rating).toFixed(1) : 'N/A'} ({establishment.likes || 0})
            </Text>
            <Text style={styles.categoryText}> • {establishment.category}</Text>
          </View>
          <Text style={styles.deliveryText}>
             Costo de Envío: ${establishment.deliveryCost ? Number(establishment.deliveryCost).toFixed(2) : '0.00'}
          </Text>
        </View>
      </View>
      
      {/* CONTENEDOR DE PESTAÑAS CON EL TABVIEW EXPANDIDO */}
      <View style={styles.tabViewWrapper}> 
          <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={initialLayout}
            renderTabBar={renderTabBar}
            style={styles.tabView} 
          />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  errorText: {
    fontSize: Sizes.title,
    color: colors.error,
  },
  headerContainer: {
    backgroundColor: colors.background,
  },
  heroImage: {
    width: '100%',
    height: 200, 
  },
  content: {
    backgroundColor: colors.background,
    borderTopLeftRadius: Sizes.radius * 2, 
    borderTopRightRadius: Sizes.radius * 2,
    marginTop: -Sizes.padding * 1.5, 
    paddingHorizontal: Sizes.padding,
    paddingTop: Sizes.smallPadding,
    paddingBottom: Sizes.smallPadding,
  },
  title: {
    fontSize: 24, 
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: Sizes.font,
    fontWeight: '700',
    color: colors.warning, 
  },
  categoryText: {
    fontSize: Sizes.font,
    color: colors.lightText, 
  },
  deliveryText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.secondary, 
  },
  tabViewWrapper: {
    backgroundColor: colors.background, 
    flex: 1,
  },
  tabView: {
    flex: 1,
  },
  tabBar: {
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    shadowOpacity: 0, 
    elevation: 0,
    paddingHorizontal: Sizes.padding,
  },
  tabLabel: {
    fontSize: Sizes.font,
    fontWeight: 'bold',
  },
  customHeader: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Sizes.padding,
    zIndex: 100, 
    elevation: 100, 
  },
  headerButtonCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
});

export default EstablishmentDetailScreen;